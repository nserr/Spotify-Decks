const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const SpotifyWebApi = require('spotify-web-api-node')

const app = express();
app.use(cors())
app.use(bodyParser.json())

app.post('/refresh', (req, res) => {
    const refreshToken = req.body.refreshToken
    const spotifyApi = new SpotifyWebApi({
        redirectUri: 'http://localhost:3000',
        clientId: 'e10bba1aea88476d8577408b7abffcb2',
        clientSecret: '1de80da8caf94d28993c262da8c6b21c',
        refreshToken
    })

    spotifyApi.refreshAccessToken().then(
        (data) => {
            res.json({
                accessToken: data.body.accessToken,
                expiresIn: data.body.expiresIn
            })
        }).catch(() => {
            res.sendStatus(400)
        })
})

app.post('/login', (req, res) => {
    const code = req.body.code
    const spotifyApi = new SpotifyWebApi({
        redirectUri: 'http://localhost:3000',
        clientId: 'e10bba1aea88476d8577408b7abffcb2',
        clientSecret: '1de80da8caf94d28993c262da8c6b21c'
    })

    spotifyApi.authorizationCodeGrant(code).then(data => {
        res.json({
            accessToken: data.body.access_token,
            refreshToken: data.body.refresh_token,
            expiresIn: data.body.expires_in
        })
    }).catch(() => {
        res.sendStatus(400)
    })
})

app.listen(3001)