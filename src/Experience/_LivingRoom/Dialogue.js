import * as THREE from 'three';
import Experience from '../Experience.js';
import { lerp } from '../Utils/utils.js';

export default class Dialogue {
    
    constructor() {
        this.experience = new Experience()
        this.sizes = this.experience.sizes
        this.camera = this.experience.camera
        this.isHidden = false

        // Setup
        this.dialogue1 = document.querySelector('.living-room')
        this.dialogue2 = document.querySelector('.living-room-2')

        this.dialogueBoxes = [
            {
                position: new THREE.Vector3(0, 2, 0),
                element: this.dialogue1.querySelector('.dialogue-box-0'),
                align: 'translate(0%, 0%)'
            },
            {
                position: new THREE.Vector3(2.45, 1.55, 0.8),
                element: this.dialogue1.querySelector('.dialogue-box-1'),
                align: 'translate(-100%, 0%)'
            },
            {
                position: new THREE.Vector3(0, 0.9, 0),
                element: this.dialogue1.querySelector('.dialogue-box-2'),
                align: 'translate(0%, 0%)'
            },
            {
                position: new THREE.Vector3(1.5, 0.8, -1.1),
                element: this.dialogue2.querySelector('.dialogue-box-3'),
                align: 'translate(0%, 0%)'
            }
        ]
        this.buttons = [
            {
                position: new THREE.Vector3(-0.15, 0.5, 0.3),
                element: this.dialogue1.querySelector('.sid-ned-button'),
                align: 'translate(-50%, -50%)'
            }
        ]

    }

    updateDialogue() {
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
        this.updateDialogue()
        if (this.isHidden) {
            this.hideDialogue()
            this.hideButton()
        } else {
            this.dialogueBoxes.forEach((dialogueBox) => {
                this.showDialogue(dialogueBox.element)
            })
            this.buttons.forEach((button) => {
                this.showButton(button.element)
            })
        }
    }

    hideDialogue() {
        this.dialogueBoxes.forEach((dialogueBox) => {
            dialogueBox.element.classList.add('hidden')
        })
    }
    showDialogue(element) {
        element.classList.remove('hidden')
    }
    hideButton() {
        this.buttons.forEach((button) => {
            button.element.classList.add('hidden')
        })
    }
    showButton(element) {
        element.classList.remove('hidden')
    }

}