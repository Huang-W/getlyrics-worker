import { parse } from 'node-html-parser';
const url = require('url');

export default async request => {
  const myURL = new URL(request.url)

  // query parameters
  let artist = myURL.searchParams.get('artist')
  let song = myURL.searchParams.get('song')
  if (artist == null || song == null) {
    return new Response('Please specify an artist and song', { status: 400 })
  }
  artist = artist.replaceAll(' ', '-')
  song = song.replaceAll(' ', '-')

  // genius lyrics page
  let geniusURL = `https://genius.com/${artist}-${song}-lyrics`
  let geniusResp = await fetch(geniusURL)
  if (geniusResp.status >= 400) {
    return new Response('Lyrics not found', { status: 404 })
  }

  // resposne body
  let geniusBody = await geniusResp.text()

  // DOM tree
  const root = parse(geniusBody)

  // look for lyrics in DOM tree
  let links = root.querySelectorAll('a.referent')
  if (links.length == 0) {
    return new Response('Lyrics could not be parsed', { status: 404 })
  }

  // process lyrics
  let responseBody = new Array()
  for (let link of links) {
    let inner = link.innerHTML
    inner = inner.replaceAll('<i>', '')
    inner = inner.replaceAll('</i>', '')
    inner = inner.trim()
    let lines = inner.split('<br>')
    lines = lines.filter(line => line != '')
    for (let line of lines) {
      responseBody.push(line.trim())
    }
  }
  
  return new Response(JSON.stringify(responseBody), {
    status: 200,
    headers: {
      'content-type': 'application/json',
    },
  })
}
