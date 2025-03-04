import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import Experience from "./Experience"
import { lerp } from "./Utils/utils"

export default class Camera {

    constructor(scene) {
        
        // Options
        this.experience = new Experience()
        this.sizes = this.experience.sizes
        this.scene = scene
        this.canvas = this.experience.canvas
        this.debug = this.experience.debug
        this.mouse = this.experience.mouse

        this.interpolatedLookAt = new THREE.Vector3()
        this.goToLookAt = new THREE.Vector3()
        this.goToPos = new THREE.Vector3()

        // Setup
        this.setInstance()
        if(this.debug.active) this.setOrbitControls()

    }

    setInstance() {
        this.instance = new THREE.PerspectiveCamera(
            50, 
            this.sizes.width / this.sizes.height, 
            0.1, 
            100
        )
        this.instance.position.z = 5
        this.scene.add(this.instance)
    }

    setOrbitControls() {
        this.controls = new OrbitControls(this.instance, this.canvas)
        this.controls.enableDamping = true
    }

    resize() {
        this.instance.aspect = this.sizes.width / this.sizes.height
        this.instance.updateProjectionMatrix()
    }

    update() {
        if(!this.debug.active) this.instance.position.lerp(this.goToPos, 0.005)
        if(!this.debug.active) this.instance.lookAt(this.interpolatedLookAt.lerp(this.goToLookAt, 0.01))

        if(this.debug.active) this.controls.update()

    }

    updateCameraWithMouse() {
        const mouseX = (this.mouse.x / window.innerWidth) * 2 - 1
        const mouseY = -(this.mouse.y / window.innerHeight) * 2 + 1
    
        const movementStrength = 0.25 // Adjust this value to control the movement strength
    
        // Get camera's local directions
        const cameraDirection = new THREE.Vector3()
        this.instance.getWorldDirection(cameraDirection)
    
        const cameraRight = new THREE.Vector3()
        cameraRight.crossVectors(cameraDirection, this.instance.up).normalize()
    
        const cameraUp = new THREE.Vector3()
        cameraUp.crossVectors(cameraRight, cameraDirection).normalize()
    
        // Calculate target camera position in local space
        const targetPosition = new THREE.Vector3()
        targetPosition.copy(this.goToPos)
        targetPosition.add(cameraRight.multiplyScalar(mouseX * movementStrength))
        targetPosition.add(cameraUp.multiplyScalar(mouseY * movementStrength))
    
        // Interpolate current camera position towards target position
        this.instance.position.lerp(targetPosition, 0.01)
    
        // Keep the camera looking at the original target
        //this.camera.instance.lookAt(this.camera.goToLookAt)
    }
}