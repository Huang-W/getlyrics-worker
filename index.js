import lookup from "./src/handlers/lookup"
const Router = require('./router')

addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
    const r = new Router()
    r.get("/lookup", lookup)
    r.get('/.*', () => new Response('Usage: https://getlyrics-worker.huangw.workers.dev/lookup?artist={artist}&song={song}')) // return a default message for the root route

    let response = await r.route(request)
    if (!response) {
      response = new Response("Not found", { status: 404 })
    }
    return response
}
