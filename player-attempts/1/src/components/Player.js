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
  // const [progressBar, setProgressBar] = useState(50);
  const [isPlaying, setIsPlaying] = useState(false);

  
  const filledRef = useRef(null);

  useEffect(() => {
    async function getPlayer() {
      const instance = await SpeechKitSdk.player(initParams);
      setPlayerInstance(instance);
    };
    getPlayer();
  }, []);

//   useEffect(() => {
//       playerInstance.events.on('timeUpdate', dataEvent => {
//    progressClick();
// });
//   },[])

  const progressClick = (e) => {
    console.log('called')
    const percent = (playerInstance.currentTime() / playerInstance.duration()) * 100;
    // setProgressBar(percent)
    filledRef.current.style.flexBasis = `${percent}%`;
  };

  const handlePlayPause = () => {
    if (!isPlaying) {
      setIsPlaying(true);
      playerInstance.play();
      playerInstance.events.on('timeUpdate', dataEvent => {
        progressClick();
     });
    } else {
      setIsPlaying(false);
      playerInstance.pause();
    };
  };



//   playerInstance.events.on('timeUpdate', dataEvent => {
//    progressClick();
// });

  return (
    <div className='player-container'>


        <h4 className='label'>Player Label</h4>


        <button className='rwd-fwd'> -5s </button>
        <button className='play-pause' onClick={()=> handlePlayPause()}>V</button>
        <button className='rwd-fwd'>+5s</button>

        <div className="progress" onClick={(e) => progressClick(e)}>
        <div className="progress-filled" ref={filledRef}></div>
       </div>
        {/* <div className='progress'></div> */}

        {/* <input className='scrubber' type='range' /> */}


      <div className='timer'>
        0:00
      </div>

    </div>

  );
}

export default Player;
