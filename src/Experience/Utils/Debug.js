import GUI from 'lil-gui';
import Stats from 'three/addons/libs/stats.module.js';

export default class Debug {
    
    constructor() {

        this.active = window.location.hash === '#debug'

        if(this.active) {
            this.ui = new GUI()
        }
        this.stats = new Stats();
        document.body.appendChild(this.stats.dom);
    }

    update() {
            this.stats.update();
    }

}