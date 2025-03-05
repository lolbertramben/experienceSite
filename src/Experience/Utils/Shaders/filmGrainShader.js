import * as THREE from 'three';

const FilmGrainShader = {
    uniforms: {
      tInput: { value: null },
      iTime: { value: 0.0 },
      iResolution: { value: new THREE.Vector2(0, 0) }
    },
    vertexShader: `
      varying vec2 vUv;
  
            void main() {
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
    
    `,
    fragmentShader: `
      #define PI 3.14159265359
  
      uniform float iTime;
      uniform sampler2D tInput;
      uniform vec2 iResolution;
  
      varying vec2 vUv;
  
      void main() {
        float amount = 0.05;
  
        vec4 color = texture2D(tInput, vUv);
  
        float randomIntensity = fract( 100000. * sin(( gl_FragCoord.x + gl_FragCoord.y * iTime) * PI));
        amount *= randomIntensity;
        color.rgb += amount;
  
        gl_FragColor = color;
      }
  
    `
  };
  
  export { FilmGrainShader };