/* eslint-disable no-console */
import path from 'path'
import fs from 'fs'

const files = [
  './packages/player/README.md',
]

const resolveDistPath = file => (
  path.resolve(__dirname, '..', 'dist', path.basename(file))
)

const ensureDirectoryExistence = filePath => {
  const dirName = path.dirname(filePath)

  if (fs.existsSync(dirName)) {
    return true
  }

  ensureDirectoryExistence(dirName)
  fs.mkdirSync(dirName)
}

const omitPackages = [
  'svelte-redux-connect', 'svelte',
]
const filteredPackages = ([name]) => !omitPackages.includes(name)
const getExternalPackages = ({ dependencies }) => (
  Object.entries(dependencies || {})
    .filter(filteredPackages)
    .reduce((acc, [k, v]) => ({ ...acc, [k]: v }), {})
)

const copyFile = file => {
  const distPath = resolveDistPath(file)
  ensureDirectoryExistence(distPath)
  return new Promise((resolve, reject) => {
    fs.copyFile(
      file,
      distPath,
      err => {
        if (err) reject(err)
        resolve()
      },
    )
  }).then(() => console.log(`Copied ${file} to ${distPath}`))
}

const getPackage = (pathToFile, fileName) => new Promise((resolve, reject) => {
  fs.readFile(path.resolve(__dirname, pathToFile, fileName), 'utf8', (err, data) => {
    if (err) reject(err)
    resolve(data)
  })
}).then(data => JSON.parse(data))

const createPackageFile = () => Promise.all([
  getPackage('../packages/player', 'package.npm.json'),
  getPackage('../packages/player', 'package.json'),
  getPackage('../packages/core', 'package.json'),
])
  .then(([packageTmpl, packagePlayerData, packageCoreData]) => {
    const { version } = packagePlayerData

    const dependencies = {
      ...getExternalPackages(packagePlayerData),
      ...getExternalPackages(packageCoreData),
    }

    const minimalPackage = {
      ...packageTmpl,
      version,
      dependencies,
    }

    return new Promise((resolve, reject) => {
      const distPath = path.resolve(__dirname, '..', 'dist', 'package.json')
      const data = JSON.stringify(minimalPackage, null, 2)
      fs.writeFile(distPath, data, err => {
        if (err) reject(err)
        console.log(`Created package.json in ${distPath}`)
        resolve()
      })
    })
  })

const main = () => {
  Promise.all(files.map(copyFile))
    .then(() => {
      createPackageFile()
    })
    .catch(error => console.log(error))
}

main()
