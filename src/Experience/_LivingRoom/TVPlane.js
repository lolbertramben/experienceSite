import * as THREE from "three";
import Experience from "../Experience";
import { lerp, wave } from "../Utils/utils";
import { SpotLightMaterial } from '../Utils/Shaders/SpotLightMaterial'

export default class TVPlane {

    constructor() {

        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.time = this.experience.time
        this.debug = this.experience.debug
        this.sunsetTexture = this.experience.renderTargetSunset.texture
        this.underWaterTexture = this.experience.renderTargetUnderWater.texture
        this.spotLightPosition = new THREE.Vector3(2.67, 1.325, 0.1)
        this.isFullscreen = false
        this.onOff = false

        this.tvLightSettings = {
            angle: Math.PI / 3,
            intensityOn: 2,
            intensityOff: 0,
            distance: 10,
            decayOn: 1.5,
            decayOff: 2,
            penumbra: 1,
            color: '#ffeeaa',
        }
        this.tvVolumeSettings = {
            opacity: 0.25, // volume shader opacity
            attenuation: 2.5, // how far the volume will travel
            anglePower: 12, // volume edge fade
            spotPosition: this.spotLightPosition, // spotlight's world position
            lightColor: new THREE.Color(this.tvLightSettings.color), // volume color
            cameraNear: 0, // for depth
            cameraFar: 10, // for depth
            depth: null, // for depth , add depthTexture here
            resolution: new THREE.Vector2(0, 0), // for depth , set viewport/canvas resolution here
        }

        this.goToLightIntensity = this.debug.active ? this.tvLightSettings.intensityOn : this.tvLightSettings.intensityOff
        this.goToLightDecay = this.debug.active ? this.tvLightSettings.decayOn : this.tvLightSettings.decayOff

        // Setup
        this.setModel()  
        this.setLight()
        this.setCone()
        this.toggle(this.debug.active)
    }

    setModel() {
        this.transitionControl = 1
        this.tvPlaneGeometry = new THREE.PlaneGeometry(2, 2, 1, 1)
        this.tvPlaneMaterial = new THREE.ShaderMaterial({
            uniforms: {
                progression: {value: 0},
                tex: {value: this.sunsetTexture},
                tex2: {value: this.underWaterTexture},
                transition: {value: 1},
                transitionControl: { value: this.transitionControl },
                uOnOff: { value: this.onOff ? 1 : 0 }
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
        });
    
        this.tvPlane = new THREE.Mesh(this.tvPlaneGeometry, this.tvPlaneMaterial)
        //this.tvPlane.rotation.z = -Math.PI / 2
        this.tvPlane.rotation.y = -Math.PI / 2
        this.tvPlane.position.set(2.62, 1.375, 0)
        this.tvPlane.receiveShadow = true
        this.scene.add(this.tvPlane)
    }

    setLight() {
        this.tvLight = new THREE.SpotLight(this.tvLightSettings.color, this.goToLightIntensity)
        this.tvLight.angle = this.tvLightSettings.angle
        this.tvLight.distance = 10
        this.tvLight.decay = this.goToLightDecay
        this.tvLight.penumbra = 1
        this.tvLight.position.set(this.spotLightPosition.x, this.spotLightPosition.y + 0.1, this.spotLightPosition.z)
        this.tvLight.target.position.set(0, 1.2, 0)
        this.tvLight.castShadow = true;
        this.tvLight.shadow.mapSize.width = 1024 * 1; // Justér skyggeopløsning
        this.tvLight.shadow.mapSize.height = 1024 * 1;
        this.tvLight.shadow.bias = -0.01; // Justér skygge bias
        this.scene.add(this.tvLight)

        // Debug
        this.tvLightHelper = new THREE.SpotLightHelper(this.tvLight)
        this.tvLightHelper.visible = this.debug.active
        this.scene.add(this.tvLightHelper)
    }

    setCone() {
        this.coneOnOffValue = 0
        this.coneOnOffValueGoTo = 0
        this.volumeMaterial = new SpotLightMaterial({
            opacity: this.tvVolumeSettings.opacity,
            attenuation: this.tvVolumeSettings.attenuation,
            anglePower: this.tvVolumeSettings.anglePower,
            spotPosition: this.tvVolumeSettings.spotPosition,
            lightColor: this.tvVolumeSettings.lightColor,
          
            cameraNear: 0, // for depth
            cameraFar: 10, // for depth
            depth: null, // for depth , add depthTexture here
            resolution: new THREE.Vector2(0, 0), // for depth , set viewport/canvas resolution here
        })

        this.volumeGeometry = new THREE.CylinderGeometry(0.5, 5, 5, 128, 64, true)
        this.volume = new THREE.Mesh(this.volumeGeometry, this.volumeMaterial)
        this.volume.geometry.translate(0, -2.5, 0)
        this.volume.geometry.rotateZ(-Math.PI / 2)
        this.volume.rotateZ(Math.PI / 40)
        this.volume.position.set(this.spotLightPosition.x, this.spotLightPosition.y, this.spotLightPosition.z)
        this.scene.add(this.volume)
    }

    toggle(onOff) {
        this.onOff = onOff
        this.goToLightIntensity = onOff ? this.tvLightSettings.intensityOn : this.tvLightSettings.intensityOff
        this.goToLightDecay = onOff ? this.tvLightSettings.decayOn : this.tvLightSettings.decayOff
        this.coneOnOffValueGoTo = onOff ? 1 : 0
        this.tvPlaneMaterial.uniforms.uOnOff.value = onOff
    }

    update() {
        this.tvPlaneMaterial.emissiveIntensity = lerp, wave(this.tvPlaneMaterial.emissiveIntensity, this.goToEmissionIntensity, 0.1)
        this.tvLight.intensity = lerp(this.tvLight.intensity, this.goToLightIntensity, 0.1)
        this.tvLight.decay = lerp(this.tvLight.decay, this.goToLightDecay, 0.1)

        this.coneOnOffValue = lerp(this.coneOnOffValue, this.coneOnOffValueGoTo, 0.1)
        const wave1 = wave(this.time.elapsed, 0.1, 0, 2, 6.5)
        const wave2 = wave(this.time.elapsed, 0.05, 0, 1, 12)
        const wave3 = wave(this.time.elapsed, 0.1, 0, 1, 4.3)
        const superPosition = 0.12 + (wave1 + wave2 + wave3) * 0.5
        this.volumeMaterial.uniforms.opacity.value = superPosition * this.coneOnOffValue
        this.tvLight.angle = this.tvLightSettings.angle + superPosition * 0.8 - 0.25 * this.coneOnOffValue

        if (this.isFullscreen) {
            this.transitionControl = lerp(this.transitionControl, 0, 0.005)
        } else {
            this.transitionControl = lerp(this.transitionControl, 1, 0.005)
        }
        this.tvPlane.scale.x = 1 - 0.75/2 * this.transitionControl
        this.tvPlane.scale.y = 1 - 1.32/2 * this.transitionControl
        this.tvPlaneMaterial.uniforms.transitionControl.value = this.transitionControl

        // Debug
        this.tvLightHelper.visible = this.debug.active
    }

    updateProgression(progression) {
        this.tvPlaneMaterial.uniforms.progression.value = -progression - 1
    }
}