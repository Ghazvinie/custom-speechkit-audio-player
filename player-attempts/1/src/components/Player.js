import React, { useEffect, useState } from 'react';
import keys from '../keys';
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
    return getPlayer();
  }, []);

  return (
    <div className='player-container'>

    </div>

  );
}

export default Player;
