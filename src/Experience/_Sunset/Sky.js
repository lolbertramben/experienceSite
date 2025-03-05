import * as THREE  from 'three'
import { Sky } from 'three/examples/jsm/objects/Sky';
import Experience from '../Experience.js'
import { map } from '../Utils/utils.js'

export default class SkyEnvironment {

    constructor() {

        this.experience = new Experience()
        this.sizes = this.experience.sizes
        this.scene = this.experience.scene2
        this.camera = this.experience.camera2.instance
        this.renderer = this.experience.renderer.instance
        this.resources = this.experience.resources

        // Options
        this.pmremGenerator = new THREE.PMREMGenerator(this.renderer);
        this.skyRenderTarget = new THREE.WebGLRenderTarget(this.sizes.width, this.sizes.height);
        this.sun = new THREE.Vector3();

        // Setup
        this.setSky()
        this.updateSun()

    }

    setSky() {
        this.sky = new Sky();
        this.sky.scale.setScalar(10000);
        this.scene.add(this.sky);

        this.skyUniforms = this.sky.material.uniforms;

        this.skyUniforms['turbidity'].value = 20;
        this.skyUniforms['rayleigh'].value = 4; //0.116 - 4
        this.skyUniforms['mieCoefficient'].value = 0.01; //Night sky 0.5
        this.skyUniforms['mieDirectionalG'].value = 0.9999; //Night sky 0.999999

        this.parameters = {
            elevation: 30,
            azimuth: -160,
        };
    }

    renderSkyToTexture() {
        this.renderer.toneMappingExposure = 0.75;
        this.renderer.setRenderTarget(this.skyRenderTarget);
        this.renderer.render(this.sky, this.camera);
        this.renderer.setRenderTarget(null);
    }

    updateSun() {
        this.parameters.elevation = map(this.experience.scrollProgress, 0, -1, 30, -5);
        this.currentValue = (30 - Math.min(30, this.parameters.elevation)) / 30;
        this.currentRayleigh = (6 - 1.5) * this.currentValue + 1.5;
        this.skyUniforms['rayleigh'].value = this.currentRayleigh;

        this.phi = THREE.MathUtils.degToRad(90 - this.parameters.elevation);
        this.theta = THREE.MathUtils.degToRad(this.parameters.azimuth);

        this.sun.setFromSphericalCoords(1, this.phi, this.theta);

        this.sky.material.uniforms['sunPosition'].value.copy(this.sun);
        //water.material.uniforms['sunDirection'].value.copy(sun).normalize();

        this.scene.environment = this.pmremGenerator.fromScene(this.sky).texture;

        this.renderSkyToTexture(); // Render skyen til tekstur
        //water.material.uniforms.skyTexture = { value: skyRenderTarget.texture };
    }
}