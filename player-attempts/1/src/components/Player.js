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
  const [timeDisplays, setTimeDisplays] = useState(null);



  const filledRef = useRef(null);

  useEffect(() => {
    async function getPlayer() {
      const instance = await SpeechKitSdk.player(initParams);

      setPlayerInstance(instance);
      setTrackDuration(instance.duration());

      instance.events.on('timeUpdate', dataEvent => {
        const { progress, duration } = dataEvent;
        setCurrentTime(progress);
        handleProgress(progress, duration);
      });
    };
    getPlayer();
  }, []);

  const handleProgress = (currentTime = playerInstance.currentTime(), duration = trackDuration) => {
    const percent = (currentTime / duration) * 100;
    filledRef.current.style.flexBasis = `${percent}%`;
  }

  const progressClick = (e) => {
    const {x, y} = e.target.getBoundingClientRect();
    console.log(x, y)

  };

  const createTimeDisplays = () => {
    const mins = trackDuration / 60;
    const secs = trackDuration % 60;

    const minsAndSecs = `${mins < 1 ? '0' : ''}${mins}:${secs > 10 ? '0' : ''}`;
    console.log(minsAndSecs)
  }

  const handlePlayPause = () => {
    if (!isPlaying) {
      setIsPlaying(true);
      playerInstance.play();
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



      <div className='timer'>
        {currentTime.toFixed(2)}/{Math.round(trackDuration / 60)}:{Math.round(trackDuration % 60)}
      </div>

    </div>

  );
}

export default Player;
