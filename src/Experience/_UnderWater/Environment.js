import * as THREE from 'three';
import Experience from '../Experience';

export default class Environment {

    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene3
        this.resources = this.experience.resources
        this.debug = this.experience.debug

        // Options

        // Setup
        this.scene.fog = new THREE.Fog(0x164835, 5, 25); // Color, near, far
        this.scene.background = new THREE.Color(0x154734);

        this.environmentMap()
        this.setLights()
        
    }

    environmentMap() {
        this.environmentMap = {}
        this.environmentMap.intensity = 1.2
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
    
        // Debug
        if(this.debug.active) {
            this.debugFolder.add(this.environmentMap, 'intensity')
            .step(0.01)
            .min(0)
            .max(1)
            .name('EnvMap intensity')
            .onChange(this.environmentMap.updateMaterials)
        }
    }

    setLights() {
    
        // Add directional light
        this.topLight = new THREE.SpotLight(0xe6007d, 10)
        this.topLight.position.set(0, 10, 2)
        this.topLight.target.position.set(0, 0, 0)
        this.topLight.angle = Math.PI / 3; // Angle of the topLight cone
        this.topLight.penumbra = 0.9; // Softness of the topLight edge
        this.topLight.decay = 0.5; // How the light dims along the distance
        this.topLight.distance = 20; // Maximum range of the light
        this.topLight.castShadow = true; // Enable shadows
        this.scene.add(this.topLight)
        // Add under light
        this.underLight = new THREE.DirectionalLight(0xf59e24, .25)
        this.underLight.position.set(0, -5, 0)
        this.scene.add(this.underLight)
    
        this.topLightGuide = new THREE.SpotLightHelper( this.topLight, 5 );
        this.topLightGuide.children[0].material.color.set(0xff0000)
        // this.scene.add( this.topLightGuide );
        this.dirLightBottomGuide = new THREE.DirectionalLightHelper( this.underLight, 5 );
        // this.scene.add( this.dirLightBottomGuide );
    }

    update() {
    }
}