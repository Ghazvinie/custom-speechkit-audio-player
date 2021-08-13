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

  const [playerInstance, setPlayerInstance] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [trackDuration, setTrackDuration] = useState(0);
  const [trackCurrentTime, setTrackCurrentTime] = useState(0);
  const [timeDisplays, setTimeDisplays] = useState({ displayType: 'duration' });
  const [userLoggedIn, setUserLoggedIn] = useState(true);
  const [timer, setTimer] = useState(null);

 

  const filledRef = useRef(null);
  const progressRef = useRef(null);
  const dropdownRef = useRef(null);

  // Creates player instance and stores in state
  useEffect(() => {
    async function getPlayer() {
      const playerReady = await SpeechKitSdk.isAudioReady(initParams);
      if (playerReady) {
        const instance = await SpeechKitSdk.player(initParams);
        setPlayerInstance(instance);
        setTrackDuration(instance.duration());
      };
    };
    getPlayer();
    formatTimeDisplays();
  }, []);

  // Formats time displays when current time changes
  useEffect(() => {
    formatTimeDisplays();
    // console.log(trackCurrentTime)
  }, [trackCurrentTime]);

  // Updates progress bar 
  const handleProgress = (currentTime = trackCurrentTime, duration = trackDuration) => {
    const percent = (currentTime / duration) * 100;
    filledRef.current.style.flexBasis = `${percent}%`;
  };

  // Handles user clicks on progress bar
  const progressClick = (e) => {
    const { width, left } = progressRef.current.getBoundingClientRect();
    const x = e.nativeEvent.clientX - left;
    const percent = (x / width) * 100;
    const time = Number(((trackDuration / 100) * percent).toFixed(2));

    filledRef.current.style.flexBasis = `${percent}%`;
    setTrackCurrentTime(time);
    playerInstance.changeCurrentTime(time);
  };

  // Formats all the time displays and stores to state
  const formatTimeDisplays = () => {
    const minsDuration = Math.floor(trackDuration / 60);
    const secsDuration = Math.floor(trackDuration % 60);
    const durationFormat = `${minsDuration}:${secsDuration < 10 ? '0' : ''}${secsDuration}`;

    const subMins = Math.floor((trackDuration - trackCurrentTime) / 60);
    const subSecs = Math.floor((trackDuration - trackCurrentTime) % 60);
    const subFormat = `-${subMins}:${subSecs < 10 ? 0 : ''}${subSecs}`;

    const dual = `${subFormat}/${durationFormat}`;
    setTimeDisplays(prevDisplay => ({ ...prevDisplay, durationFormat, subFormat, dual }));
  };

  // Displays the user selected time display 
  const timeDisplay = () => {
    switch (timeDisplays.displayType) {
      case 'duration':
        return timeDisplays.durationFormat;
      case 'timeLeft':
        return timeDisplays.subFormat;
      case 'dual':
        return timeDisplays.dual;
      default:
        return '0:00';
    };
  };

  // Cycles through the different time displays
  const handleTimeClick = () => {
    switch (timeDisplays.displayType) {
      case 'duration':
        setTimeDisplays(prevDisplay => ({ ...prevDisplay, displayType: 'timeLeft' }));
        break;
      case 'timeLeft':
        setTimeDisplays(prevDisplay => ({ ...prevDisplay, displayType: 'dual' }));
        break;
      case 'dual':
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
      dropdownRef.current.className += ' dropdown-active';
      return;
    };


    
    if (!isPlaying && userLoggedIn) {
      // Starts play
      setTimer(setInterval(() => {
        const progress = playerInstance.currentTime();
        const duration = playerInstance.duration()
        setTrackCurrentTime(progress);
        handleProgress(progress, duration)
        formatTimeDisplays();
      }, 250))


      // const { progress, duration } = dataEvent;
      // console.log('called')
      // setTrackCurrentTime(progress);
      // handleProgress(progress, duration);
      // formatTimeDisplays();

  
      playerInstance.play();
     playerInstance.events.on('timeUpdate', dataEvent => {}
        // const { progress, duration } = dataEvent;
        // console.log('called')
        // setTrackCurrentTime(progress);
        // handleProgress(progress, duration);
        // formatTimeDisplays();
      );
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
    const skipValue = 5;

    if (name === 'rwd') {
      const skipTime = Number((trackCurrentTime - skipValue).toFixed(2));
      console.log(skipTime)
      // // playerInstance.rewind(skipValue)
      // console.log(playerInstance.currentTime())
      // console.log(trackCurrentTime)
      // handleProgress(5.00)

    };

    if (name === 'fwd') {
      const skipTime = Number((trackCurrentTime + skipValue).toFixed(2));
      console.log(skipTime)
      // playerInstance.forward(skipValue);
      // console.log(playerInstance.currentTime() + 5)
      // console.log(trackCurrentTime + 5)

    }

    // handleProgress();
    // playerInstance.changeCurrentTime(5.01)
    // console.log(trackCurrentTime)
    // console.log(playerInstance.currentTime())
  };



  return (
    <>
      <div className='player-container' style={!playerInstance ? { display: 'none' } : {}}>

        <h4 className='label'>Title Placeholder</h4>

        <div className='controls'>

          <button className='rwd-fwd' name='rwd'><IoIosArrowBack className='rwd-fwd-svg' onClick={(e) => handleSkip(e)} /></button>
          <button className='play-pause' onClick={() => handlePlayPause()}>{!isPlaying ? <IoPlayOutline /> : <RiPauseLine />}</button>
          <button className='rwd-fwd' name='fwd'><IoIosArrowForward className='rwd-fwd-svg' onClick={(e) => handleSkip(e)} /></button>

          <div className="progress" ref={progressRef} onClick={(e) => progressClick(e)}>
            <div className="progress-filled" ref={filledRef} ></div>
          </div>

          <div className='timer' onClick={() => handleTimeClick()}>
            {timeDisplay()}
          </div>
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
