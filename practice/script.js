import keys from './key.js';
import SpeechKit from 'https://proxy.speechkit.io/npm/@speechkit/speechkit-audio-player-v2@latest/dist/module/index.js';


const article = {
    api_key: keys.api_key,
    title: `Test Upload API With Update`,
    body: `Charlotte Worthington ensured a dramatic start to Sunday's Olympic action with a thrilling gold medal in the women's BMX park freestyle final, while Duncan Scott continued to help Great Britain make history in the pool.
    Worthington fell on her first run but landed a ground-breaking 360-degree backflip on her second to score 97.50.
    Declan Brooks then took bronze in the men's event, GB's fourth BMX medal.
    GB's eighth Tokyo swimming medal came with men's 4x100m medley relay silver.
    That makes it their most successful Games and means Scott has won more medals at a single Olympics than any other British competitor.
    The 24-year-old, who signs off with a gold and three silvers, was part of a quartet including Adam Peaty, Luke Greenbank and James Guy that were pipped to the title by the USA.
    British boxer Ben Whittaker also guaranteed himself at least a silver medal by beating Imam Khataev, of the Russian Olympic Committee, to reach Tuesday's 81kg final. 
    Pat McCormack will also fight for gold in the men's welterweight division after Ireland's Aidan Walsh pulled out of their semi-final with an ankle injury, while Frazer Clarke reached the super-heavyweight final after France's Mourad Aliev was disqualified.`,
    author: 'BBC',
};

async function postAudio() {
    const fetchParams = {
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify(article)
    };
    try {
        const response = await fetch(`https://app.speechkit.io/api/v3/projects/${keys.project_id}/audio`, fetchParams)
        console.log(response)
        const data = await response.json();
        console.log(data);
    } catch (error) {
        console.log(error);
    }
}

const articleUpdate = {
    api_key: keys.api_key,
    external_id: keys.external_id,
    title: `Test Upload API With Update`,
    body: `UPDATE UPDATE UPDATE Charlotte Worthington ensured a dramatic start to Sunday's Olympic action with a thrilling gold medal in the women's BMX park freestyle final, while Duncan Scott continued to help Great Britain make history in the pool.
    Worthington fell on her first run but landed a ground-breaking 360-degree backflip on her second to score 97.50.
    Declan Brooks then took bronze in the men's event, GB's fourth BMX medal.
    GB's eighth Tokyo swimming medal came with men's 4x100m medley relay silver.
    That makes it their most successful Games and means Scott has won more medals at a single Olympics than any other British competitor.
    The 24-year-old, who signs off with a gold and three silvers, was part of a quartet including Adam Peaty, Luke Greenbank and James Guy that were pipped to the title by the USA.
    British boxer Ben Whittaker also guaranteed himself at least a silver medal by beating Imam Khataev, of the Russian Olympic Committee, to reach Tuesday's 81kg final. 
    Pat McCormack will also fight for gold in the men's welterweight division after Ireland's Aidan Walsh pulled out of their semi-final with an ankle injury, while Frazer Clarke reached the super-heavyweight final after France's Mourad Aliev was disqualified.`,
    author: 'BBC',
};

async function updateAudio() {

    const fetchParams = {
        method: 'PUT',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify(articleDelete)
    };
    try {
        const response = await fetch(`https://app.speechkit.io/api/v3/projects/${keys.project_id}/audio/2424443`, fetchParams)
        console.log(response)
        const data = await response.json();
        console.log(data);

    } catch (error) {
        console.log(error);
    }
}

const articleDelete = {
    api_key: keys.api_key,
};

async function deleteAudio() {

    const fetchParams = {
        method: 'DELETE',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify(articleUpdate)
    };
    try {
        const response = await fetch(`https://app.speechkit.io/api/v3/projects/${keys.project_id}/audio/2424443`, fetchParams)
        console.log(response)
        const data = await response.json();
        console.log(data);

    } catch (error) {
        console.log(error);
    }
}

async function retrieveAudio() {

    const fetchParams = {
        method: 'GET',
        headers: {
            'Content-type': 'application/json'
        }
    };
    try {
        const response = await fetch(`https://app.speechkit.io/api/v3/projects/${keys.project_id}/audio/2424525?api_key=${keys.api_key}`, fetchParams)
        console.log(response)
        const data = await response.json();
        console.log(data);
        const src = data.media[0].url;
        embedAudio(src);
    } catch (error) {
        console.log(error);
    }
}

function embedAudio(src) {
    const embedDestination = document.querySelector('.speechkit-audio-player-mp3-test')
    embedDestination.innerHTML =
        `<audio controls>
            <source src="${src}" type="audio/mpeg">
        </audio>`
}

async function listAudio() {

    const fetchParams = {
        method: 'GET',
        headers: {
            'Content-type': 'application/json'
        }
    };
    try {
        const response = await fetch(`https://app.speechkit.io/api/v3/projects/${keys.project_id}/audio?api_key=${keys.api_key}`, fetchParams)
        console.log(response)
        const data = await response.json();
        console.log(data);

    } catch (error) {
        console.log(error);
    }
}

async function listProjects() {

    const fetchParams = {
        method: 'GET',
        headers: {
            'Content-type': 'application/json'
        }
    };
    try {
        const response = await fetch(`https://app.speechkit.io/api/v3/projects?api_key=${keys.api_key}`, fetchParams)
        console.log(response)
        const data = await response.json();
        console.log(data);

    } catch (error) {
        console.log(error);
    }
}

// -------------------------------------------------------------------------------------------------------------------------

// window.addEventListener('message', event => {
//     console.log('event -> data -> ', event.data)
// }, false)

const playerSdk = document.querySelector('.speechkit-audio-sdk-player');
const play = document.getElementById('play').addEventListener('click', handleClick);
const pause = document.getElementById('pause').addEventListener('click', handleClick);

const currTime = document.getElementById('currTime');
const duration = document.getElementById('duration');
const remTime = document.getElementById('remTime');

const rwd = document.getElementById('rwd').addEventListener('click', handleClick);
const fwd = document.getElementById('fwd').addEventListener('click', handleClick);

const playRate = document.getElementById('playRate').onchange = function (e) {
    const value = Number(e.target.value);
    myApp.changePlaybackRate(value);
};

document.getElementById('changeTime').onsubmit = function (e) {
    e.preventDefault();
    const value = document.getElementById('changeTimeInput').value
    myApp.changeCurrentTime(value);
};

const initParams = {
    projectId: keys.project_id,
    externalId: keys.external_key,
    articleUrl: 'http://http://localhost:3000/',
    renderNode: playerSdk,
};

let myApp;

SpeechKit.sdk.player(initParams).then(appInst => {
    myApp = appInst;
    duration.innerText = `${myApp.duration()}`;

    myApp.events.on('timeUpdate', dataEvent => {
        const { duration, progress } = dataEvent;
        currTime.innerText = progress;
        remTime.innerText = duration - progress;
    })
});

function handleClick(e) {

    const { name } = e.target;
    if (name === 'play') {
        myApp.play();
        console.log(myApp.events.on('play', dateEvent => console.log(dateEvent)))
    }

    if (name === 'pause') {
        myApp.pause();
        console.log(myApp.events.on('pause', dateEvent => console.log(dateEvent)))
    }

    if (name === 'rwd') {
        myApp.rewind(2.00);
    }

    if (name === 'fwd') {
        myApp.forward(2.00);
    }
}
