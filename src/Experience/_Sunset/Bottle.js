import * as THREE from 'three'
import Experience from '../Experience.js'

export default class Bottle {

    constructor() {
        this.experience = new Experience()
        this.resources = this.experience.resources
        this.scene = this.experience.scene2
        
        // Setup
        this.resource = this.resources.items.andModel

        this.setModel()
    }

    setModel() {
        this.model = this.resource.scene
        this.model.traverse(child => {
            if(child.isMesh) {
                child.castShadow = true
                child.receiveShadow = true
            }
        })
        const scale = 1.5;
        this.model.position.set(-5, 0, 80);
        this.model.children[0].geometry.rotateY(Math.PI * 1.5);
        this.model.children[0].geometry.translate(0, -0.2, 0);
        this.model.children[0].material.roughness = 0.5;

        this.scene.add(this.model)
    }
    

    update() {
        this.t = this.experience.world2.water.water.material.uniforms.time.value
        this.waterSurfaceInfo = this.experience.world2.water.getWaterSurfaceInfo(this.model.position.x, this.model.position.z, this.t);
        this.model.position.y = this.waterSurfaceInfo.position.y;
          this.quat = new THREE.Quaternion().setFromEuler(
            new THREE.Euler(this.waterSurfaceInfo.normal.x, this.waterSurfaceInfo.normal.y, this.waterSurfaceInfo.normal.z)
          );
        this.model.quaternion.rotateTowards(this.quat, this.experience.time.delta * 0.2);
    }
}