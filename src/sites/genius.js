import { parse } from 'node-html-parser';

export default (a, s) => {
  return new Promise(async (resolve, reject) => {
    let artist = a.replaceAll(' ', '-')
    let song = s.replaceAll(' ', '-')

    // genius lyrics page
    let geniusURL = `https://genius.com/${artist}-${song}-lyrics`
    let geniusResp = await fetch(geniusURL)
    if (geniusResp.status >= 400) {
      return reject(new Error("Lyrics not found"))
    }

    // resposne body
    let geniusBody = await geniusResp.text()

    // DOM tree
    const root = parse(geniusBody)

    // look for lyrics in DOM tree
    let links = root.querySelectorAll('a.referent')
    if (links.length == 0) {
      return reject(new Error("Lyrics could not be parsed"))
    }

    // clean text
    let lyrics
    for (let link of links) {
      let inner = link.innerHTML
      let lines = inner.replaceAll('<i>', '')
                       .replaceAll('</i>', '')
                       .trim()
                       .split('<br>')
                       .map(line => line.trim())
                       .filter(line => line != '')
      lines.forEach((line) => {
        lyrics.push(line)
      });
    }
    console.log(lyrics)
    return resolve(lyrics)
  })
}
