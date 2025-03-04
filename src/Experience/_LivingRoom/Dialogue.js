import * as THREE from 'three';
import Experience from '../Experience.js';

export default class Dialogue {
    
    constructor() {
        this.experience = new Experience()
        this.sizes = this.experience.sizes
        this.camera = this.experience.camera

        // Setup
        this.DOMElements = document.querySelector('.living-room')

        this.dialogueBoxes = [
            {
                position: new THREE.Vector3(0, 2, 0),
                element: this.DOMElements.querySelector('.dialogue-box-0'),
                align: 'translate(0%, 0%)'
            },
            {
                position: new THREE.Vector3(2.45, 1.55, 0.8),
                element: this.DOMElements.querySelector('.dialogue-box-1'),
                align: 'translate(-100%, 0%)'
            },
            {
                position: new THREE.Vector3(0, 0.9, 0),
                element: this.DOMElements.querySelector('.dialogue-box-2'),
                align: 'translate(0%, 0%)'
            }
        ]
        this.buttons = [
            {
                position: new THREE.Vector3(-0.15, 0.5, 0.3),
                element: this.DOMElements.querySelector('.button'),
                align: 'translate(-50%, -50%)'
            }
        ]

    }

    updateDialogue1() {
        this.dialogueBoxes.forEach((dialogueBox) => {
            const screenPosition = dialogueBox.position.clone()
            screenPosition.project(this.camera.instance)

            const x = (screenPosition.x * .5 + .5) * this.sizes.width
            const y = ( - screenPosition.y * .5 + .5) * this.sizes.height

            dialogueBox.element.style.transform = `translate(${x}px, ${y}px) ${dialogueBox.align}`
        })

        this.buttons.forEach((button) => {
            const screenPosition = button.position.clone()
            screenPosition.project(this.camera.instance)

            const yOffset = Math.sin(this.experience.time.elapsed * 0.002) * 10
            const x = (screenPosition.x * .5 + .5) * this.sizes.width
            const y = ( - screenPosition.y * .5 + .5) * this.sizes.height + yOffset
            button.element.style.transform = `translate(${x}px, ${y}px) ${button.align}`
        })

    }


    update() {
        this.updateDialogue1()
        
    }

}