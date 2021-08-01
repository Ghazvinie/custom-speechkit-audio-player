import keys from './key.js';

const article = {
    api_key: keys.api_key,
    title: `Test Upload API`,
    body: `Charlotte Worthington ensured a dramatic start to Sunday's Olympic action with a thrilling gold medal in the women's BMX park freestyle final, while Duncan Scott continued to help Great Britain make history in the pool.
    Worthington fell on her first run but landed a ground-breaking 360-degree backflip on her second to score 97.50.
    Declan Brooks then took bronze in the men's event, GB's fourth BMX medal.
    GB's eighth Tokyo swimming medal came with men's 4x100m medley relay silver.
    That makes it their most successful Games and means Scott has won more medals at a single Olympics than any other British competitor.
    The 24-year-old, who signs off with a gold and three silvers, was part of a quartet including Adam Peaty, Luke Greenbank and James Guy that were pipped to the title by the USA.
    British boxer Ben Whittaker also guaranteed himself at least a silver medal by beating Imam Khataev, of the Russian Olympic Committee, to reach Tuesday's 81kg final. 
    Pat McCormack will also fight for gold in the men's welterweight division after Ireland's Aidan Walsh pulled out of their semi-final with an ankle injury, while Frazer Clarke reached the super-heavyweight final after France's Mourad Aliev was disqualified.`,
    author: 'BBC',
}

async function postAudio() {

    const fetchParams = {
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify(article)
    }

    try {
        const response = await fetch(`https://app.speechkit.io/api/v3/projects/${keys.project_id}/audio`, fetchParams)
        console.log(response)


    } catch (error) {
        console.log(error);
    }
}
postAudio()

async function getAudio(){
    try {
        const response = await fetch()
    } catch (error) {
        console.log(error);
    }
}