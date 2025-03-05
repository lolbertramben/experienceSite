export const transitionMaterial = {
  uniforms: {
    progression: 1,
    tex: undefined,
    tex2: undefined,
    transition: 0,
  },
  vertexShader: `
              uniform float transitionControl;
  
              varying vec2 vUv;
              void main() {
                  vUv = uv;
                  // Beregn de to gl_Position værdier
                  vec4 projectedPosition = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                  vec4 fullScreen = vec4(position, 1.0);
      
                  // Interpolér mellem de to positioner baseret på transitionControl
                  gl_Position = mix(fullScreen, projectedPosition, transitionControl);
              }
          `,
  fragmentShader: `
              uniform sampler2D tex;
              uniform sampler2D tex2;
              uniform float progression;
              uniform int transition;
              uniform float transitionControl;
              uniform int uOnOff;
  
              varying vec2 vUv;
  
              void main() {
  
                  vec4 _texture = texture2D(tex, vUv);
                  vec4 _texture2 = texture2D(tex2, vUv);
  
  
                  if(uOnOff == 0) {
                      gl_FragColor = vec4(0.0);
                  } else {                
                      vec4 finalTexture;
                      if (transition == 0) { // HORIZONTAL
                       finalTexture = mix(_texture2, _texture, step(progression, vUv.x));
                      }
                      if (transition == 1) { // VERTICAL
                        finalTexture = mix(_texture2, _texture, step(progression, vUv.y));
                      }
                      gl_FragColor = finalTexture;
                  }
  
                  //gl_FragColor = texture2D(tex2, vUv);
                      
                      #include <tonemapping_fragment>
                      #include <colorspace_fragment>
              }
          `
  }
