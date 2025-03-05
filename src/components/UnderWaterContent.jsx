import React from "react";
import merchSpritePath from '../assets/sprites/merch.webp'

export default function UnderWaterContent({...props}) {
    return (
        <div className="absolute">
            <div className="w-screen h-screen sunset-dialogue">
                <h1 className="slogan">– Når der går sport i den</h1>

                <p className="sub-text">Den perfekte makker til kampen</p>

            </div>
            <div className="w-screen h-screen bg-amber-500/0"></div>
            <div className="w-screen h-screen">

            </div>
            <div className="w-screen h-screen flex justify-center items-center">
                <div className="h-fit w-[1024px] flex flex-col gap-[50vh]">
                    <div className="w-full text-white max-w-[400px] self-end">
                        <h1 className="text-[2.5rem] font-display leading-[100%] pb-2" style={{color: 'var(--faxe-yellow)'}}>Den perfekte makker til kampen</h1>
                        <p className="w-full">Hold energien oppe og oplev Grønland på din egen måde med Faxe Kondis helt nye flaske – tappet lokalt i Grønland, fyldt med smeltevand fra indlandsisen. Fuld af mineraler og en smag, der er helt unik.</p>
                    </div>
                    <div className="w-full h-[70vh] grid grid-cols-2 gap-4">
                        <div className="max-w-[400px] self-end justify-self-start flex flex-col gap-4">
                            <h1 className="text-left text-[2.5rem] font-display leading-[100%] pb-2" style={{color: 'var(--faxe-yellow)'}}>Flash din kondi med stil</h1>
                            <p className="text-left w-full text-white">Er der noget bedre end en kold Kondi? Ja da! Fx en kold Kondi serveret i din nye Kondi-drikkedunk, mens du i din Kondi-badedragt tørrer sveden af panden med et Kondi-håndklæde! Gå på opdagelse i det nyeste Kondi-merch og tag dit Kondi-game til næste level...</p>
                            <a href="https://pos.royal4you.com/faxekondi/" target="_blank" className="font-display text-[1.5rem] px-4 py-1 rounded-full w-fit self-start" style={{color: 'var(--faxe-green)', background: 'var(--faxe-yellow)', pointerEvents: 'auto'}}>Køb merch her</a>
                        </div>
                        <img className="w-[500px]" src={merchSpritePath} alt="merch" />
                    </div>
                </div>
            </div>
            {/* Footer */}
            <div className="" style={{pointerEvents: 'none'}}>
                <div className="footer-trans z-[-1]"></div>
                <div className="footer flex justify-center items-center">
                    <div className="w-fit flex flex-col gap-6 items-center">
                        <h1 className="font-display text-[2.5rem]">Besøg vores hjemmeside her</h1>
                        <a href="https://www.faxekondi.dk/" target="_blank" className="font-display px-4 py-1 rounded-full" style={{color: 'var(--faxe-green)', background: 'var(--faxe-yellow)', pointerEvents: 'auto'}}>Her!</a>
                    </div>
                </div>
            </div>
        </div>
    )
}
        