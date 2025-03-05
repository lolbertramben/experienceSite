import * as THREE from 'three'
import * as YUKA from 'yuka'
import Experience from '../Experience.js'

export default class MouseIndicator {

    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene3
        this.debug = this.experience.debug
        
        this.setMouseIndicator()

        this.experience.input.on('mouse-activity', () => {
            if(this.experience.input.isMouseInactive) this.mouseVehicle.position.set(0,0,0)
        })
    }

    setMouseIndicator() {
        this.mouseIndicatorGeometry = new THREE.SphereGeometry(0.1, 32, 32)
        this.mouseIndicatorMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 })
        this.mouseIndicator = new THREE.Mesh(this.mouseIndicatorGeometry, this.mouseIndicatorMaterial)
        this.mouseIndicator.matrixAutoUpdate = false
        this.mouseIndicator.visible = this.debug.active
        this.scene.add(this.mouseIndicator)
    
        this.wanderBehavior = new YUKA.WanderBehavior(5, 25, 25)
    
        this.mouseVehicle = new YUKA.Vehicle()
        this.mouseVehicle.setRenderComponent(this.mouseIndicator, this.experience.sync)
        this.experience.entityManager.add(this.mouseVehicle)
        this.mouseVehicle.maxSpeed = 2
        this.mouseVehicle.steering.add(this.wanderBehavior)
    }

    update() {
        if(!this.experience.input.isMouseInactive) {
            this.mouseVehicle.position.x = (this.experience.mouse.x / this.experience.sizes.width * 2 -1) * 8.5
            this.mouseVehicle.position.y = (- (this.experience.mouse.y / this.experience.sizes.height) * 2 + 1) * 5.5
            this.mouseVehicle.position.z = 0
        } else if (this.mouseVehicle.position.distanceTo(new THREE.Vector3(0,0,0)) > 10 && this.experience.input.isMouseInactive) {
            this.mouseVehicle.position.x = 0;
            this.mouseVehicle.position.z = 0;
        } else if (this.experience.input.isMouseInactive) {
            this.mouseVehicle.position.y = 2 * Math.sin(0.0005 * (this.experience.time.elapsed + 6000));
        }
    }
}