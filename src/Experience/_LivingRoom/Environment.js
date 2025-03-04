import * as THREE from 'three'
import Experience from '../Experience.js'
import { lerp } from '../Utils/utils.js'

export default class Environment {

    constructor() {
        
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.debug = this.experience.debug

        if(this.debug.active) {
            this.debugFolder = this.debug.ui.addFolder('Environment')
        }

        // Options
        this.ambientLightOn = 0.05;
        this.ambientLightOff = 0;
        this.goToAmbientLightIntensity = this.debug.active ? this.ambientLightOn : this.ambientLightOff

        // Setup
        this.setSunLight()
        this.environmentMap()
        this.toggle(this.debug.active)
    }

    setSunLight() {
        this.ambientLight = new THREE.AmbientLight(0xffeedd, this.debug.active ? this.ambientLightOn : this.ambientLightOff)
        this.scene.add(this.ambientLight)
    }

    environmentMap() {
        this.environmentMap = {}
        this.environmentMap.intensity = 0
        this.environmentMap.texture = this.resources.items.environmentMapTexture
        this.environmentMap.texture.colorSpace = THREE.SRGBColorSpace

        this.scene.environment = this.environmentMap.texture

        this.environmentMap.updateMaterials = () => {
            this.scene.traverse((child) => {
                if(child.isMesh && child.material.isMeshStandardMaterial) {
                    child.material.envMap = this.environmentMap.texture
                    child.material.envMapIntensity = this.environmentMap.intensity
                    child.material.needsUpdate = true
                }
            })
        }

        this.environmentMap.updateMaterials()
    }

    toggle(onOff) {
        this.goToAmbientLightIntensity = onOff ? this.ambientLightOn : this.ambientLightOff
    }

    update() {
        this.ambientLight.intensity = lerp(this.ambientLight.intensity, this.goToAmbientLightIntensity, 0.05)
    }

}