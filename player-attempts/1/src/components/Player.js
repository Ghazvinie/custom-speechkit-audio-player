import React, { useEffect, useRef, useState } from 'react';
import { SpeechKitSdk } from '@speechkit/speechkit-audio-player-v2';
import { IoCompassOutline, IoPlayOutline } from 'react-icons/io5';
import { IoIosArrowForward, IoIosArrowBack } from 'react-icons/io';
import { RiPauseLine } from 'react-icons/ri';
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
  const [timer, setTimer] = useState(null);


  const filledRef = useRef(null);
  const progressRef = useRef(null);
  const dropdownRef = useRef(null);
  const timerRef = useRef(null);

  const playSVG =
    <svg width="16" height="16" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
      <g fill="currentColor" fill-rule="nonzero">
        <path d="M16,0 C7.18,0 0,7.18 0,16 C0,24.82 7.18,32 16,32 C24.82,32 32,24.82 32,16 C32,7.18 24.82,0 16,0 Z M16,30 C8.28,30 2,23.72 2,16 C2,8.28 8.28,2 16,2 C23.72,2 30,8.28 30,16 C30,23.72 23.72,30 16,30 Z"></path><path d="M21.95,15.11 L12.95,10.61 C12.46,10.36 11.86,10.56 11.61,11.06 C11.54,11.2 11.5,11.35 11.5,11.51 L11.5,20.51 C11.5,21.06 11.95,21.51 12.5,21.51 C12.65,21.51 12.81,21.47 12.95,21.4 L21.95,16.9 C22.44,16.65 22.64,16.05 22.4,15.56 C22.3,15.36 22.14,15.2 21.95,15.11 Z M13.5,18.88 L13.5,13.12 L19.26,16 L13.5,18.88 Z"></path>
      </g>
    </svg>;

  const pauseSVG =
    <svg width="16" height="16" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
      <g fill="currentColor" fill-rule="nonzero">
        <path d="M16,0 C7.18,0 0,7.18 0,16 C0,24.82 7.18,32 16,32 C24.82,32 32,24.82 32,16 C32,7.18 24.82,0 16,0 Z M16,30 C8.28,30 2,23.72 2,16 C2,8.28 8.28,2 16,2 C23.72,2 30,8.28 30,16 C30,23.72 23.72,30 16,30 Z">
        </path>
        <path d="M14.5 10.5L11.5 10.5C10.95 10.5 10.5 10.95 10.5 11.5L10.5 20.5C10.5 21.05 10.95 21.5 11.5 21.5L14.5 21.5C15.05 21.5 15.5 21.05 15.5 20.5L15.5 11.5C15.5 10.95 15.05 10.5 14.5 10.5zM13.5 19.5L12.5 19.5 12.5 12.5 13.5 12.5 13.5 19.5zM20.5 10.5L17.5 10.5C16.95 10.5 16.5 10.95 16.5 11.5L16.5 20.5C16.5 21.05 16.95 21.5 17.5 21.5L20.5 21.5C21.05 21.5 21.5 21.05 21.5 20.5L21.5 11.5C21.5 10.95 21.05 10.5 20.5 10.5zM19.5 19.5L18.5 19.5 18.5 12.5 19.5 12.5 19.5 19.5z">
        </path>
      </g>
    </svg>;

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

  // Updates progress bar 
  const handleProgress = () => {
    const currentTime = playerInstance.currentTime();
    const percent = (currentTime / trackDuration) * 100;
    filledRef.current.style.width = `${percent}%`;
  };

  // Handles user clicks on progress bar
  const progressClick = (e) => {
    const { width, left } = progressRef.current.getBoundingClientRect();
    const x = e.nativeEvent.clientX - left;
    const percent = (x / width) * 100
    const time = Number(((trackDuration / 100) * percent).toFixed(2));
    filledRef.current.style.width = `${percent}%`;
    playerInstance.changeCurrentTime(time);
  };

  // Formats all the time displays and stores to state
  const formatTimeDisplays = () => {
    const currentTime = playerInstance === null ? 0 : playerInstance.currentTime()

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
      setTimer(setInterval(() => {
        handleProgress();
        formatTimeDisplays();
      }, 350));

    } else {
      // Pauses play   
      setIsPlaying(false);
      playerInstance.pause();
      clearInterval(timer)
    };
  };

  // Handles rwd and ffwd buttons
  const handleSkip = (e) => {

    const { name } = e.target.parentNode;
    const skipValue = 5.00;

    if (name === 'rwd') {
      playerInstance.rewind(skipValue)
    };

    if (name === 'fwd') {
      playerInstance.forward(skipValue);
    }
    handleProgress();
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
          <button className='play-pause' onClick={() => handlePlayPause()}>{!isPlaying ? playSVG : pauseSVG }</button>
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
        <button className='signup-btn' value='hello'>Subscribe</button>
        <p className='signin-or'>or</p>
        <button className='signup-btn' value='hello'>Sign In</button>

      </div>
    </>

  );
}

export default Player;


<svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><g fill="currentColor" fill-rule="nonzero"><path d="M16,0 C7.18,0 0,7.18 0,16 C0,24.82 7.18,32 16,32 C24.82,32 32,24.82 32,16 C32,7.18 24.82,0 16,0 Z M16,30 C8.28,30 2,23.72 2,16 C2,8.28 8.28,2 16,2 C23.72,2 30,8.28 30,16 C30,23.72 23.72,30 16,30 Z"></path><path d="M14.5 10.5L11.5 10.5C10.95 10.5 10.5 10.95 10.5 11.5L10.5 20.5C10.5 21.05 10.95 21.5 11.5 21.5L14.5 21.5C15.05 21.5 15.5 21.05 15.5 20.5L15.5 11.5C15.5 10.95 15.05 10.5 14.5 10.5zM13.5 19.5L12.5 19.5 12.5 12.5 13.5 12.5 13.5 19.5zM20.5 10.5L17.5 10.5C16.95 10.5 16.5 10.95 16.5 11.5L16.5 20.5C16.5 21.05 16.95 21.5 17.5 21.5L20.5 21.5C21.05 21.5 21.5 21.05 21.5 20.5L21.5 11.5C21.5 10.95 21.05 10.5 20.5 10.5zM19.5 19.5L18.5 19.5 18.5 12.5 19.5 12.5 19.5 19.5z"></path></g></svg>