import React, { useEffect, useRef, useState } from 'react';
import { SpeechKitSdk } from '@speechkit/speechkit-audio-player-v2';
import { IoIosArrowForward, IoIosArrowBack } from 'react-icons/io';
import PlayPause from './PlayPause';
import PlayerInstance from './PlayerInstance';

import keys from '../keys';
import '../Player.css';
import '../Dropdown.css';


const initParams = {
  projectId: keys.project_id,
  externalId: keys.external_id
};

function Player() {

  const [playerReady, setPlayerReady] = useState(false);
  const [playerInstance, setPlayerInstance] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [trackDuration, setTrackDuration] = useState(0);
  const [timeDisplays, setTimeDisplays] = useState({ displayType: 'duration' });
  const [userLoggedIn, setUserLoggedIn] = useState(true);

  const filledRef = useRef(null);
  const progressRef = useRef(null);
  const dropdownRef = useRef(null);
  const timerRef = useRef(null);

  // Creates player instance and stores in state
  useEffect(() => {
    async function getPlayer() {
      const isReady = await SpeechKitSdk.isAudioReady(initParams);
      setPlayerReady(isReady);
      if (isReady) {
        const instance = await SpeechKitSdk.player(initParams);
        setPlayerInstance(instance);
        setTrackDuration(instance.duration());
        formatTimeDisplays();
      };
    };
    getPlayer();
  }, []);

  // Following two useEffect() format time displays when the player fully loads
  useEffect(() => {
    formatTimeDisplays();
  }, [trackDuration]);

  useEffect(() => {
    timeDisplay();
  }, [timeDisplays]);

  const handleEvent = (dataEvent) => {
    console.log(`progress - ${dataEvent.progress}`)
    handleProgress();
    formatTimeDisplays();
    return;
  }
  useEffect(() => {
    if (playerInstance) {
      return () => {
        playerInstance.events.off('timeUpdate', handleEvent)
      };
    };
  }, [isPlaying]);

  // Updates progress bar 
  const handleProgress = (a,b) => {
    if (a){
      console.log(a,b)

      filledRef.current.style.width = `${a}%`;

      playerInstance.changeCurrentTime(b);
      return
    }
    console.log(`progress time - ${playerInstance.currentTime()}`)

    const currentTime = playerInstance.currentTime();
    const percent = (currentTime / trackDuration) * 100;
    console.log(`progress time - ${currentTime}`)
    console.log(`progress % - ${percent}`)
    filledRef.current.style.width = `${percent}%`;


  };

  // Handles user clicks on progress bar
  const progressClick = (e) => {
    console.log(`click time - ${playerInstance.currentTime()}`)
    const { width, left } = progressRef.current.getBoundingClientRect();
    const x = e.nativeEvent.clientX - left;
    const percent = (x / width) * 100
    const time = Number(((trackDuration / 100) * percent).toFixed(2));
    console.log(`click time - ${playerInstance.currentTime()}`)
    console.log(`click calc time - ${time}`)
    console.log(`click percent - ${percent}`)

    filledRef.current.style.width = `${percent}%`;
    playerInstance.changeCurrentTime(time);
    handleProgress(percent, time)
    console.log(`click time aftr - ${playerInstance.currentTime()}`)

  };
  // Formats all the time displays and stores to state
  const formatTimeDisplays = () => {
    const currentTime = playerInstance === null ? 0 : playerInstance.currentTime();

    const minsDuration = Math.floor(trackDuration / 60);
    const secsDuration = Math.floor(trackDuration % 60);
    const durationFormat = `${minsDuration}:${secsDuration < 10 ? '0' : ''}${secsDuration}`;

    const mins = Math.floor(currentTime / 60);
    const secs = Math.floor(currentTime % 60);
    const upFormat = `${mins}:${secs < 10 ? 0 : ''}${secs}`;

    const subMins = Math.floor((trackDuration - currentTime) / 60);
    const subSecs = Math.floor((trackDuration - currentTime) % 60);
    const subFormat = `-${subMins}:${subSecs < 10 ? 0 : ''}${subSecs}`;

    const dualUp = `${upFormat}/${durationFormat}`
    const dualSub = `${subFormat}/${durationFormat}`;
    setTimeDisplays(prevDisplay => ({ ...prevDisplay, durationFormat, upFormat, dualUp, subFormat, dualSub }));
  };

  // Displays the user selected time display 
  const timeDisplay = () => {
    if (trackDuration <= 0) return; // Does not display time if there is no track duration i.e. the audio hasn't loaded
    switch (timeDisplays.displayType) {
      case 'duration':
        return timerRef.current.innerText = timeDisplays.durationFormat;
      case 'upFormat':
        return timerRef.current.innerText = timeDisplays.upFormat;
      case 'dualUp':
        return timerRef.current.innerText = timeDisplays.dualUp;
      case 'subFormat':
        return timerRef.current.innerText = timeDisplays.subFormat;
      case 'dualSub':
        return timerRef.current.innerText = timeDisplays.dualSub;
      default:
        return timeDisplays.durationFormat;
    };
  };

  // Cycles through the different time displays
  const handleTimeClick = () => {
    switch (timeDisplays.displayType) {
      case 'duration':
        setTimeDisplays(prevDisplay => ({ ...prevDisplay, displayType: 'upFormat' }));
        break;
      case 'upFormat':
        setTimeDisplays(prevDisplay => ({ ...prevDisplay, displayType: 'dualUp' }));
        break;
      case 'dualUp':
        setTimeDisplays(prevDisplay => ({ ...prevDisplay, displayType: 'subFormat' }));
        break;
      case 'subFormat':
        setTimeDisplays(prevDisplay => ({ ...prevDisplay, displayType: 'dualSub' }));
        break;
      case 'dualSub':
        setTimeDisplays(prevDisplay => ({ ...prevDisplay, displayType: 'duration' }));
        break;
      default:
        setTimeDisplays(prevDisplay => ({ ...prevDisplay, displayType: 'duration' }));
    };
  };

  // Handles play and pause button
  const handlePlayPause = () => {
    // Displays dropdown if user is not logged in
    if (!userLoggedIn) {
      dropdownRef.current.className = 'dropdown-container dropdown-active';
      return;
    } else {
      dropdownRef.current.className = 'dropdown-container';
    };


    if (!isPlaying && userLoggedIn) {
      // Starts play 
      playerInstance.play();
      setIsPlaying(true);
      playerInstance.events.on('timeUpdate', handleEvent);
    } else {
      // Pauses play   
      setIsPlaying(false);
      playerInstance.pause();
    };
  };

  // Handles rwd and ffwd buttons
  const handleSkip = (e) => {
    const { name } = e.target.parentNode;
    const skipValue = 5.00;
    if (name === 'rwd') {
      playerInstance.rewind(skipValue);
    };
    if (name === 'fwd') {
      playerInstance.forward(skipValue);
    };
    formatTimeDisplays();
  };

  function handleLogin() {
    setUserLoggedIn(prevState => !prevState)
  };

  return (
    <>
      <button className='login-btn' onClick={(e) => handleLogin(e)}>{userLoggedIn ? 'Logged In' : 'Logged Out'}</button>

      <div className='player-container' style={!playerReady ? { display: 'none' } : {}}>

        <h4 className='label'>Title Placeholder</h4>

        <div className='controls'>

          <button className='rwd-fwd' name='rwd'><IoIosArrowBack className='rwd-fwd-svg' onClick={(e) => handleSkip(e)} /></button>

          <button className='play-pause' onClick={() => handlePlayPause()}><PlayPause isPlaying={isPlaying} /></button>

          <button className='rwd-fwd' name='fwd'><IoIosArrowForward className='rwd-fwd-svg' onClick={(e) => handleSkip(e)} /></button>

          <div className="progress" ref={progressRef} onClick={(e) => progressClick(e)}>
            <div className="progress-filled" ref={filledRef} ></div>
          </div>

          <div className='timer' ref={timerRef} onClick={() => handleTimeClick()}></div>

        </div>

      </div>

      <div className='dropdown-container' ref={dropdownRef}>

        <h2>Like what you hear?</h2>
        <h3>Subscribe to hear this article and more</h3>
        <button className='signup-btn'>Subscribe</button>
        <p className='signin-or'>or</p>
        <button className='signup-btn'>Sign In</button>

      </div>
    </>

  );
}

export default Player;