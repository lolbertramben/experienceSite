import React, { useEffect, useState } from "react";
import rallyVideoPath from '../assets/videos/rally.mp4'
import arrowPath from '../assets/svg/arrow.svg'

export default function LivingRoomDialogue({setDialogueProgress, dialogueProgress, ...props}) {

    useEffect(() => {
      window.addEventListener('keydown', (e) => {
        if(e.key === '2') {
          fortsæt(4)
        }
      })

      return () => {
        window.removeEventListener('keydown', (e) => {
          if(e.key === '2') {
            fortsæt(4)
          }
        })
      }
    }, [])

    const sidNed = () => {
      props.experience.world.setting2()
      fortsæt(3)
      window.setTimeout(() => {
        fortsæt(4)
      }, 5000)
    }

    const fortsæt = (progression) => {
      console.log('fortsæt')
      setDialogueProgress(progression)
      console.log(dialogueProgress)
    }

    const setFullScreen = () => {
      props.experience.world.setting3()
    }

    return (
      <div>
        <video id="video" muted loop autoPlay width="720" height="480" src={rallyVideoPath} style={{display: 'none'}}></video>
        <div className='living-room'>
            <div
              style={{opacity: dialogueProgress >= 0 && dialogueProgress < 3 ? 1 : 0}}
              className='dialogue-box dialogue-box-0'>
              <p>“ Danmark stiller op i en klassisk defensiv, men USA presser højt fra start <br/> og forsøger at få kontrol over banen.”</p>
              <button
                className="hover-button"
                style={{opacity: dialogueProgress == 0 ? 1 : 0}}
                onClick={() => fortsæt(1)}
                >fortsæt {'>>'}
              </button>
            </div>
            <div
              style={{opacity: dialogueProgress >= 1 && dialogueProgress < 3 ? 1 : 0}}
              className='dialogue-box dialogue-box-1 text-right'>
              <p>“ Ja! <br/>USA presser med stor styrke, men Danmark holder linjerne <br/>og satser på sikre afleveringer blandt de danske holdkammerater. <br/>Spørgsmålet er – hvor længe kan de holde stand?”</p>
              <button
                className="hover-button"
                style={{opacity: dialogueProgress == 1 ? 1 : 0}}
                onClick={() => fortsæt(2)}
                >fortsæt {'>>'}
              </button>
            </div>
            <div
              style={{opacity: dialogueProgress >= 2 && dialogueProgress < 3 ? 1 : 0}}
              className='dialogue-box dialogue-box-2'>
              <p>“ Blandt tilskuerne har vi de lokale fra Grønland, <br/>som ser ivrigt på og forsøger at diktere spillets tempo. <br/>Det afgørende her er, hvem der får lov at styre kampbilledet!”</p>
            </div>

            {/* Knapper */}
            <button 
              style={{opacity: dialogueProgress == 2 && dialogueProgress < 3 ? 1 : 0}}
              className="sid-ned-button p-4 hover-button"
              onClick={()=>{
                sidNed()
              }}>
              <p className="button hover-button">
                Se kampen
              </p>
              <img className="arrow relative" src={arrowPath} alt="Arrow" />
            </button>
        </div>
        <div className="living-room-2">
          <div
              style={{opacity: dialogueProgress >= 4 ? 1 : 0}}
              className='dialogue-box dialogue-box-3'>
              <p>Vi vender tilbage efter en kort reklamepause</p>
              <button
                className="hover-button"
                style={{opacity: dialogueProgress == 4 ? 1 : 0}}
                onClick={() => {
                  fortsæt(-1)
                  setFullScreen()
                }}
                >fortsæt {'>>'}
              </button>
            </div>
        </div>
      </div>
    )
}