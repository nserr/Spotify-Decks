import { useState, useEffect } from 'react'
import useAuth from './useAuth'
import SpotifyWebApi from 'spotify-web-api-node'

import { Container, Row, Col, Image, Spinner, CardDeck } from 'react-bootstrap'

import './dashboardStyles.css'
import './cardStyles.css'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons'

import logo from './logo.png'

const spotifyApi = new SpotifyWebApi({
    clientId: 'e10bba1aea88476d8577408b7abffcb2',
})

export default function Dashboard({ code }) {
    const accessToken = useAuth(code)

    const [userName, setUserName] = useState()
    const [userURL, setUserURL] = useState()
    const [userImage, setUserImage] = useState()

    const [topArtists, setTopArtists] = useState()
    const [topTracks, setTopTracks] = useState()


    // Set Access Token and Retrieve User Information
    useEffect(() => {
        if (!accessToken) return

        spotifyApi.setAccessToken(accessToken)

        spotifyApi.getMe().then(res => {
            setUserName(res.body.display_name)
            setUserURL(res.body.external_urls.spotify)
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


    function ArtistList() {
        const cards = topArtists.map((artist) =>
            <div className="card" key={artist.id}>
                <div className="card__content"> 
                    <div className="card__front" style={{ backgroundImage: `url(${artist.images[0].url})`}}>
                        <h3 className="card__title">{artist.name}</h3>
                        <p className="card__subtitle">{topArtists.indexOf(artist) + 1}</p>
                    </div>

                    <div className="card__back">
                        <p className="card__body">{artist.genres.toString()}</p>
                        <a className="card__body" href={artist.external_urls.spotify} target="_blank">Spotify</a>
                    </div>
                </div>
            </div>
        )

        return ( <CardDeck className="artist-deck">{cards}</CardDeck> )
    }


    function TrackList() {
        const listItems = topTracks.map((track) =>
            <li key={track.id}>{track.name}</li>
        )

        return ( <ol>{listItems}</ol> )
    }

    return (
        <Container className="main">
            <Container className="user-info">
                <Row>
                    <Col md="auto">
                        <a href={userURL} target="_blank">
                            <Image className="user-image" src={userImage} roundedCircle />
                        </a>
                    </Col>
                    <Col className="user-name">
                        <p>{userName}'s deck.</p>
                    </Col>
                    <Col xs lg="2">
                        <Image className="logo" src={logo} rounded/>
                    </Col>
                </Row>
            </Container>
            <Container className="lines">
                <div className="line" style={{ backgroundColor: 'black' }}></div>
                <div className="line" style={{ backgroundColor: '#1DB954' }}></div>
                <div className="line" style={{ backgroundColor: 'black' }}></div>
            </Container>
            <Container className="list-container">
                {/* {topArtists ? console.log(topArtists) : ''} */}
                {/* {topTracks ? console.log(topTracks) : ''} */}

                {topArtists ? <ArtistList /> : <Spinner animation="border" role="status"></Spinner>}
                {/* {topTracks ? <TrackList /> : <Spinner animation="border" role="status"></Spinner>} */}
                
            </Container>
        </Container>
    )
}
