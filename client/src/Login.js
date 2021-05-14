import React from 'react'
import { Container, Button } from 'react-bootstrap'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpotify } from '@fortawesome/free-brands-svg-icons'

const AUTH_URL = "https://accounts.spotify.com/authorize?client_id=e10bba1aea88476d8577408b7abffcb2&response_type=code&redirect_uri=http://localhost:3000&scope=streaming%20user-read-email%20user-read-private%20user-top-read%20user-read-playback-state%20user-modify-playback-state"

export default function Login() {
    return (
        <Container className="d-flex justify-content-center align-items-center">
            <Button variant="success" size="lg" href={AUTH_URL}>
                LOGIN WITH <strong>SPOTIFY</strong>
                <FontAwesomeIcon icon={faSpotify} style={{ marginLeft: "0.5em" }}/>
            </Button>
        </Container>
    )
}
