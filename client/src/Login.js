import React from 'react'
import { Container, Button, Row } from 'react-bootstrap'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpotify } from '@fortawesome/free-brands-svg-icons'

import './loginStyles.css'

let redirect_uri = ''

if (process.env.NODE_ENV !== 'production') {
    redirect_uri = process.env.REACT_APP_DEV_URI
} else {
    redirect_uri = process.env.REACT_APP_PROD_URI
}

const AUTH_URL = "https://accounts.spotify.com/authorize?client_id=e10bba1aea88476d8577408b7abffcb2&response_type=code&redirect_uri=" + redirect_uri + "&scope=user-read-email%20user-read-private%20user-top-read"


export default function Login() {
    return (
        <Container className="main">
            <Row>
                <h1 className="title">Spotify Decks.</h1>
            </Row>
            <Row>
                <p className="subtitle">A unique visualization of your favorite Spotify artists and tracks.</p>
            </Row>
            <Row>
                <Button variant="success" size="lg" href={AUTH_URL}>
                    LOGIN WITH <strong>SPOTIFY</strong>
                    <FontAwesomeIcon icon={faSpotify} style={{ marginLeft: "0.5em" }}/>
                </Button>
            </Row>
        </Container>
    )
}
