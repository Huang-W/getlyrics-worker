import { parse } from 'node-html-parser';

export default (a, s) => {
  return new Promise(async (resolve, reject) => {
    let artist = a.replaceAll(' ', '')
                  .replaceAll("'", '')
    let song = s.replaceAll(' ', '')
                .replaceAll("'", '')

    // genius lyrics page
    let azURL = `https://azlyrics.com/lyrics/${artist}/${song}.html`
    let azResp = await fetch(azURL)
    if (azResp.status >= 400) {
      console.log(azResp.status)
      return reject(new Error("Lyrics not found"))
    }

    // response body
    let azBody = await azResp.text()

    // DOM tree
    const root = parse(azBody)

    // look for links in DOM tree
    let lyrics = root.querySelector('div.col-xs-12.col-lg-8.text-center')
                     .querySelectorAll('div')
                     .filter(obj => obj["rawAttrs"] == "")[0]
                     .innerHTML
    if (lyrics.length == 0) {
      console.log("length = 0?")
      return reject(new Error("Lyrics could not be parsed"))
    }

    // clean the text
    lyrics = lyrics.replaceAll('<i>', '')
                   .replaceAll('</i>', '')
                   .split('<br>')
                   .map(line => line.trim())
                   .filter(line => line != '')
    return resolve(lyrics)
  })
}
