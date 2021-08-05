import React, { useEffect, useState } from 'react';
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

  useEffect(() => {
    async function getPlayer() {
      const instance = await SpeechKitSdk.player(initParams);
      setPlayerInstance(instance);
    };
    getPlayer();
  }, []);

  const progressClick = (e) => {
    const target = e.target;
  }


  return (
    <div className='player-container'>


        <h4 className='label'>Player Label</h4>


        <button className='rwd-fwd'> -5s </button>
        <button className='play-pause'>V</button>
        <button className='rwd-fwd'>+5s</button>

        <div className="progress">
        <div className="progress__filled"></div>
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
