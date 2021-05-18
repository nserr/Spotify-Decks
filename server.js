const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const SpotifyWebApi = require('spotify-web-api-node')
const path = require('path')
require('dotenv').config()

const app = express();
app.use(cors())
app.use(bodyParser.json())

let uri = ''

if (process.env.NODE_ENV !== 'production') {
    uri = process.env.REACT_APP_DEV_URI
} else {
    app.use(express.static(path.join(__dirname, 'client/build')))
    app.get('*', function (req, res) {
        res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
    });
    uri = process.env.REACT_APP_PROD_URI
}

const PORT = process.env.PORT || 3001

console.log("server running on " + uri)

app.post('/refresh', (req, res) => {
    const refreshToken = req.body.refreshToken
    const spotifyApi = new SpotifyWebApi({
        redirectUri: uri,
        clientId: 'e10bba1aea88476d8577408b7abffcb2',
        clientSecret: process.env.REACT_APP_CLIENT_SECRET,
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
        redirectUri: uri,
        clientId: 'e10bba1aea88476d8577408b7abffcb2',
        clientSecret: process.env.REACT_APP_CLIENT_SECRET
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

app.listen(PORT, () => { console.log(`listening on port ${PORT}`)})