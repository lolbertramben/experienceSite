import * as THREE from 'three';
import Experience from '../Experience';
import { lerp } from './utils';

export default class LoadingOverlay {
    constructor() {
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.resources = this.experience.resources;
        
        // Setup
        this.loadingBar = [
            document.querySelector('.magenta-loading-bar'),
            document.querySelector('.yellow-loading-bar'),
            document.querySelector('.green-loading-bar'),
            document.querySelector('.blue-loading-bar')
        ]
        this.loadingLable = document.querySelector('.loading-lable');
        this.setPlane();

        // Listeners
        this.resources.on('progress', () => {
            this.loadingBar.forEach((bar, index) => {
                bar.style.transform = `scaleX(${this.resources.loaded / this.resources.toLoad}) translateY(${100 * index}%) `;
            });
        });
        this.resources.on('loaded', () => {
            window.setTimeout(() => {
                this.loadingBar.forEach((bar, index) => {
                    bar.classList.add('loading-ended');
                    bar.style.transform = ``;
                });
                this.loadingLable.style.transform = 'scale(0)';
            }, 800);
        });
    }

    setPlane() {
        this.overlayGeometry = new THREE.PlaneGeometry(2, 2, 1, 1);
        this.overlayMaterial = new THREE.ShaderMaterial({
            transparent: true,
            uniforms: {
                uAlpha: { value: 1.0 }
            },
            vertexShader: `
                void main() {
                    gl_Position = vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform float uAlpha;

                void main() {
                    gl_FragColor = vec4(0.08, 0.28, 0.20, uAlpha);
                }
            `
        });
        this.overlay = new THREE.Mesh(this.overlayGeometry, this.overlayMaterial);
        this.scene.add(this.overlay);
    }

    update() {
        this.overlayMaterial.uniforms.uAlpha.value = lerp(this.overlayMaterial.uniforms.uAlpha.value, 0, 0.1);
        if(this.overlayMaterial.uniforms.uAlpha.value < 0.05) {
            this.overlayMaterial.uniforms.uAlpha.value = 0;
            this.scene.remove(this.overlay);
        }
    }
}