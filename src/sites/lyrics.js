import { parse } from 'node-html-parser';

export default (a, s) => {
  return new Promise(async (resolve, reject) => {
    let artist = a.replaceAll(' ', '-')
    let song = s.replaceAll(' ', '+').toLowerCase()
    const baseURL = 'https://lyrics.com'
    // retrieve lyrics.com artist page
    let artistURL = `${baseURL}/artist.php?name=${artist}&o=1`
    let artistResp = await fetch(artistURL)
    if (artistResp.status >= 300) {
      console.log(artistResp.status)
      return reject(new Error("Artist not found"))
    }

    // artist page body and DOM tree
    let artistBody = await artistResp.text()
    const root = parse(artistBody)

    // look for songs in DOM tree
    let rows = root.querySelector('tbody')["childNodes"]
    for (let row of rows) {
      let url = row.firstChild.querySelector('a')["rawAttrs"]
      url = url.substring(6,url.length-1).toLowerCase()

      // found song
      if (url.endsWith(song)) {
        let songURL = `${baseURL}${url}`
        let songResp = await fetch(songURL)
        let songBody = await songResp.text()

        // search song page's DOM tree for lyrics
        const sroot = parse(songBody)
        let lyrics = sroot.querySelector('#lyric-body-text').innerHTML
        const regex = /(<a.*?>)|(<\/a>)/gi
        lyrics = lyrics.replaceAll(regex, '')
        return resolve(lyrics)
      }
    }

    return reject("Song not found")
  })
}