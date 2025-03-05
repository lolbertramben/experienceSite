import React, { useEffect, useRef, useState } from 'react'
import Experience from './Experience/Experience.js'
import LoadingBar from './components/LoadingBar.jsx'
import LivingRoomDialogue from './components/LivingRoomDialogue.jsx'
import UnderWaterContent from './components/UnderWaterContent.jsx'

function App() {
  const canvasRef = useRef(null)
  const [experienceState, setExperienceState] = useState(null)
  const [dialogueProgress, setDialogueProgress] = useState(-1)

  let onOffButton = document.querySelector('.on-off-button')

  useEffect(() => {
    experience = new Experience(canvasRef.current)
    setExperienceState(experience)

  }, [])

  const onOffHandle = () => {
    if(!experienceState || !experienceState.loaded) return
      experience.world.toggleContext()
      experience.exposureGoTo = 1.75
      onOffButton.style.opacity = 0
      experienceState.audioPlayer.play();

      window.setTimeout(() => {
        setDialogueProgress(0)
      }, 2000)

      window.setTimeout(() => {
        onOffButton.remove()
      }, 1000)
  }

  return (
    <div>
      <canvas className='fixed top-0 left-0' ref={canvasRef} />
      <UnderWaterContent />
      <LoadingBar />
      {experienceState && <LivingRoomDialogue 
        dialogueProgress={dialogueProgress} 
        setDialogueProgress={setDialogueProgress} 
        experience={experienceState}/>}
      <button onClick={onOffHandle} className='on-off-button hover-button'>Tænd TV</button>
    </div>
  )
}

export default App
