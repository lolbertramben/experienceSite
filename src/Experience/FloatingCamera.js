import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { map } from "./Utils/utils"
import Camera from "./Camera"

export default class FloatingCamera extends Camera {

    constructor(scene) {
        super(scene)
        this.cameraPositionInfo = {}

        // Setup
        this.setOrbitControls()
    }

    setInstance() {
        this.instance = new THREE.PerspectiveCamera(
            65, 
            this.sizes.width / this.sizes.height, 
            1, 
            10000
        )
        this.instance.position.z = 100
        this.scene.add(this.instance)
    }

    setOrbitControls() {
        this.controls = new OrbitControls(this.instance, this.canvas)
        this.controls.enabled = false
    }

    update() {
        this.t = this.experience.world2.water.water.material.uniforms.time.value
        this.waterSurfaceInfo = this.experience.world2.water.getWaterSurfaceInfo(this.instance.position.x, this.instance.position.z, this.t);
        this.quat = new THREE.Quaternion().setFromEuler(
          new THREE.Euler(this.waterSurfaceInfo.normal.x, this.waterSurfaceInfo.normal.y, this.waterSurfaceInfo.normal.z)
        );
        this.pos = new THREE.Vector3(
          this.instance.position.x,
          this.waterSurfaceInfo.position.y + 4,
          this.instance.position.z
        );
        this.instance.position.lerp(this.pos, 0.1);
        this.instance.quaternion.rotateTowards(this.quat, this.experience.time.delta * .2);
        this.instance.rotation.y = 0;
        this.scrollUpdate()

        this.controls.update()        
    }

    scrollUpdate() {
        this.instance.position.y -= map(this.experience.scrollProgress, 0, -1, 0, 0.3);
    }
}