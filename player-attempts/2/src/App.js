import Player from './components/Player';
// import Dropdown from './components/Dropdown';
import './App.css';
import { useState } from 'react';


function App() {

  const [userLoggedIn, setUserLoggedIn] = useState(false);



  return (
    <main>
    <Player userLoggedIn={userLoggedIn}/>
    </main>
  );
}

export default App;
