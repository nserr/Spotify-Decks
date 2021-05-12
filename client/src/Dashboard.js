import { useState, useEffect } from 'react'
import useAuth from './useAuth'
import { Container } from 'react-bootstrap'
import SpotifyWebApi from 'spotify-web-api-node'

const spotifyApi = new SpotifyWebApi({
    clientId: 'e10bba1aea88476d8577408b7abffcb2',
})

export default function Dashboard({ code }) {
    const accessToken = useAuth(code)
    const [userName, setUserName] = useState()
    const [userURL, setUserURL] = useState()
    const [userURI, setUserURI] = useState()
    const [userImage, setUserImage] = useState()

    useEffect(() => {
        if (!accessToken) return
        spotifyApi.setAccessToken(accessToken)

        // Get User Information
        spotifyApi.getMe().then(res => {
            setUserName(res.body.display_name)
            setUserURL(res.body.external_urls.spotify)
            setUserURI(res.body.uri)
            setUserImage(res.body.images[0].url)
        })

    }, [accessToken])

    function getTopArtists() {
        spotifyApi.getMyTopArtists().then(res => {
            console.log(res)
        })
    }

    return (
        <Container>
            <a href={userURL} target="_blank">{userName}</a>
            <img src={userImage} alt={userName}></img>
            <button onClick={getTopArtists}>Get Top Artists</button>
        </Container>
    )
}
