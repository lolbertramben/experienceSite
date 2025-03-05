import * as THREE from 'three';

const DoFShader = {
    uniforms: {
      'iResolution': { value: new THREE.Vector2(0, 0) },
      'tDiffuse': { value: null },
      'blurParam': { value: new THREE.Vector2(1, 1) },
      'depthTexture': { value: null },
      'cameraNear': { value: 0.01 },
      'cameraFar': { value: 1.0 },
      'focusParam': { value: new THREE.Vector2(0.1, 0.2) },
      'focalDepth': { value: .16 },
      'focalLength': { value: 0.1 },
      'focusTool': { value: 0.0 },
      'pixelRatio': { value: 1.0 }
    },
    vertexShader: `
      varying vec2 vUv;
  
            void main() {
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
    `,
    fragmentShader: `
      uniform sampler2D tDiffuse;
      uniform sampler2D depthTexture;
      uniform vec2 blurParam;
      uniform vec2 focusParam;
      uniform vec2 iResolution;
      uniform float cameraNear;
      uniform float cameraFar;
      uniform float focalDepth;
      uniform float focusTool;
      uniform float pixelRatio;
  
      varying vec2 vUv;
      varying vec4 pos;
  
      vec3 blurImage (sampler2D tDiffuse, int size, float separation, vec2 iResolution) {
        vec3 color = vec3(0.0);
        float count = 0.0;
  
        for (int i = -size; i <= size; ++i) {
          for (int j = -size; j <= size; ++j) {
            color.rgb += texture2D( tDiffuse, ( gl_FragCoord.xy + (vec2(i, j) * separation)) / iResolution/pixelRatio).rgb;
            count += 1.0;
          }
        }
  
        return color.rgb / count;
      }
  
      float perspectiveDepthToViewZ(float fragCoordZ, float near, float far) {
        return (near * far) / (far - fragCoordZ * (far - near));
      }
  
      float viewZToOrthographicDepth(float viewZ, float near, float far) {
        return (viewZ - near) / (far - near);
      }
  
      float readDepth( sampler2D depthSampler, vec2 coord ) {
              float fragCoordZ = texture2D( depthSampler, coord ).x;
              float viewZ = perspectiveDepthToViewZ( fragCoordZ, cameraNear, cameraFar );
              return viewZToOrthographicDepth( viewZ, cameraNear, cameraFar );
          }
  
      void main() {
        gl_FragColor = texture2D(tDiffuse, vUv);
  
        // Opsætning af variabler
        vec4 color = texture2D(tDiffuse, vUv);
  
        float minDistance = focusParam.x;
        float maxDistance = focusParam.y;
  
        int size = int(blurParam.x);
        if (size <= 0) { 
          gl_FragColor = color;
          return; 
        }
  
        float separation = blurParam.y;
        separation = max(separation, 1.);
  
        // Depth of field effect
  
        vec3 position = vec3(readDepth(depthTexture, vUv));
        vec3 focalPoint = vec3(focalDepth);
  
        float blurDepth = smoothstep(minDistance, maxDistance, length(position - focalPoint));
  
        separation *= blurDepth;
  
        // Generate the out of focus color
        vec3 outOfFocusColor = blurImage(tDiffuse, size, separation, iResolution);
        vec4 inFocusColor = texture2D(tDiffuse, vUv);
  
        float mx = 0.0;
        vec4 cmx = gl_FragColor;
  
        for (int i = -size; i <= size; ++i) {
          for (int j = -size; j <= size; ++j) {
            if (!(distance(vec2(i, j), vec2(0., 0.)) <= float(size))) { continue; }
  
            vec4 c = texture2D( tDiffuse, ( gl_FragCoord.xy + (vec2(i, j) * separation)) / iResolution/pixelRatio);
            float mxt = dot(c.rgb, vec3(0.3, 0.59, 0.11));
            if (mxt > mx) {
              mx = mxt;
              cmx = c;
            }
          }
        }
        outOfFocusColor = cmx.rgb;
  
        gl_FragColor = mix(vec4(outOfFocusColor, 1.0), inFocusColor, 1.0 - length(position - focalPoint));
        //gl_FragColor.rgb = vec3(blurDepth);
        
        //gl_FragColor = texture2D(depthTexture, vUv);
        //gl_FragColor = cmx;
        //gl_FragColor = texture2D(tDiffuse, vUv);
  
        if (focusTool > 0.0) {
          // Draw red color at focal point
          if (length(position - focalPoint) < 0.01) {
            gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
            return;
          }
                gl_FragColor.rgb = 1.0 - vec3( position );
          gl_FragColor.gb *= vec2(blurDepth);
              gl_FragColor.a = 1.0;
        }
  
      }
    `
  };
  
  export { DoFShader };