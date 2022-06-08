import React, { Fragment, Component } from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav'
import { Link } from "react-router-dom";

export default class Header extends Component {
    render() {
        return (
            <Fragment>
                <Navbar bg="dark" variant="dark" expand="lg">
                    <Container fluid>
                        <Navbar.Brand>TCS</Navbar.Brand>
                        <Navbar.Toggle aria-controls="responsive-navbar-nav"/>
                        <Navbar.Collapse id="responsive-navbar-nav">
                            <Nav className="me-auto"> 
                                <Link to="/"><Nav.Link href="/">Strona Główna</Nav.Link></Link>
                                <Link to="/wiezniowie"><Nav.Link href="/wiezniowie">Więźniowie</Nav.Link></Link>
                                <Link to="/pracownicy"><Nav.Link href="/pracownicy">Pracownicy</Nav.Link></Link>
                                <Link to="/gangi"><Nav.Link href="/gangi">Gangi</Nav.Link></Link>
                                <Link to="/zaawansowane"><Nav.Link href="/zaawansowane">Zaawansowane</Nav.Link></Link>
                                {/*<Link to="/opis"><Nav.Link href="/opis">O projekcie</Nav.Link></Link>*/}
                            </Nav>
                        </Navbar.Collapse>
                    </Container>
                </Navbar>
            </Fragment>
        )
    }
}