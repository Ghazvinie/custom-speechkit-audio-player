import React, { useEffect, useRef, useState } from 'react';
import { IoPlayOutline, IoPlayBackOutline, IoPlayForwardOutline } from 'react-icons/io5';
import { IoIosArrowForward, IoIosArrowBack } from 'react-icons/io'
import keys from '../keys';
import '../Player.css'
import { SpeechKitSdk } from '@speechkit/speechkit-audio-player-v2';

const initParams = {
  projectId: keys.project_id,
  externalId: keys.external_id,
  // UIenabled: true,
  // renderNode: 'speechkit-player',
  // isIframe: true
};

function Player() {

  const [playerInstance, setPlayerInstance] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [trackDuration, setTrackDuration] = useState(0);
  const [trackCurrentTime, setCurrentTime] = useState(0);
  const [timeDisplays, setTimeDisplays] = useState({ displayType: 'duration' });

  const filledRef = useRef(null);
  const progressRef = useRef(null);

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

  useEffect(() => {
    formatTimeDisplays();
  }, [trackCurrentTime]);

  const handleProgress = (currentTime = trackCurrentTime, duration = trackDuration) => {
    console.log('valled')
    const percent = (currentTime / duration) * 100;
    console.log(percent)
    filledRef.current.style.flexBasis = `${percent}%`;
  };

  const progressClick = (e) => {
    const { width, left } = progressRef.current.getBoundingClientRect();
    const x = e.nativeEvent.clientX - left;
    const percent = (x / width) * 100;
    const time = ((trackDuration / 100) * percent).toFixed(2);

    filledRef.current.style.flexBasis = `${percent}%`;
    playerInstance.changeCurrentTime(time);
  };

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

  const handlePlayPause = () => {
    if (!isPlaying) {
      setIsPlaying(true);
      playerInstance.play();
      playerInstance.events.on('timeUpdate', dataEvent => {
        const { progress, duration } = dataEvent;
        setCurrentTime(progress);
        handleProgress(progress, duration);
        formatTimeDisplays();
      });
    } else {
      setIsPlaying(false);
      playerInstance.pause();
    };
  };

  const handleSkip = (e) => {
    const { name } = e.target.parentNode;
    const skipValue = 5;
    if (name === 'rwd'){
      playerInstance.changeCurrentTime(trackCurrentTime - skipValue);
      setCurrentTime(trackCurrentTime - skipValue);
    };

    if (name === 'fwd'){
      playerInstance.changeCurrentTime(trackCurrentTime + skipValue);
      setCurrentTime(trackCurrentTime + skipValue)
    }
    handleProgress();
  };

  return (
    <div className='player-container' style={!playerInstance ? { display: 'none' } : {}}>


      <h4 className='label'>Listen To Article</h4>


      <div className='controls'>

        <button className='rwd-fwd' name='rwd'><IoIosArrowBack className='rwd-fwd-svg' onClick={(e) => handleSkip(e)} /></button>
        <button className='play-pause' onClick={() => handlePlayPause()}><IoPlayOutline /></button>
        <button className='rwd-fwd' name='fwd'><IoIosArrowForward className='rwd-fwd-svg' onClick={(e) => handleSkip(e)} /></button>

        <div className="progress" ref={progressRef} onClick={(e) => progressClick(e)}>
          <div className="progress-filled" ref={filledRef} ></div>
        </div>



        <div className='timer' onClick={() => handleTimeClick()}>
          {timeDisplay()}
        </div>

      </div>

    </div>


  );
}

export default Player;
