import { parse } from 'node-html-parser';

export default (a, s) => {
  return new Promise(async (resolve, reject) => {
    let artist = a.replaceAll(' ', '-')
                  .replaceAll("'", '')
    let song = s.replaceAll(' ', '-')
                .replaceAll("'", '')

    // genius lyrics page
    let geniusURL = `https://genius.com/${artist}-${song}-lyrics`
    let geniusResp = await fetch(geniusURL)
    if (geniusResp.status >= 400) {
      return reject(new Error("Lyrics not found"))
    }

    // response body
    let geniusBody = await geniusResp.text()

    // DOM tree
    const root = parse(geniusBody)

    // look for lyrics in DOM tree
    let lyrics = root.querySelector('div.lyrics')
                     .querySelector('p')
                     .innerHTML
    if (lyrics.length == 0) {
      return reject(new Error("Lyrics could not be parsed"))
    }

    // clean the text
    const regex = /(<a[\s\S]*?>)|(<\/a>)/gi
    lyrics = lyrics.replaceAll(regex, '')
                   .replaceAll('<i>', '')
                   .replaceAll('</i>', '')
                   .trim()
                   .split('<br>')
                   .map(line => line.trim())
                   .filter(line => line != '')

    console.log("genius")
    return resolve(lyrics.join("\n"))
  })
}
