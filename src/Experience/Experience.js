import * as THREE from 'three'
import * as YUKA from 'yuka'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';
import { FilmGrainShader } from './Utils/Shaders/filmGrainShader.js'
import { DoFShader } from './Utils/Shaders/dofShader.js'
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
        this.isFullscreen = false
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
        this.exposureInterpolated = 0.25
        this.exposureGoTo = 0.25

        this.setAudio()

        // Rendering
        this.isLivingRoomRendering = true
        this.isSunsetRendering = false
        this.isUnderWaterRendering = false

        // Render targets
        this.renderTargetSunset = new THREE.WebGLRenderTarget(this.sizes.width, this.sizes.height)
        this.renderTargetUnderWater = new THREE.WebGLRenderTarget(this.sizes.width, this.sizes.height)

        //Scene 1
        this.scene = new THREE.Scene()
        this.camera = new Camera(this.scene)
        this.camera.instance.add(this.audioListener)
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

            this.setVideo()

            // Audio
            this.audioPlayer.setBuffer(this.resources.items.rallySound)
            this.sfxPlayer.setBuffer(this.resources.items.splashSound)
            
            this.loaded = true
            window.setTimeout(() => {
                const onOffButton = document.querySelector('.on-off-button')
                const loadingBar = document.querySelector('.loading-bar-container')
                loadingBar.remove();
                onOffButton.style.opacity = 1
            }, 2000)

            this.input.on('key-i', () => {
                // Film grain
                this.filmGrainShader = new ShaderPass(FilmGrainShader);
                this.composer.addPass(this.filmGrainShader);
                this.setDebug()
            })
            this.input.on('key-u', () => {
                // remove film grain
                console.log(this.composer.passes)
                this.composer.passes.pop()
            })
            
        })
        // Scroll
        window.scrollTo(0, 0)
        this.input.on('scroll', () => {
            this.scrollProgress = - this.input.scrollProgress / this.sizes.height
            if(this.world.tvPlane) this.world.tvPlane.updateProgression(this.scrollProgress)
            //console.log(this.scrollProgress)
        })

        this.body.style.overflowX = 'hidden'
        this.body.style.overflowY = 'hidden'

        this.loadingOverlay = new LoadingOverlay()

    }

    setAudio() {
        this.audioListener = new THREE.AudioListener()
        this.audioPlayer = new THREE.Audio(this.audioListener)
        this.audioPlayer.setLoop(true)
        this.audioPlayer.setVolume(0.5)

        this.sfxListener = new THREE.AudioListener()
        this.sfxPlayer = new THREE.Audio(this.sfxListener)
        this.sfxPlayer.setVolume(0.5)
    }

    setVideo() {
        this.video = document.querySelector('#video')
        this.videoTexture = new THREE.VideoTexture(this.video)
        this.video.playbackRate = 1.
        this.video.muted = true
    }

    resetVideo() {
        // restart video
        this.video.currentTime = 0
        this.video.play()
    }

    resize() {
        //console.log('resize')
        this.camera.resize()
        this.camera2.resize()
        this.camera3.resize()
        this.renderer.resize()
    }

    update() {
        if(this.filmGrainShader) this.filmGrainShader.uniforms.iTime.value = this.time.elapsed / 1000
        if(this.loaded) this.loadingOverlay.update()

        this.debug.update()
        this.camera.update()
        if(this.world) this.world.update()
        if(this.world2) this.world2.update()
        if(this.world3) this.world3.update()
        
        this.entityManager.update(this.time.delta * 0.001)

        // Render Scene 2
        if(!this.isFullscreen && this.world){
            this.world.tvPlane.tvPlane.material.uniforms.tex.value = this.videoTexture
            this.renderSunset()

        } else if(this.scrollProgress >= -1.8 && this.isFullscreen) {
            if(this.audioPlayer.buffer != this.resources.items.waterSound) {
                this.audioPlayer.stop()
                this.audioPlayer.setBuffer(this.resources.items.waterSound)
                this.audioPlayer.play()
            }
            this.world.tvPlane.tvPlane.material.uniforms.tex.value = this.renderTargetSunset.texture
            this.renderSunset()
        } else {
            this.isSunsetRendering = false
        }
        if( -0.9 > this.scrollProgress) {
            if(this.audioPlayer.buffer != this.resources.items.underWaterSound) {
                this.audioPlayer.stop()
                this.audioPlayer.setBuffer(this.resources.items.underWaterSound)
                this.audioPlayer.play()
            }
            this.renderUnderWater()
        } else {
            this.isUnderWaterRendering = false
        }

        if(this.isSunsetRendering && this.isUnderWaterRendering && !this.sfxPlayer.isPlaying) {
            this.sfxPlayer.play()
        }

        this.renderLivingRoom()

    }

    fullScreenToggle() {
        this.audioPlayer.stop()
        if(this.isFullscreen && this.isSunsetRendering) {
            this.audioPlayer.setBuffer(this.resources.items.waterSound)

        } else if (this.isFullscreen && this.isUnderWaterRendering) {
            this.audioPlayer.setBuffer(this.resources.items.underwaterSound)

        } else {
            this.audioPlayer.setBuffer(this.resources.items.rallySound)

        }
        this.audioPlayer.play()

    }

    sync( entity, setRenderComponent ) {
        setRenderComponent.matrix.copy(entity.worldMatrix);
    }

    renderSunset() {
        this.isSunsetRendering = true
        this.renderer.instance.setRenderTarget(this.renderTargetSunset)
        this.renderer.instance.render(this.scene2, this.camera2.instance)
        this.renderer.instance.setRenderTarget(null)
    }

    renderUnderWater() {
        this.isUnderWaterRendering = true
        this.renderer.instance.setRenderTarget(this.renderTargetUnderWater)
        this.renderer.instance.render(this.scene3, this.camera3.instance)
        this.renderer.instance.setRenderTarget(null)
    }

    renderLivingRoom() {
        this.renderer.instance.toneMappingExposure = this.exposureGoTo
        this.renderer.update(this.renderedScene, this.renderedCamera)
        this.composer.render()
    }

    setDebug() {
        
    }
}