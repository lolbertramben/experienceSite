import Experience from '../Experience.js'
import WaterEnvironment from './Water.js'
import SkyEnvironment from './Sky.js'
import Iceberg from './Iceberg.js'
import Bottle from './Bottle.js'

export default class World2 {

    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene2
        this.camera = this.experience.camera2
        this.resources = this.experience.resources

        // Options


        // Setup
        this.water = new WaterEnvironment();
        this.sky = new SkyEnvironment();
        this.iceberg = new Iceberg();
        this.bottle = new Bottle();

        this.experience.renderer.instance.toneMappingExposure = 0.6;

    }

    update() {
        this.sky.updateSun()
        this.water.update()
        this.camera.update()
        this.iceberg.update()
        this.bottle.update()
    }

    sceneSettings() {
        this.experience.renderer.instance.toneMappingExposure = 0.6;
    }


}