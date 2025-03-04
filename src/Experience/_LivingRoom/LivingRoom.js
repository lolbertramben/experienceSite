import Experience from '../Experience'

export default class LivingRoom {

    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources

        // Setup
        this.resource = this.resources.items.livingRoomModel

        this.setModel()    
    }

    setModel() {
        this.model = this.resource.scene
        this.model.scale.set(1,1,1)
        this.scene.add(this.model)

        this.model.traverse(child => {
            if(child.isMesh) {
                child.castShadow = true
                child.receiveShadow = true
            }
        })
    }

}