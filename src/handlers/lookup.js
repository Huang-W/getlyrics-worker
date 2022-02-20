const url = require('url');
import genius from '../sites/genius'
import azlyrics from '../sites/azlyrics'
import lyrics from '../sites/lyrics'

export default request => {
  const myURL = new URL(request.url)

  // query parameters
  let artist = myURL.searchParams.get('artist')
  let song = myURL.searchParams.get('song')
  if (artist == null || song == null) {
    return new Response('Please specify an artist and song', { status: 400 })
  }

  let headers = {
    'content-type': 'text/plain',
  }

  let promises = [azlyrics(artist, song)]

  return Promise.any(promises)
    .then(respBody => {
      return new Response(respBody, {
        status: 200,
        header: headers,
      })
    })
    .catch(e => {
      return new Response("Not Found", {
          status: 404,
          header: headers,
        })
    })
}
