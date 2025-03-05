// Models
import model from '../assets/models/fish.glb'
import livingRoom from '../assets/models/livingRoom.glb'
import foxModel from '../assets/models/Fox/glTF/Fox.gltf'
import icebergModel from '../assets/models/iceberg.glb'
import faxeKondiModel from '../assets/models/faxeKondi.glb'
import faxeKondiFloatModel from '../assets/models/faxeKondiFloat.glb'
import faxeModel from '../assets/models/faxe.glb'
import kondiModel from '../assets/models/kondi.glb'

// Audio
import rallySound from '../assets/sounds/fodbold.mp3'
import waterSound from '../assets/sounds/waves.mp3'
import underWaterSound from '../assets/sounds/underWater.mp3'
import splashSound from '../assets/sounds/splash.mp3'

// Textures
import px from '../assets/environmentMaps/0/px.jpg'
import nx from '../assets/environmentMaps/0/nx.jpg'
import py from '../assets/environmentMaps/0/py.jpg'
import ny from '../assets/environmentMaps/0/ny.jpg'
import pz from '../assets/environmentMaps/0/pz.jpg'
import nz from '../assets/environmentMaps/0/nz.jpg'
import waterNormals from '../assets/normalMaps/waterNormals.png'
import px3 from '../assets/environmentMaps/3/px.png'
import nx3 from '../assets/environmentMaps/3/nx.png'
import py3 from '../assets/environmentMaps/3/py.png'
import ny3 from '../assets/environmentMaps/3/ny.png'
import pz3 from '../assets/environmentMaps/3/pz.png'
import nz3 from '../assets/environmentMaps/3/nz.png'

export default [
    {
        name: 'environmentMapTexture',
        type: 'cubeTexture',
        path: [ px, nx, py, ny, pz, nz ]
    },
    {
        name: 'underWaterEnvMapTexture',
        type: 'cubeTexture',
        path: [ px3, nx3, py3, ny3, pz3, nz3 ]
    },
    {
        name: 'fishModel',
        type: 'gltf',
        path: model
    },
    {
        name: 'livingRoomModel',
        type: 'gltf',
        path: livingRoom
    },
    {
        name: 'foxModel',
        type: 'gltf',
        path: foxModel
    },
    {
        name: 'waterNormals',
        type: 'texture',
        path: waterNormals
    },
    {
        name: 'faxeKondiModel',
        type: 'gltf',
        path: faxeKondiModel
    },
    {
        name: 'faxeKondi2Model',
        type: 'gltf',
        path: faxeKondiModel
    },
    {
        name: 'icebergModel',
        type: 'gltf',
        path: icebergModel
    },
    {
        name: 'rallySound',
        type: 'audio',
        path: rallySound
    },
    {
        name: 'waterSound',
        type: 'audio',
        path: waterSound
    },
    {
        name: 'underWaterSound',
        type: 'audio',
        path: underWaterSound
    },
    {
        name: 'splashSound',
        type: 'audio',
        path: splashSound
    },
    {
        name: 'faxeModel',
        type: 'gltf',
        path: faxeModel
    },
    {
        name: 'kondiModel',
        type: 'gltf',
        path: kondiModel
    },
    {
        name: 'faxeKondiFloatModel',
        type: 'gltf',
        path: faxeKondiFloatModel
    },
]