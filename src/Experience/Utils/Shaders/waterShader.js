
const waterVertexShader = `
uniform mat4 textureMatrix;
            uniform float time;

			varying vec2 vUv;
            varying vec4 mirrorCoord;
            varying vec4 worldPosition;

            #include <common>
            #include <fog_pars_vertex>
            #include <shadowmap_pars_vertex>
            #include <logdepthbuf_pars_vertex>

            uniform vec4 waveA;
            uniform vec4 waveB;
            uniform vec4 waveC;

            vec3 GerstnerWave (vec4 wave, vec3 p) {
            	float steepness = wave.z;
            	float wavelength = wave.w;
            	float k = 2.0 * PI / wavelength;
            	float c = sqrt(9.8 / k);
            	vec2 d = normalize(wave.xy);
            	float f = k * (dot(d, p.xy) - c * time);
            	float a = steepness / k;

            	return vec3(
            		d.x * (a * cos(f)),
            		d.y * (a * cos(f)),
            		a * sin(f)
            	);
            }

            void main() {
				vUv = uv;
            	mirrorCoord = modelMatrix * vec4( position, 1.0 );
            	worldPosition = mirrorCoord.xyzw;
            	mirrorCoord = textureMatrix * mirrorCoord;

            	vec3 p = position.xyz;
            	p += GerstnerWave(waveA, position.xyz);
            	p += GerstnerWave(waveB, position.xyz);
            	p += GerstnerWave(waveC, position.xyz);
            	gl_Position = projectionMatrix * modelViewMatrix * vec4( p.x, p.y, p.z, 1.0);

            	#include <beginnormal_vertex>
            	#include <defaultnormal_vertex>
            	#include <logdepthbuf_vertex>
            	#include <fog_vertex>
            	#include <shadowmap_vertex>
            }`

export { waterVertexShader }

const waterFragmentShader = `
uniform sampler2D mirrorSampler;
	uniform float alpha;
	uniform float time;
	uniform float size;
	uniform float distortionScale;
	uniform sampler2D normalSampler;
	uniform vec3 sunColor;
	uniform vec3 sunDirection;
	uniform vec3 eye;
	uniform vec3 waterColor;
	uniform sampler2D skyTexture;
	uniform vec2 iResolution;

	varying vec2 vUv;
	varying vec4 mirrorCoord;
	varying vec4 worldPosition;

	const float noiseSpeed = 1.2;
	const float fogNear = 1.0;
	const float fogFar = 1000.0;

	const float inBlack = 0.9;   // Skygger bliver sortere
	const float inWhite = 1.0;   // Højlys bliver lysere
	const float gamma = 1.;     // Mellemtonerne lysnes
	const float outBlack = 0.0;  // Sortniveau forbliver sort
	const float outWhite = .8;  // Hvidniveau forbliver hvid

	vec4 getNoise( vec2 uv ) {
		vec2 uv0 = ( uv / 103.0 ) + vec2(time / 17.0, time / 29.0 ) * noiseSpeed;
		vec2 uv1 = uv / 107.0-vec2( time / -19.0, time / 31.0 ) * noiseSpeed;
		vec2 uv2 = uv / vec2( 8907.0, 9803.0 ) + vec2( time / 101.0, time / 97.0 ) * noiseSpeed;
		vec2 uv3 = uv / vec2( 1091.0, 1027.0 ) - vec2( time / 109.0, time / -113.0 ) * noiseSpeed;
		vec4 noise = 
			texture2D( normalSampler, uv0 ) +
			texture2D( normalSampler, uv1 ) +
			texture2D( normalSampler, uv2 ) +
			texture2D( normalSampler, uv3 );
		return noise * .5 - .9;
	}

	vec3 applyLevels(vec3 color, float inBlack, float inWhite, float gamma, float outBlack, float outWhite) {
		// Normaliser inputområdet
		color = clamp((color - inBlack) / (inWhite - inBlack), 0.0, 1.0);
	
		// Påfør gamma-korrektion
		color = pow(color, vec3(gamma));
	
		// Skalér til outputområdet
		color = mix(vec3(outBlack), vec3(outWhite), color);
	
		return color;
	}

	vec3 applyBloom(vec3 color, vec2 uv, float radius, float strength, float threshold) {
		vec3 bloom = vec3(0.0);
	
		// Thresholding: Bevar kun pixels over en vis lysstyrke
		vec3 brightColor = max(color - threshold, 0.0);
	
		// Gaussian blur vægte (baseret på THREE.js)
		float weights[5] = float[](0.227027, 0.1945946, 0.1216216, 0.054054, 0.016216);
	
		// Sample midterpixel
		bloom += brightColor * weights[0];
	
		// Blur i begge retninger (X & Y)
		for (int i = 1; i < 5; ++i) {
			float fi = float(i);
	
			bloom += texture2D(mirrorSampler, uv + vec2(radius * fi, 0.0)).rgb * weights[i];
			bloom += texture2D(mirrorSampler, uv - vec2(radius * fi, 0.0)).rgb * weights[i];
			bloom += texture2D(mirrorSampler, uv + vec2(0.0, radius * fi)).rgb * weights[i];
			bloom += texture2D(mirrorSampler, uv - vec2(0.0, radius * fi)).rgb * weights[i];
		}
	
		// Justér bloom-intensitet
		return bloom * strength * color;
	}

	void sunLight( const vec3 surfaceNormal, const vec3 eyeDirection, float shiny, float spec, float diffuse, inout vec3 diffuseColor, inout vec3 specularColor ) {
		vec3 reflection = normalize( reflect( -sunDirection, surfaceNormal ) );
		float direction = max( 0.0, dot( eyeDirection, reflection ) );
		specularColor += pow( direction, shiny ) * sunColor * spec;
		diffuseColor += max( dot( sunDirection, surfaceNormal ), 0.0 ) * sunColor * diffuse;

		vec3 hilightsSpec = applyLevels(specularColor, inBlack, inWhite, gamma, outBlack, outWhite);

		// Anvend Unreal Bloom på højlysene
    	vec3 bloomEffect = applyBloom(hilightsSpec, vUv, 0.0, 3., 10.0); // radius, strength, threshold

		specularColor = 1.0 - (1.0 - specularColor) * (1.0 - hilightsSpec * 50.);
		specularColor += bloomEffect;
		//specularColor = hilightsSpec;
	}

	#include <common>
	#include <packing>
	#include <bsdfs>
	#include <fog_pars_fragment>
	#include <logdepthbuf_pars_fragment>
	#include <lights_pars_begin>
	#include <shadowmap_pars_fragment>
	#include <shadowmask_pars_fragment>

	void main() {

		#include <logdepthbuf_fragment>
		float depth = gl_FragCoord.z / gl_FragCoord.w;
		float fogFactor = smoothstep( fogNear, fogFar, depth );

		vec2 uv = ( iResolution.xy - gl_FragCoord.xy ) / iResolution.y;

		vec4 skyColor = texture2D( skyTexture, uv);
		
		vec4 noise = getNoise( worldPosition.xz * size );
		vec3 surfaceNormal = normalize( noise.xzy * vec3( 1.5, 1.0, 1.5 ) );

		vec3 diffuseLight = vec3(0.0);
		vec3 specularLight = vec3(0.0);

		vec3 worldToEye = eye-worldPosition.xyz;
		vec3 eyeDirection = normalize( worldToEye );
		sunLight( surfaceNormal, eyeDirection, 10.0, 1.0, 0.0, diffuseLight, specularLight );

		float distance = length(worldToEye);

		vec2 distortion = surfaceNormal.xz * ( 0.001 + 1. / distance ) * distortionScale;
		vec3 reflectionSample = vec3(texture2D( mirrorSampler, mirrorCoord.xy / mirrorCoord.w + distortion	 ) );

		float theta = max( dot( eyeDirection, surfaceNormal ), 0.0 );
		float rf0 = 0.3;
		float reflectance = rf0 + ( 1.5 - rf0 ) * pow( ( .8 - theta ), 2.5 );
		vec3 scatter = max( 0.0, dot( surfaceNormal, eyeDirection ) ) * waterColor;
		vec3 albedo = mix( ( sunColor * diffuseLight * .1 + scatter ) * getShadowMask(), ( vec3( 0.1 ) + reflectionSample * .5 + reflectionSample * specularLight ), reflectance);
		vec3 outgoingLight = albedo;
		vec3 finalColor = mix( outgoingLight, skyColor.xyz, clamp(fogFactor, 0.0, 1.0) );


		gl_FragColor = vec4( finalColor, alpha );

		specularLight = applyBloom(specularLight, vUv, 10., 2.5, 0.0); // radius, strength, threshold
		vec3 tempColor = texture2D( normalSampler, vUv ).rgb;
		//gl_FragColor = vec4(specularLight, 1.0);
		//gl_FragColor = vec4(vec3(depth), 1.0);

		#include <tonemapping_fragment>
		#include <fog_fragment>
	}`

export { waterFragmentShader }
