import { useState, useEffect } from 'react'
import useAuth from './useAuth'
import SpotifyWebApi from 'spotify-web-api-node'

import { Container, Row, Col, Image, Spinner, CardDeck, ButtonGroup, ToggleButton, ProgressBar } from 'react-bootstrap'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpotify } from '@fortawesome/free-brands-svg-icons'
import { faUser, faClock } from '@fortawesome/free-solid-svg-icons'

import './dashboardStyles.css'
import './cardStyles.css'

const spotifyApi = new SpotifyWebApi({
    clientId: 'e10bba1aea88476d8577408b7abffcb2',
})

export default function Dashboard({ code }) {
    const accessToken = useAuth(code)

    const [userName, setUserName] = useState()
    const [userURL, setUserURL] = useState()
    const [userImage, setUserImage] = useState()

    const [topArtistsAll, setTopArtistsAll] = useState()
    const [topArtists6M, setTopArtists6M] = useState()
    const [topArtists1M, setTopArtists1M] = useState()
    const [activeArtists, setActiveArtists] = useState()

    const [topTracksAll, setTopTracksAll] = useState()
    const [topTracks6M, setTopTracks6M] = useState()
    const [topTracks1M, setTopTracks1M] = useState()
    const [activeTracks, setActiveTracks] = useState()

    const [timeRange, setTimeRange] = useState('1')
    const [statType, setStatType] = useState('1')


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

        // Artists
        spotifyApi.getMyTopArtists("time_range=long_term&limit=50").then(res => {
            setTopArtistsAll(res.body.items)
            setActiveArtists(res.body.items)
        })
        spotifyApi.getMyTopArtists("time_range=medium_term&limit=50").then(res => {
            setTopArtists6M(res.body.items)
        })
        spotifyApi.getMyTopArtists("time_range=short_term&limit=50").then(res => {
            setTopArtists1M(res.body.items)
        })

        // Tracks
        spotifyApi.getMyTopTracks("time_range=long_term&limit=50").then(res => {
            setTopTracksAll(res.body.items)
            setActiveTracks(res.body.items)
        })
        spotifyApi.getMyTopTracks("time_range=medium_term&limit=50").then(res => {
            setTopTracks6M(res.body.items)
        })
        spotifyApi.getMyTopTracks("time_range=short_term&limit=50").then(res => {
            setTopTracks1M(res.body.items)
        })

    }, [accessToken])


    // Create Artist Cards
    function ArtistList() {
        const cards = activeArtists.map((artist) =>
            <div className="card" key={artist.id}>
                <div className="card__content"> 
                    <div className="card__front" style={{ backgroundImage: `url(${artist.images[0].url})`}}>
                        <h3 className="card__title__artist">{artist.name}</h3>
                        <p className="card__rank">{activeArtists.indexOf(artist) + 1}</p>
                    </div>
                    <div className="card__back">
                        <div className="card__back__row">
                            <p className="card__back__title">{artist.name}</p>
                        </div>
                        { ArtistGenres(artist.genres) }
                        <div className="card__back__row">
                            <p className="card__back__stats" title="Followers"><FontAwesomeIcon icon={faUser}/>{" " + artist.followers.total.toLocaleString(navigator.language, { minimumFractionDigits: 0 })}</p>
                            <a className="card__back__link" href={artist.external_urls.spotify} title="View on Spotify" target="_blank"><FontAwesomeIcon icon={faSpotify} size="2x"/></a>
                            <ProgressBar className="card__back__popularity" variant="success" animated now={artist.popularity} label={artist.popularity} title="Popularity"></ProgressBar>
                        </div>
                    </div>
                </div>
            </div>
        )

        return ( <CardDeck className="artist-deck">{cards}</CardDeck> )
    }


    // Create Artist Genre Items
    function ArtistGenres(genres) {
        const artistGenres = genres.map((genre) =>
            <div className="card__back__genre" key={genre}>
                {genre}
            </div>
        )

        return ( <div className="card__back__genres">{artistGenres}</div> )
    }


    // Create Track Cards
    function TrackList() {
        const cards = activeTracks.map((track) =>
            <div className="card" key={track.id}>
                <div className="card__content"> 
                    <div className="card__front" style={{ backgroundImage: `url(${track.album.images[0].url})`}}>
                        {TrackNameFormatter(track.name)}
                        <p className="card__rank">{activeTracks.indexOf(track) + 1}</p>
                        <p className="card__artist">{track.artists[0].name}</p>
                    </div>
                    <div className="card__back">
                        <div className="card__back__row">
                            <p className="card__back__title">{track.name}</p>
                        </div>
                        { TrackArtists(track.artists) }
                        <div className="card__back__row">
                            <p className="card__back__stats" title="Duration"><FontAwesomeIcon icon={faClock}/>{" " + convertTime(track.duration_ms)}</p>
                            <a className="card__back__link" href={track.external_urls.spotify} title="View on Spotify" target="_blank"><FontAwesomeIcon icon={faSpotify} size="2x"/></a>
                            <ProgressBar className="card__back__popularity" variant="success" animated now={track.popularity} label={track.popularity} title="Popularity"></ProgressBar>
                        </div>
                    </div>
                </div>
            </div>
        )

        return ( <CardDeck className="track-deck">{cards}</CardDeck> )
    }


    // Format Track Names With Parentheses
    function TrackNameFormatter(trackName) {
        const regex = /\((.*?)\)/gm

        if (regex.test(trackName)) {
            const splits = trackName.split(regex)
            return (
                <>
                    <h3 className="card__title__track">{splits[0]}</h3>
                    <h3 className="card__title__track" style={{ fontSize: "1.5em" }}>{splits[1]}</h3>
                </>
            )
        }

        return ( <h3 className="card__title__track">{trackName}</h3> )
    }


    // Create Artist Genre Items
    function TrackArtists(artists) {
        const trackArtists = artists.map((artist) =>
            <a className="card__back__artist" key={artist.id} href={artist.external_urls.spotify} target="_blank" title="View on Spotify">
                <FontAwesomeIcon icon={faSpotify} size="lg" style={{ marginRight: "0.5em" }}/>
                {artist.name}
            </a>
        )

        return ( <div className="card__back__artists">{trackArtists}</div> )
    }


    // Convert Duration Time from Milliseconds to Minutes:Seconds
    function convertTime(ms) {
        const m = Math.floor(ms / 60000)
        const s = Math.floor((ms / 1000) % 60)
        
        let paddingString = ""
        if (s < 10) paddingString = "0"

        return (m + ":" + paddingString + s)
    }


    // Update on Time Range Radio Selection
    function updateTimeRange(selection) {
        setTimeRange(selection)

        switch(selection) {
            case '1':
                setActiveArtists(topArtistsAll)
                setActiveTracks(topTracksAll)
                break
            case '2':
                setActiveArtists(topArtists6M)
                setActiveTracks(topTracks6M)
                break
            case '3':
                setActiveArtists(topArtists1M)
                setActiveTracks(topTracks1M)
                break
            default:
                return
        }
    }


    // Time Range Radio Selection
    function SelectTimeRange() {
        const radios = [
          { name: 'All-Time', value: '1' },
          { name: 'Last 6 Months', value: '2' },
          { name: 'Last Month', value: '3' },
        ]
      
        return (
            <ButtonGroup toggle>
                {radios.map((radio, idx) => (
                    <ToggleButton
                        className="radio-button"
                        key={idx}
                        type="radio"
                        variant="outline-success"
                        name="radio"
                        value={radio.value}
                        checked={timeRange === radio.value}
                        onChange={(e) => updateTimeRange(e.currentTarget.value)}
                    >
                        {radio.name}
                    </ToggleButton>
                ))}
            </ButtonGroup>
        )
    }


    // Stat Type Radio Selection
    function SelectStatType() {
        const radios = [
          { name: 'Artists', value: '1' },
          { name: 'Tracks', value: '2' },
        ]
      
        return (
            <ButtonGroup toggle>
                {radios.map((radio, idx) => (
                    <ToggleButton
                        className="radio-button"
                        key={idx}
                        type="radio"
                        variant="outline-success"
                        name="radio"
                        value={radio.value}
                        checked={statType === radio.value}
                        onChange={(e) => setStatType(e.currentTarget.value)}
                    >
                        {radio.name}
                    </ToggleButton>
                ))}
            </ButtonGroup>
        )
    }


    return (
        <div>
            { !activeArtists ? <Spinner animation="border" role="status"></Spinner> : 
            <Container className="main">
                <Container className="user-info">
                    <Row>
                        <Col md="auto">
                            <a href={userURL} title="View on Spotify" target="_blank">
                                <Image className="user-image" src={userImage} roundedCircle />
                            </a>
                        </Col>
                        <Col className="user-name">
                            <p>{userName}'s deck.</p>
                        </Col>
                        <Col xs lg="2">
                            {/* logo */}
                        </Col>
                    </Row>
                </Container>
                <Container className="lines">
                    <div className="line" style={{ backgroundColor: 'black' }}></div>
                    <div className="line" style={{ backgroundColor: '#1DB954' }}></div>
                    <div className="line" style={{ backgroundColor: 'black' }}></div>
                </Container>
                <Container className="radio-container">
                    <SelectStatType />
                    <SelectTimeRange />
                </Container>
                <Container className="list-container">
                    {   statType === '1' ?
                            activeArtists ? <ArtistList /> : <Spinner animation="border" role="status"></Spinner> :
                            activeTracks ? <TrackList /> : <Spinner animation="border" role="status"></Spinner>
                    }
                </Container>
            </Container>
            }
        </div>
    )
}
