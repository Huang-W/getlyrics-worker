import { parse } from 'node-html-parser';

export default (a, s) => {
  return new Promise(async (resolve, reject) => {
    let artist = a.replaceAll(' ', '')
    let song = s.replaceAll(' ', '')

    // genius lyrics page
    let azURL = `https://azlyrics.com/lyrics/${artist}/${song}.html`
    let azResp = await fetch(azURL)
    if (azResp.status >= 400) {
      console.log(azResp.status)
      return reject(new Error("Lyrics not found"))
    }

    // resposne body
    let azBody = await azResp.text()

    // DOM tree
    const root = parse(azBody)

    // look for links in DOM tree
    let lyrics = root.querySelector('div.col-xs-12.col-lg-8.text-center')["childNodes"][14].innerHTML
    if (lyrics.length == 0) {
      console.log("length = 0?")
      return reject(new Error("Lyrics could not be parsed"))
    }

    // clean text
    lyrics = lyrics.replaceAll('<i>', '')
                   .replaceAll('</i>', '')
                   .split('<br>')
                   .map(line => line.trim())
                   .filter(line => line != '')
    return resolve(lyrics)
  })
}
