import model from '../assets/models/fish.glb'
import livingRoom from '../assets/models/livingRoom.glb'
import foxModel from '../assets/models/Fox/glTF/Fox.gltf'
import andModel from '../assets/models/and.glb'
import icebergModel from '../assets/models/iceberg.glb'
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
        name: 'andModel',
        type: 'gltf',
        path: andModel
    },
    {
        name: 'icebergModel',
        type: 'gltf',
        path: icebergModel
    },
]