import * as THREE from 'three';
import Experience from '../Experience.js';

export default class Html {
    
    constructor() {
        this.experience = new Experience()
        this.sizes = this.experience.sizes
        this.camera = this.experience.camera2
        this.isHidden = false

        // Setup
        this.dialogueBoxes = [
            {
                position: new THREE.Vector3(-8, 5, 80),
                element: document.querySelector('.sub-text'),
                align: 'translate(0%, 0%)'
            },
            {
                position: new THREE.Vector3(-8, 5, 80),
                element: document.querySelector('.slogan'),
                align: 'translate(0%, 0%)'
            }

        ]
    }

    updateDialoguePosition() {
        this.dialogueBoxes.forEach((dialogueBox) => {
            const screenPosition = dialogueBox.position.clone()
            screenPosition.project(this.camera.instance)

            const x = (screenPosition.x * .5 + .5) * this.sizes.width
            const y = ( - screenPosition.y * .5 + .5) * this.sizes.height

            dialogueBox.element.style.transform = `translate(${x}px, ${y}px) ${dialogueBox.align}`
        })
    }


    update() {
        this.updateDialoguePosition()
        if(this.experience.scrollProgress < -0.02 || !this.experience.isFullscreen) {
            this.dialogueBoxes.forEach((dialogueBox) => {
                dialogueBox.element.style.opacity = 0
            })
        } else {
            this.dialogueBoxes.forEach((dialogueBox) => {
                dialogueBox.element.style.opacity = 1
            })
        }
    }
}