import React, { useEffect, useRef, useState } from 'react';
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
  const [currentTime, setCurrentTime] = useState(0);
  const [timeDisplays, setTimeDisplays] = useState({ displayType: 'duration' });



  const filledRef = useRef(null);

  useEffect(() => {
    async function getPlayer() {
      const instance = await SpeechKitSdk.player(initParams);

      setPlayerInstance(instance);
      setTrackDuration(instance.duration());


    };
    getPlayer();
    formatTimeDisplays();
  }, []);

  useEffect(() => {
    formatTimeDisplays();
  }, [currentTime])

  const handleProgress = (currentTime = playerInstance.currentTime(), duration = trackDuration) => {
    const percent = (currentTime / duration) * 100;
    filledRef.current.style.flexBasis = `${percent}%`;
  }

  const progressClick = (e) => {
    const { x, y } = e.target.getBoundingClientRect();
    console.log(x, y)

  };

  const formatTimeDisplays = () => {

    const minsDuration = Math.floor(trackDuration / 60);
    const secsDuration = Math.floor(trackDuration % 60);
    const durationFormat = `${minsDuration < 1 ? '0' : ''}${minsDuration}:${secsDuration < 10 ? '0' : ''}${secsDuration}`;

    const subMins = Math.floor((trackDuration - currentTime) / 60)
    const subSecs = Math.floor((trackDuration - currentTime) % 60)
    const subFormat = `-${subMins < 1 ? '0' : ''}${subMins}:${subSecs < 10 ? '0' : ''}${subSecs}`;

    const dual = `${subFormat} / ${durationFormat}`
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
        return '0:00'
    };

  }

  const handleTimeClick = () => {
    if(!isPlaying) return;
    
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
  }

  const handlePlayPause = () => {
    if (!isPlaying) {
      setIsPlaying(true);
      playerInstance.play();
      playerInstance.events.on('timeUpdate', dataEvent => {
        const { progress, duration } = dataEvent;
        setCurrentTime(progress);
        handleProgress(progress, duration);
        formatTimeDisplays()
      });
    } else {
      setIsPlaying(false);
      playerInstance.pause();
    };
  };

  return (
    <div className='player-container'>


      <h4 className='label'>Player Label</h4>


      <button className='rwd-fwd'> -5s </button>
      <button className='play-pause' onClick={() => handlePlayPause()}>V</button>
      <button className='rwd-fwd'>+5s</button>

      <div className='progress-container'>
        <div className="progress" onClick={(e) => progressClick(e)}>
          <div className="progress-filled" ref={filledRef} ></div>
        </div>

      </div>


      <div className='timer' onClick={()=> handleTimeClick()}>
        {timeDisplay()}
      </div>

    </div>

  );
}

export default Player;
