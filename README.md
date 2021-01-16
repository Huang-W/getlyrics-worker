### Workers APP to retrieve lyrics

For personal use

Workers Doc: https://developers.cloudflare.com/workers/

URL: https://getlyrics-worker.huangw.workers.dev/lookup

Usage: https://getlyrics-worker.huangw.workers.dev/lookup?artist={artist}&song={song}

#### Input:

artist and song as query parameters

Example request

`https://getlyrics-worker.huangw.workers.dev/lookup?artist=green day&song=boulevard of broken dreams`

#### Output:

text with newlines

Example response
```
I walk a lonely road
The only one that I have ever known
Don't know where it goes
But it's home to me and I walk alone
I walk this empty street
On the Boulevard of Broken Dreams
Where the city sleeps
And I'm the only one and I walk alone
....
```
