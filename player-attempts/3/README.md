# Creating a custom audio player using the SpeechKit Player SDK
	
SpeechKit offers a [JavaScript Player SDK](https://docs.speechkit.io/player/js-player-and-sdk) that can be used to create custom audio players for your audio projects. This repository provides a simple example built using ReactJS. 


<!--IMAGE OF PLAYER-->
	
## Initial Setup

Install the Player SDK

```
npm install @speechkit/speechkit-audio-player-v2
```

Setup the React application using your preferred method. The easiest way is to use [Create React App](https://create-react-app.dev/docs/getting-started/).

## Creating The Player

### Player Component
* Create a component called `Player.js`
* Import the useEffect, useRef and useState hooks, as well as the SpeechKit SDK

```javascript
import React, { useEffect, useRef, useState } from 'react';
import { SpeechKitSdk } from '@speechkit/speechkit-audio-player-v2';
```
* Create a Player function, and set it as the default export

```
function Player() {
 }
 
export default Player;
```