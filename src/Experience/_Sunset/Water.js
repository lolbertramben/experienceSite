import * as THREE from 'three'
import { Water } from 'three/examples/jsm/objects/Water';
import Experience from '../Experience.js'
import { waterVertexShader, waterFragmentShader } from '../Utils/Shaders/waterShader.js';

export default class WaterEnvironment {

    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene2
        this.resources = this.experience.resources
        this.debug = this.experience.debug

        // Options
        this.wavesInfo = {
            A: {
              direction: 0,
              steepness: 0.05,
              wavelength: 100
            },
            B: {
              direction: 160,
              steepness: 0.05,
              wavelength: 100
            },
            C: {
              direction: 116,
              steepness: 0.025,
              wavelength: 100
            },
        }

        // Setup
        this.setWater()
    }

    setWater() {
        this.waterGeometry = new THREE.PlaneGeometry(10000, 10000, 1024, 1024)
        this.textureSize = 2048;
        this.resources.items.waterNormals.wrapS = this.resources.items.waterNormals.wrapT = THREE.RepeatWrapping
        this.water = new Water(this.waterGeometry, {
            textureWidth: this.textureSize,
            textureHeight: this.textureSize,
            waterNormals: this.resources.items.waterNormals,
            sunDirection: new THREE.Vector3(),
            sunColor: 0xffffff,
            waterColor: 0x001538,
            distortionScale: 3,
            fog: this.scene.fog !== undefined
        })
        this.water.rotation.x = - Math.PI / 2

        this.water.material.onBeforeCompile = (shader) => {
            shader.uniforms.waveA = {
              value: [
                Math.sin((this.wavesInfo.A.direction * Math.PI) / 180),
                Math.cos((this.wavesInfo.A.direction * Math.PI) / 180),
                this.wavesInfo.A.steepness,
                this.wavesInfo.A.wavelength,
              ],
            };
            shader.uniforms.waveB = {
              value: [
                Math.sin((this.wavesInfo.B.direction * Math.PI) / 180),
                Math.cos((this.wavesInfo.B.direction * Math.PI) / 180),
                this.wavesInfo.B.steepness,
                this.wavesInfo.B.wavelength,
              ],
            };
            shader.uniforms.waveC = {
              value: [
                Math.sin((this.wavesInfo.C.direction * Math.PI) / 180),
                Math.cos((this.wavesInfo.C.direction * Math.PI) / 180),
                this.wavesInfo.C.steepness,
                this.wavesInfo.C.wavelength,
              ],
            };
            shader.vertexShader = waterVertexShader
            shader.fragmentShader = waterFragmentShader
            
        };
        
        this.scene.add(this.water)
    }

    getWaterSurfaceInfo(x, z, time) {
        const pos = new THREE.Vector3();
        const tangent = new THREE.Vector3(1, 0, 0);
        const binormal = new THREE.Vector3(0, 0, 1);
        Object.keys(this.wavesInfo).forEach((wave) => {
        
          const w = this.wavesInfo[wave];
          const k = (Math.PI * 2) / w.wavelength;
          const c = Math.sqrt(9.8 / k);
          const d = new THREE.Vector2(
            Math.sin((w.direction * Math.PI) / 180),
            -Math.cos((w.direction * Math.PI) / 180)
          );
          const f = k * (d.dot(new THREE.Vector2(x, z)) - c * time);
          const a = w.steepness / k;
      
          pos.x += d.y * (a * Math.cos(f));
          pos.y += a * Math.sin(f);
          pos.z += d.x * (a * Math.cos(f));
      
          tangent.x += -d.x * d.x * (w.steepness * Math.sin(f));
          tangent.y += d.x * (w.steepness * Math.cos(f));
          tangent.z += -d.x * d.y * (w.steepness * Math.sin(f));
      
          binormal.x += -d.x * d.y * (w.steepness * Math.sin(f));
          binormal.y += d.y * (w.steepness * Math.cos(f));
          binormal.z += -d.y * d.y * (w.steepness * Math.sin(f));
      
        });
    
        const normal = binormal.cross(tangent).normalize();
    
        return {
          position: pos,
          normal: normal
        };
    }

    update() {
        this.water.material.uniforms.time.value = this.experience.time.elapsed / 1000
    }
}