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

  return (
    <div className='player-container'>


        <h4 className='label'>Player Label</h4>


        <button> - </button>
        <button>V</button>
        <button>+</button>

      

        <input type='range' />


      <div className='timer-container'>
        0:00
      </div>

    </div>

  );
}

export default Player;
