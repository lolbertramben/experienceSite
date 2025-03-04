import React from "react";

export default function LivingRoomDialogue({...props}) {
    return (
        <div className='living-room hidden'>
            <div className='dialogue-box dialogue-box-0 text-amber-400'>
              <p>“ Danmark stiller op i en klassisk defensiv, men USA presser højt fra start <br/> og forsøger at få kontrol over banen.”</p>
            </div>
            <div className='dialogue-box dialogue-box-1 text-right text-amber-200'>
              <p>“ Ja! <br/>USA presser med stor styrke, men Danmark holder linjerne <br/>og satser på sikre afleveringer blandt de danske holdkammerater. <br/>Spørgsmålet er – hvor længe kan de holde stand?”</p>
            </div>
            <div className='dialogue-box dialogue-box-2 text-amber-400'>
              <p>“ Blandt tilskuerne har vi de lokale fra Grønland, <br/>som ser ivrigt på og forsøger at diktere spillets tempo. <br/>Det afgørende her er, hvem der får lov at styre kampbilledet!”</p>
            </div>
            {/* Knap */}
            <button onClick={props.sidNed} className='button'>
              Sid ned
            </button>
        </div>
    )
}