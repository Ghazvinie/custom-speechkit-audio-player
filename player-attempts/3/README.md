# Creating a custom audio player using the SpeechKit Player SDK
	
SpeechKit offers a [JavaScript Player SDK](https://docs.speechkit.io/player/js-player-and-sdk) that can be used to create custom audio players for your audio projects. This repository provides a simple example built using ReactJS. 

It also provides an example of how the audio player can be customised to increase user engagement by enticing them to subscribe - the player is displayed, but will only work if the user has a valid subscription, if not, a dropdown prompts them to do so. 


<!--IMAGE OF PLAYER-->
	
## Initial Setup

Install the Player SDK

```
npm install @speechkit/speechkit-audio-player-v2
```

Setup the React application using your preferred method. The easiest way is to use [Create React App](https://create-react-app.dev/docs/getting-started/).

## Player Setup

### Player Component
Create a component called `Player.js`

Import the useEffect, useRef and useState hooks, as well as the SpeechKit SDK:

```javascript
import React, { useEffect, useRef, useState } from 'react';
import { SpeechKitSdk } from '@speechkit/speechkit-audio-player-v2';
```
Create a Player function, and set it as the default export:

```javascript
function Player() {
 }
 
export default Player;
```

### Player Init Params
To intialise the player some parameters are required, these can be obtained from your SpeechKit account.

```javascript
const initParams = {
  // Mandatory Parameter
  projectId: 'YOUR_ID',
  
  // One of the following parameters
  podcastId: 'YOUR_ID',
  articleUrl: 'YOUR_URL',
  externalId: 'YOUR_ID',
};
```

These keys should be stored securely. For simplicity, in this example they are stored in a separate `keys` file:

```javascript
const initParams = {
  projectId: keys.project_id,
  externalId: keys.external_id
};
```


## Basic Styling
The player style can be customised however you like. In this example it was kept to a simple shape and neutral colours, and the player dimensions fixed to a specified size. 

In `App.css`:

```css
main {
    width: 100%;
    padding: 2rem 0;
    display: flex;
    flex-direction: column;
    align-items: center;
}
```
Create `Player.css`

Add the basic styles for the container which will hold the player:

```css
.player-container {
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    width:650px;
    height: 55px;
    background-color:rgba(59, 59, 59, 0.055);
    color: rgba(59, 59, 59, 0.900);
    font-family: -apple-system
}
```

## State and Refs
There are numerous state and references that are required, their use will be explained in greater detail when they are used. 
### useState()
There are six state values that are maintained:

1. `playerInstance` - The instance of the player
2.  `playerReady` - Whether the player is ready to play audio
3.  `trackDuration` - The duration of audio
4.  `isPlaying` - Whether audio is playing
5.  `timeDisplays` - The audio timer/clocks
6.  `userLoggedIn` - Whether the user is logged in/has a subscription

```javascript
const [playerInstance, setPlayerInstance] = useState(null);
const [playerReady, setPlayerReady] = useState(false);
const [trackDuration, setTrackDuration] = useState(0);
const [isPlaying, setIsPlaying] = useState(false);
const [timeDisplays, setTimeDisplays] = useState({ displayType: 'duration' });
const [userLoggedIn, setUserLoggedIn] = useState(true);
```

### useRef()
Four ref values are required:

1. `progressRef` - The progress bar
2. `filledRef` - The 'filled' part of the progress bar
3. `timerRef` - The audio clock/timer
4. `dropRef` - The login/subscribe dropdown 

```javascript
const progressRef = useRef(null);
const filledRef = useRef(null);
const timerRef = useRef(null);
const dropdownRef = useRef(null);
```

## Player HTML

### HTML

The player as displayed to the user is essentially a collection of buttons acting as controls for specific methods, a progress bar and a clock/timer. The HTML structure for this is as follows:

```html
<div className='player-container'>

  <h4 className='label'>Title Placeholder</h4>

  <div className='controls'>

    <button className='rwd-fwd' name='rwd'></button>

    <button className='play-pause'></button>

    <button className='rwd-fwd' name='fwd'></button>

    <div className='progress' ref={progressRef}>
      <div className='progress-filled' ref={filledRef}></div>
    </div>

    <div className='timer' ref={timerRef}></div>

  </div>

</div>
```

Your `Player` component should now look like this:

```javascript

function Player() {
  const [playerInstance, setPlayerInstance] = useState(null);
  const [playerReady, setPlayerReady] = useState(false);
  const [trackDuration, setTrackDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeDisplays, setTimeDisplays] = useState({ displayType: 'duration' });
  const [userLoggedIn, setUserLoggedIn] = useState(true);

  const progressRef = useRef(null);
  const filledRef = useRef(null);
  const timerRef = useRef(null);
  const dropdownRef = useRef(null);

  return (
    <>
      <div className='player-container'>

        <h4 className='label'>Title Placeholder</h4>

        <div className='controls'>

          <button className='rwd-fwd' name='rwd'></button>

          <button className='play-pause'></button>

          <button className='rwd-fwd' name='fwd'></button>

          <div className='progress' ref={progressRef}>
            <div className='progress-filled' ref={filledRef}></div>
          </div>

          <div className='timer' ref={timerRef}></div>

        </div>

      </div>
    </>
  );
}
```

The styles for each element can be found in the `Player.css` file. 

## Initiliasing the Player with useEffect() Hook

Several useEffect() hooks are required for updating the component when certain values change and for turning off player event listeners. However, most importantly, a useEffect() is essential in initialising the player from the SDK. 

### Initialising the Player
When the comoponent first renders the Player component it will asynchronously begin initialisation through the SDK. Once initialised the player instance will be stored in state and become available for use to play audio etc, if this process fails state will be updated accordingly. 

* An async function is used to initialise the player:
 * `playerReady` state is updated with a boolean value
 * An instance of the player is created and stored in state, as well as the track duration
 * The time displays are updated
* This function is called once, when the component first renders

```javascript 
useEffect(() => {
  async function getPlayer() { // Async function
    const isReady = await SpeechKitSdk.isAudioReady(initParams); // Boolean value
    setPlayerReady(isReady); // Update state
    if (isReady) {
      const instance = await SpeechKitSdk.player(initParams); // Creates a player instance
      setPlayerInstance(instance); // Stores instance in state
      setTrackDuration(instance.duration()); // Stores track duration in state
      formatTimeDisplays(); // Updates time displays
    };
  };
  getPlayer(); // Called at first render
}, []);
```

The other useEffect() hooks will be detailed when they are used later in the guide. 

With the player instance ready the controls of the player can be created. 

## Player Controls

### Play and Pause
Within the HTML add your chosen Play/Pause icons and set to conditionally render depending on the `isPlaying` state, as well as a `handlePlayPause` `onClick` event handler. 

```react
<button className='play-pause' onClick={() => handlePlayPause()}>{!isPlaying ? <PlayIcon /> : <PlayIcon />}</button>
```


