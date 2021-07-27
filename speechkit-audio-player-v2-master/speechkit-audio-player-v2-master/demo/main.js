const listMethod = [
  'play', 'pause', 'paused', 'currentTime', 'duration',
  'remainingTime', 'changeLang:ru', 'changeLang:en', 'changeCurrentTime:2',
  'rewind:15', 'forward:15', 'getCurrent', 'setCurrent:1', 'previous', 'next',
  'getPlaylist', 'getPlaylistItem:1', 'loadPlaylist'
]

const logsBox = document.querySelector('.test-sdk-logs')

const logs = msg => {
  const item = document.createElement('div')
  item.innerText = msg
  logsBox.appendChild(item)
  // eslint-disable-next-line no-console
  console.log(msg)
}

const handleClick = evt => {
  const { target: { name, value } } = evt
  // eslint-disable-next-line no-undef
  const result = name === 'loadPlaylist'
    ? AppInst[name]([
      { podcastId: 281411 },
      { podcastId: 281406 },
      { podcastId: 270894 },
      { externalId: 'd8963892-b6b7-4537-bcf2-e36857930e54' },
    ])
    : AppInst[name](value)
  if (name === 'loadPlaylist') {
    result.then(data => {
      console.log('loadPlaylist -> data', data)
    })
  }
  if (!['play', 'pause'].includes(name)) {
    logs(`fn_${name}() -> ${result}`)
  }
}

const addMethod = root => method => {
  const [methodName, methodValue = ''] = method.split(':')
  const btn = document.createElement('button')
  btn.addEventListener('click', handleClick)
  btn.name = methodName
  btn.value = methodValue
  btn.innerText = `${methodName}(${methodValue})`
  return root.appendChild(btn)
}

const init = () => {
  const root = document.querySelector('.test-sdk-ctrl')
  listMethod.map(addMethod(root))
  // eslint-disable-next-line no-undef
  if (AppInst.events) {
    // eslint-disable-next-line no-undef
    AppInst.events.on('*', (type, data) => {
      // eslint-disable-next-line no-console
      console.log(`on -> ${type} -> `, data)
    })
  }
}

export default init
