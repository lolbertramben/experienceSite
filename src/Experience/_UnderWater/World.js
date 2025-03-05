import * as THREE from 'three'
import Experience from '../Experience.js'
import Fish from './Fish.js'
import MouseIndicator from './MouseIndicator.js'
import Environment from './Environment.js'
import Html from './Html.js'
import bottle from './bottle.js'

export default class World3 {

    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene3
        this.camera = this.experience.camera3
        this.resources = this.experience.resources

        // Options

        // Setup
        // Camera go to start position
        this.camera.instance.position.set(0, 0, 15)
        this.camera.instance.lookAt(0, 0, 0)

        this.mouseIndicator = new MouseIndicator()
        this.fish = new Fish(this)
        this.environment = new Environment()
        this.html = new Html()
        this.bottle = new bottle()
    }

    update() {
        this.mouseIndicator.update()
        this.html.update()
        this.bottle.update()
    }


}