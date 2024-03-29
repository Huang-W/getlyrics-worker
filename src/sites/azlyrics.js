import { parse } from 'node-html-parser';

export default (a, s) => {
  return new Promise(async (resolve, reject) => {
    let artist = a.replaceAll(' ', '')
                  .replaceAll(/[\W_]+/gi, '');
    let song = s.replaceAll(' ', '')
                .replaceAll(/[\W_]+/gi, '');

    // genius lyrics page
    let azURL = `https://azlyrics.com/lyrics/${artist}/${song}.html`
    let azResp = await fetch(azURL)
    if (azResp.status >= 400) {
      console.log("az:" + azResp.status)
      reject("Lyrics not found")
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
    if (lyrics == undefined || lyrics.length == 0) {
      console.log("length = 0?")
      reject("Lyrics could not be parsed")
    }

    // clean the text
    lyrics = lyrics.replaceAll('<i>', '')
                   .replaceAll('</i>', '')
                   .split('<br>')
                   .map(line => line.trim())
                   .filter(line => line != '')

    console.log("azlyrics")
    resolve(lyrics.join("\n"))
  })
}
