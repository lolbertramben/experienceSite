import * as THREE from 'three'
import * as YUKA from 'yuka'
import * as SkeletonUtils from 'three/examples/jsm/utils/SkeletonUtils.js'
import Experience from '../Experience.js'

export default class Fish {
    
    constructor(world) {
        this.experience = new Experience()
        this.world = world
        this.resources = this.experience.resources
        this.scene = this.experience.scene3
        this.entityManager = this.experience.entityManager
        this.mouseVehicle = this.experience

        // Setup
        this.resource = this.resources.items.fishModel

        this.experience.input.on('mouse-activity', () => {
            this.isMouseInactive = this.experience.input.isMouseInactive
        })

        this.setBehaviors()
        this.setModel()
    }

    setModel() {
        this.model = this.resource.scene
        this.model.receiveShadow = true
        this.model.castShadow = true
        // this.model.children[0].material.metalness = 1
        // this.model.children[0].material.roughness = 0.5
        //this.scene.add(this.model)

        for (let i = 0; i < 50; i++) {
            const fishClone = SkeletonUtils.clone(this.model)
            fishClone.matrixAutoUpdate = false
            
            const flip = Math.random() > 0.5 ? -1 : 1
            // Set random scale
            const scale = Math.random() * 0.5 + 0.5
            //console.log(fishClone)
            fishClone.children[0].scale.set(scale * flip, scale, scale)
            fishClone.updateMatrix()
    
            this.scene.add(fishClone)

            this.setVehicles(fishClone)
          }

    }

    setBehaviors() {
        this.arriveBehavior = new YUKA.ArriveBehavior(this.world.mouseIndicator.mouseVehicle.position, 0, 0)
        this.arriveBehavior.weight = 0.5;
        this.cohesionBehavior = new YUKA.CohesionBehavior()
        this.cohesionBehavior.weight = 0.9;
        this.separationBehavior = new YUKA.SeparationBehavior()
        this.separationBehavior.weight = 0.3;
    }

    setVehicles(model) {
        this.vehicle = new YUKA.Vehicle()
        this.vehicle.setRenderComponent(model, this.experience.sync)
        
        this.vehicle.steering.add(this.arriveBehavior)
        this.vehicle.maxSpeed = 5
        this.vehicle.minSpeed = 1
        this.vehicle.smoother = new YUKA.Smoother(50);

        this.vehicle.updateNeighborhood = true
        this.vehicle.neighborhoodRadius = 3

        this.vehicle.steering.add(this.cohesionBehavior)
        this.vehicle.steering.add(this.separationBehavior)
        
        this.entityManager.add(this.vehicle)

        this.vehicle.position.x = Math.random() * 10 - 5
        this.vehicle.position.y = Math.random() * 10 - 5
        this.vehicle.rotation.fromEuler( 2 * Math.PI * Math.random(), 0, 0)
    }
    

    update() {
    }

}