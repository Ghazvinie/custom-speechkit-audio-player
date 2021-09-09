import React, { useEffect, useRef, useState } from 'react';
import { SpeechKitSdk } from '@speechkit/speechkit-audio-player-v2';

function Player() {
    const [playerInstance, setPlayerInstance] = useState(null);
    const [playerReady, setPlayerReady] = useState(false);
    const [trackDuration, setTrackDuration] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [timeDisplays, setTimeDisplays] = useState({ displayType: 'duration' });
    const [userLoggedIn, setUserLoggedIn] = useState(true);

    const progressRef = useRef(null);
    const filledRef = useRef(null);
    const timerRef = useRef(null);
    const dropdownRef = useRef(null);

    return (
        <>
            <div className='player-container'>

                <h4 className='label'>Title Placeholder</h4>

                <div className='controls'>

                    <button className='rwd-fwd' name='rwd'></button>

                    <button className='play-pause'></button>

                    <button className='rwd-fwd' name='fwd'></button>

                    <div className='progress' ref={progressRef} >
                        <div className='progress-filled' ref={filledRef} ></div>
                    </div>

                    <div className='timer' ref={timerRef} ></div>

                </div>

            </div>
        </>
    );
}

export default Player;

const handleSkip = (e) => {
    const { name } = e.target.parentNode;
    const parentName = e.target.parentNode.parentNode.name;
    const skipValue = 5.00;

    if (name === 'rwd' || parentName === 'rwd') {
        playerInstance.rewind(skipValue);
    };
    if (name === 'fwd' || parentName === 'fwd') {
        playerInstance.forward(skipValue);
    };
    formatTimeDisplays();
};

const handleLogin = () => {
    setUserLoggedIn(prevState => !prevState)
};