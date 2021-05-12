import { useState, useEffect } from 'react'
import useAuth from './useAuth'
import { Container, Dropdown } from 'react-bootstrap'
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

    const [topArtists, setTopArtists] = useState()
    const [topTracks, setTopTracks] = useState()

    // Set Access Token and Retrieve User Information
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


    // Retrieve User's Top Artists and Tracks
    useEffect(() => {
        if (!accessToken) return

        spotifyApi.getMyTopArtists("time_range=long_term&limit=50").then(res => {
            setTopArtists(res.body.items)
        })

        spotifyApi.getMyTopTracks("time_range=long_term&limit=50").then(res => {
            setTopTracks(res.body.items)
        })

    }, [accessToken])

    return (
        <Container>
            <a href={userURL} target="_blank">{userName}</a>
            <img src={userImage} alt={userName}></img>
            {topArtists ? topArtists[0].name : ''}
            {topTracks ? topTracks[0].name : ''}
        </Container>
    )
}
