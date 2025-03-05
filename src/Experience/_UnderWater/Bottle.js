import * as THREE from 'three'
import Experience from '../Experience.js'

export default class Bottle {

    constructor() {
        this.experience = new Experience()
        this.resources = this.experience.resources
        this.scene = this.experience.scene3
        
        // Setup
        this.resource = this.resources.items.faxeKondi2Model
        this.setModel()
        this.setEnvironment()
    }

    setModel() {
        this.model = this.resource.scene
        this.model.traverse(child => {
            if(child.isMesh) {
                child.castShadow = true
                child.receiveShadow = true
                child.geometry.translate(0, 0.1, 0);
                child.geometry.rotateY(-Math.PI/2 * 1.1);
            }
        })
        const scale = 1;
        this.model.position.set(0, 0, 10);
        this.model.scale.set(scale, scale, scale);

        this.scene.add(this.model)
    }

    setEnvironment() {
        this.bottleLight = new THREE.SpotLight(0xffffff, 10, 2, Math.PI / 10, 0.5, 1);
        this.bottleLight.position.set(0, 0, 0);
        this.bottleLight.distance = 5
        this.bottleLight.decay = 1
        this.bottleLight.shadow.mapSize.width = 1024 * 1; // Justér skyggeopløsning
        this.bottleLight.shadow.mapSize.height = 1024 * 1;
        this.bottleLight.shadow.bias = -0.01; // Justér skygge bias

        this.scene.add(this.bottleLight);

        this.lightHelper = new THREE.SpotLightHelper(this.bottleLight);
        this.scene.add(this.lightHelper)
    }
    

    update() {
        this.t = this.experience.time.elapsed / 1000
        this.waterSurfaceInfoY = this.getWaterSurfaceInfo(this.model.position.x, this.model.position.z, this.t);
        this.waterSurfaceInfoX = this.getWaterSurfaceInfo(this.model.position.y, this.model.position.z, this.t);
        this.waterSurfaceInfo = this.getWaterSurfaceInfo(this.model.position.x, this.model.position.y, this.t);
        this.model.position.y = this.waterSurfaceInfoY.position.y * 0.2;
        this.model.position.x = Math.sin(this.experience.time.elapsed / 1000) * 0.2 - 2;
          this.quat = new THREE.Quaternion().setFromEuler(
            new THREE.Euler(this.waterSurfaceInfo.normal.x, this.waterSurfaceInfo.normal.y, this.waterSurfaceInfo.normal.z)
          );
        this.model.quaternion.rotateTowards(this.quat, this.experience.time.delta * 2.5);
        this.model.position.y -= this.experience.scrollProgress + 2.5;
        console.log(this.experience.scrollProgress)
        
        this.bottleLight.position.x = this.model.position.x + 1;
        this.bottleLight.position.y = this.model.position.y + 3;
        this.bottleLight.position.z = this.model.position.z + 1;
        this.bottleLight.target.position.set(this.model.position.x, this.model.position.y, this.model.position.z);
        //this.lightHelper.update();
    }

    getWaterSurfaceInfo(x, z, time) {
            const pos = new THREE.Vector3();
            const tangent = new THREE.Vector3(1, 0, 0);
            const binormal = new THREE.Vector3(0, 0, 1);
            Object.keys(this.experience.world2.water.wavesInfo).forEach((wave) => {
            
              const w = this.experience.world2.water.wavesInfo[wave];
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
}