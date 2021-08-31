import { SpeechKitSdk } from '@speechkit/speechkit-audio-player-v2';
import React, { useEffect, useRef, useState } from 'react';


function PlayerInstance(props){
    console.log('hello')
    const instance = props.playerInstance;
    console.log(instance)

    const handleEvent = (dataEvent) => {
        console.log(dataEvent.progress)
    }

    let isPlaying = false;
    const handlePlayPause = () => {
            if (!isPlaying){
                instance.play()
                instance.events.on('timeUpdate', handleEvent)
                isPlaying = !isPlaying
            } else if (isPlaying) {
                instance.pause()
                isPlaying = !isPlaying
                instance.events.off('timeUpdate', handleEvent)
            }

      };

    return (
        <h1 onClick={() => handlePlayPause()}>playerInstance</h1>
    );
}

export default PlayerInstance;