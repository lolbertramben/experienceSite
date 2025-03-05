import EventEmitter from "./EventEmitter"

export default class Sizes extends EventEmitter {

    constructor() {
        super()
        
        // Setup
        this.mouse = { x: 0, y: 0 }
        this.isMouseInactive = true
        this.inactivityTimeout = null
        this.scrollProgress = 0

        // Resize Event
        window.addEventListener('keypress', (e) => {
            if (e.key === '1') {
                this.trigger('key-1')
            } else if (e.key === '2') {
                this.trigger('key-2')
            } else if (e.key === '3') {
                this.trigger('key-3')
            } else if (e.key === 't') {
                this.trigger('key-t')
            } else if (e.key === 'u') {
                this.trigger('key-u')
            } else if (e.key === 'i') {
                this.trigger('key-i')
            }
        })

        // Mouse Event
        window.addEventListener('mousemove', (event) => {
            this.mouse.x = event.clientX
            this.mouse.y = event.clientY
            this.trigger('mouse-move')
            this.resetInactivityTimer()
        })

        // Scroll Y Event
        window.addEventListener('scroll', () => {
            this.scrollProgress = window.scrollY
            this.trigger('scroll')
        })

        // Start inactivity timer
        this.startInactivityTimer()
    }

    startInactivityTimer() {
        this.inactivityTimeout = setTimeout(() => {
            this.isMouseInactive = true
            this.trigger('mouse-activity')
        }, 1000)
    }

    resetInactivityTimer() {
        clearTimeout(this.inactivityTimeout)
        this.isMouseInactive = false
        this.trigger('mouse-activity')
        this.startInactivityTimer()
    }
    
}