const { join } = require('path')
const { cwd } = require('process')
const fs = require('fs')

const html = '.html'

function encode(routes) {
  return JSON.stringify(routes, null, 2)
}

function getAllFiles(dirPath, arrayOfFiles = []) {
  const files = fs.readdirSync(dirPath)

  arrayOfFiles = arrayOfFiles || []

  files.forEach(file => {
    if (fs.statSync(dirPath + '/' + file).isDirectory()) {
      arrayOfFiles = getAllFiles(dirPath + '/' + file, arrayOfFiles)
    } else {
      if (file === '.DS_Store') return

      arrayOfFiles.push(join(dirPath, '/', file))
    }
  })

  return arrayOfFiles
}

async function getRedirects() {
  const pagesPath = join(cwd(), 'out')
  const pages = getAllFiles(pagesPath)
  const routes = [
    {
      source: '/<*>',
      target: '/404.html',
      status: '404-200',
      condition: null,
    },
    ...pages
      .map(route => {
        let target = route.replace(pagesPath, '').replace(/\\/g, '/')

        if (!target.endsWith(html)) return null
        if (target === '/404.html') return null

        let source = target
          .replace(html, '')
          .replace(/]/g, '>')
          .replace(/\[/g, '<')

        if (source === '/index') {
          source = '/'
        }

        return {
          source,
          target,
          status: '200',
          condition: null,
        }
      })
      .filter(Boolean),
  ]
  return routes
}

async function main() {
  const redirects = await getRedirects()
  fs.writeFile('redirects.json', encode(redirects), function (err) {
    if (err) throw err

    console.log('Amplify redirects created')
    return
  })
}

main()
