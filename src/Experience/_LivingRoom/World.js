import * as THREE from 'three'
import { RenderPass } from 'three/examples/jsm/Addons.js'
import { UnrealBloomPass } from 'three/examples/jsm/Addons.js'
import Experience from '../Experience.js'
import Environment from './Environment.js'
import LivingRoom from './LivingRoom.js'
import TVPlane from './TVPlane.js'
import Dialogue from './Dialogue.js'

export default class World {

    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.camera = this.experience.camera
        this.renderer = this.experience.renderer.instance
        this.composer = this.experience.composer
        this.input = this.experience.input
        this.resources = this.experience.resources
        this.DOMElements = document.querySelector('.living-room')
        this.mouse = this.experience.mouse
        this.moveWithMouse = true

        this.onOff = false

        this.cameraPositions = {
            position1: {
                position: new THREE.Vector3(2.4, 1.4, 3),
                lookAt: new THREE.Vector3(1, 1, 0),
            },
            position2: {
                position: new THREE.Vector3(-0.15, 1., 0.3),
                lookAt: new THREE.Vector3(1, 1, 0),
            },
            position3: {
                position: new THREE.Vector3(1.8, 1.375, 0),
                lookAt: new THREE.Vector3(2.62, 1.375, 0),
            },
        }

        // Setup
        this.livingRoom = new LivingRoom()
        this.tvPlane = new TVPlane()
        this.environment = new Environment()
        this.dialogue = new Dialogue()
        // Camera go to start position
        this.camera.instance.position.copy(this.cameraPositions.position1.position)
        this.camera.instance.lookAt(this.cameraPositions.position1.lookAt)
        this.camera.goToPos = this.cameraPositions.position1.position
        this.camera.goToLookAt = this.cameraPositions.position1.lookAt

        // Show DOM elements
        this.DOMElements.classList.remove('hidden')

        this.setPostProcessing()

        // Listeners
        this.input.on('key-1', () => { 
            this.setting1()
         })
        this.input.on('key-2', () => { 
            this.setting2()
         })
        this.input.on('key-3', () => { 
            this.setting3()
         })
        this.input.on('key-t', () => { 
            this.toggleContext()
        })
    }

    update() {
        this.tvPlane.update()
        this.environment.update()
        this.dialogue.update()
        if(this.moveWithMouse) this.camera.updateCameraWithMouse()
    }

    toggleContext() {
        this.onOff = !this.onOff
        this.tvPlane.toggle(this.onOff)
        this.environment.toggle(this.onOff)
    }

    setPostProcessing() {
        this.renderPass = new RenderPass(this.scene, this.camera.instance)
        this.composer.addPass(this.renderPass)
        this.bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 0.01, 1, 0.99)
        this.composer.addPass(this.bloomPass)
    }

    postProcessing() {
        this.composer.render()
    }

    setting1() {
        this.camera.goToPos = this.cameraPositions.position1.position
        this.camera.goToLookAt = this.cameraPositions.position1.lookAt
        this.camera.lerpStep = 0.005
        this.camera.lookAtLerpStep = 0.01
        this.moveWithMouse = true
        this.experience.body.style.overflowY = 'hidden'
        this.dialogue.isHidden = false
        this.experience.exposureGoTo = 1.75
        window.scrollTo(0, 0)
        this.tvPlane.isFullscreen = false
        this.experience.isFullscreen = false
        this.experience.fullScreenToggle()
    }

    setting2() {
        this.camera.goToPos = this.cameraPositions.position2.position
        this.camera.goToLookAt = this.cameraPositions.position2.lookAt
        this.camera.lerpStep = 0.005
        this.camera.lookAtLerpStep = 0.01
        this.moveWithMouse = true
        this.dialogue.isHidden = false
        this.experience.exposureGoTo = 1.75
        window.scrollTo(0, 0)
        this.experience.resetVideo()
        this.tvPlane.isFullscreen = false
        this.experience.isFullscreen = false
        this.experience.fullScreenToggle()
        this.experience.body.style.overflowY = 'hidden'
    }

    setting3() {
        this.camera.goToPos = this.cameraPositions.position3.position
        this.camera.goToLookAt = this.cameraPositions.position3.lookAt
        this.camera.lerpStep = 0.01
        this.camera.lookAtLerpStep = 0.025
        this.moveWithMouse = false
        this.experience.body.style.overflowY = 'auto'
        this.dialogue.isHidden = true
        this.experience.exposureGoTo = 1
        window.scrollTo(0, 0)
        this.tvPlane.isFullscreen = true
        this.experience.isFullscreen = true
        this.experience.fullScreenToggle()
    }

}