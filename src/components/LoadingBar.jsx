import React from "react";

export default function LoadingBar({...props}) {
    return (
        <div className='loading-bar-container'>
            <h1 className='loading-lable'>Loading...</h1>
            <div className='loading-bars'>
                <div className='loading-bar blue-loading-bar'></div>
                <div className='loading-bar green-loading-bar'></div>
                <div className='loading-bar yellow-loading-bar'></div>
                <div className='loading-bar magenta-loading-bar'></div>
            </div>
        </div>
    )
}