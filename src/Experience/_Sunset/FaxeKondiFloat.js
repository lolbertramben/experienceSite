import * as THREE from 'three';
import Experience from '../Experience';

export default class FaxeKondiFloat {

    constructor() {
        this.experience = new Experience()
        this.resources = this.experience.resources
        this.scene = this.experience.scene2
            
        // Setup
        this.resource = [
            this.resources.items.faxeModel,
            this.resources.items.kondiModel
        ]
        this.models = []
        this.setModel()
    }

    setModel() {
        const offset = 68
        this.resource.forEach((resource, index) => {
            const model = resource.scene
            model.traverse(child => {
                if(child.isMesh) {
                    child.castShadow = true
                    child.receiveShadow = true
                    child.geometry.translate(0, -0.15, 0);
                    //child.geometry.rotateY(-Math.PI/2);
                }
            })
            const scale = 12.5;
            model.position.set(offset * index - 0, 0, -15);
            model.scale.set(scale, scale, scale);
            this.scene.add(model)
            this.models.push(model)
        })
        this.models[1].position.z += 5
        this.models[1].rotation.y -= Math.PI/2 * 0.2
    }
        
    
        update() {
            this.t = this.experience.world2.water.water.material.uniforms.time.value

            this.models.forEach((model, index) => {
                this.waterSurfaceInfo = this.experience.world2.water.getWaterSurfaceInfo(model.position.x, model.position.z, this.t);
                model.position.y = this.waterSurfaceInfo.position.y;
                  this.quat = new THREE.Quaternion().setFromEuler(
                    new THREE.Euler(this.waterSurfaceInfo.normal.x, model.rotation.y, this.waterSurfaceInfo.normal.z)
                  );
                model.quaternion.rotateTowards(this.quat, this.experience.time.delta * 0.2);
            });
        }
}