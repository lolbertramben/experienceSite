import * as THREE from 'three'
import * as YUKA from 'yuka'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import LoadingOverlay from './Utils/LoadingOverlay.js'
import Sizes from './Utils/Sizes'
import Time from './Utils/Time'
import Input from './Utils/Input'
import Camera from './Camera'
import FloatingCamera from './FloatingCamera'
import Renderer from './Renderer'
import World from './_LivingRoom/World'
import World2 from './_Sunset/World'
import World3 from './_UnderWater/World'
import Resources from './Utils/Resources'
import sources from './sources'
import Debug from './Utils/Debug'

let instance = null

export default class Experience {

    constructor(canvas) {
        // Singleton
        if(instance) {
            return instance
        }
        instance = this

        // Global acces
        window.experience = this

        // Options
        this.canvas = canvas

        // Setup
        this.loaded = false
        this.debug = new Debug()
        this.sizes = new Sizes()
        this.time = new Time()
        this.input = new Input()
        this.mouse = new THREE.Vector2(this.sizes.width * 0.5, this.sizes.height * 0.5)
        this.resources = new Resources(sources)
        this.entityManager = new YUKA.EntityManager()
        this.rayCaster = new THREE.Raycaster()
        this.body = document.querySelector('body')
        this.scrollProgress = this.input.scrollProgress;

        // Render targets
        this.renderTargetSunset = new THREE.WebGLRenderTarget(this.sizes.width, this.sizes.height)
        this.renderTargetUnderWater = new THREE.WebGLRenderTarget(this.sizes.width, this.sizes.height)

        //Scene 1
        this.scene = new THREE.Scene()
        this.camera = new Camera(this.scene)
        //Scene 2
        this.scene2 = new THREE.Scene()
        this.camera2 = new FloatingCamera(this.scene2)
        //Scene 3
        this.scene3 = new THREE.Scene()
        this.camera3 = new Camera(this.scene3)

        this.renderer = new Renderer()
        this.renderedScene = this.scene
        this.renderedCamera = this.camera.instance

        this.composer = new EffectComposer(this.renderer.instance)

        // Mouse
        this.input.on('mouse-move', () => {
            this.mouse.x = this.input.mouse.x
            this.mouse.y = this.input.mouse.y
        })

        // Resize
        this.sizes.on('resize', () => { this.resize() })
        // Time
        this.time.on('tick', () => { this.update() })
        // Loading
        this.resources.on('loaded', () => { 
            this.world = new World()
            this.world2 = new World2()
            this.world3 = new World3()
            this.renderer.instance.toneMappingExposure = 1.75
            this.loaded = true
        })
        // Scroll
        window.scrollTo(0, 0)
        this.input.on('scroll', () => {
            this.scrollProgress = - this.input.scrollProgress / this.sizes.height
            this.world.tvPlane.updateProgression(this.scrollProgress)
            //console.log(this.scrollProgress)
        })

        this.body.style.overflowX = 'hidden'
        this.body.style.overflowY = 'hidden'

        this.loadingOverlay = new LoadingOverlay()

    }

    resize() {
        //console.log('resize')
        this.camera.resize()
        this.camera2.resize()
        this.camera3.resize()
        this.renderer.resize()
    }

    update() {
        if (this.loaded) this.loadingOverlay.update()

        this.debug.update()
        this.camera.update()
        if(this.world) this.world.update()
        if(this.world2) this.world2.update()
        if(this.world3) this.world3.update()
        
        this.entityManager.update(this.time.delta * 0.001)

        // Render Scene 2
        this.renderer.instance.setRenderTarget(this.renderTargetSunset)
        this.renderer.instance.render(this.scene2, this.camera2.instance)
        this.renderer.instance.setRenderTarget(null)
        // Render Scene 3
        this.renderer.instance.setRenderTarget(this.renderTargetUnderWater)
        this.renderer.instance.render(this.scene3, this.camera3.instance)
        this.renderer.instance.setRenderTarget(null)
        // Render Scene 1
        this.renderer.update(this.renderedScene, this.renderedCamera)
        this.composer.render()

    }

    sync( entity, setRenderComponent ) {
        setRenderComponent.matrix.copy(entity.worldMatrix);
    }
}