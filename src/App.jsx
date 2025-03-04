import React, { useEffect, useRef } from 'react'
import Experience from './Experience/Experience.js'
import LoadingBar from './components/LoadingBar.jsx'
import LivingRoomDialogue from './components/LivingRoomDialogue.jsx'
import UnderWaterContent from './components/UnderWaterContent.jsx'

function App() {
  const canvasRef = useRef(null)

  let experience = null

  useEffect(() => {
    experience = new Experience(canvasRef.current)
    

  }, [])

  const sidNed = () => {
    console.log('sid ned')
    experience.world.camera.goToPos = experience.world.cameraPositions.position2.position
    experience.world.camera.goToLookAt = experience.world.cameraPositions.position2.lookAt
    experience.world.moveWithMouse = true
    console.log("Jæ godav")
  }

  return (
    <div>
      <canvas className='fixed top-0 left-0' ref={canvasRef} />
      <UnderWaterContent />
      <LoadingBar />
      <LivingRoomDialogue sidNed={sidNed}/>
    </div>
  )
}

export default App
