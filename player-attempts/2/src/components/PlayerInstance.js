import { SpeechKitSdk } from '@speechkit/speechkit-audio-player-v2';
import React, { useEffect, useRef, useState } from 'react';


function PlayerInstance(props){
    const {playerInstance, setCurrentTime, setIsPlaying, isPlaying} = props;
    const handleEvent = (dataEvent) => {
        console.log(dataEvent.progress)
      
    }

    useEffect(() => {
        if (playerInstance){
            return () => {
                playerInstance.events.off('timeUpdate', handleEvent)
            }
        }
    }, [isPlaying])

    const handlePlayPause = () => {
            if (!isPlaying){
                playerInstance.play()
                playerInstance.events.on('timeUpdate', handleEvent)
                setIsPlaying(true)
            } else if (isPlaying) {
                playerInstance.pause()
                setIsPlaying(false)
            }
      };

    return (
        <h1 onClick={() => handlePlayPause()}>playerInstance</h1>
    );
}

export default PlayerInstance;