import React, { Fragment } from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import Badge from 'react-bootstrap/Badge';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import FloatingLabel from 'react-bootstrap/FloatingLabel'
import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";

function PrisonerList() {
    const [workers, setWorkers] = React.useState([]);
    React.useEffect(() => {
        getQueryRes('SELECT * FROM pracownicy;',setWorkers);
    }, []);
    
    function getQueryRes(cmd,fun) {
        fetch('/query/'+cmd)
        .then(response => { return response.json(); })
        .then(data => { fun(data); });
    }

    const newdata=workers.map((workers) =>{
      return (
        <ListGroup.Item as="li" className="d-flex justify-contqent-between align-items-start">
            <div className="ms-2 me-auto">
                <Link to={"/profilPracownika:"+workers.id_pracownika}><div className="fw-bold">{workers.imie+" "+workers.nazwisko}</div></Link>
                PESEL: {workers.pesel}
            </div>
            <Badge bg="primary" pill>{workers.plec}</Badge>
        </ListGroup.Item> 
      )
    })

    const onFormSubmit = e => {
        e.preventDefault()
        const formData = new FormData(e.target);
        const id=formData.get("id");
        const name=formData.get("name");
        const surname=formData.get("surname");
        const pesel=formData.get("pesel");

        var query;
        if(!id && !name && !surname && !pesel) query="SELECT * FROM pracownicy;";
        else {
            query="SELECT * FROM pracownicy WHERE ";
            if(id) query=query+"id_pracownika='"+id+"' ";
            if(name) {
                if(id) query=query+"AND ";
                query=query+"UPPER(imie)=UPPER('"+name+"') ";
            }
            if(surname) {
                if(id || name) query=query+"AND ";
                query=query+"UPPER(nazwisko)=UPPER('"+surname+"') ";
            } 
            if(pesel) {
                if(id || name || surname) query=query+"AND ";
                query=query+"pesel='"+pesel+"' ";
            }
            query=query+";";
        }
        
        getQueryRes(query,setWorkers);
      }

    return (
        <Fragment>
            <Container fluid>
                <Row className="justify-content-md-center pt pb"><Col lg={8}>
                    <Card>
                        <Card.Body>
                            <Card.Title>Wyszukaj pracownika</Card.Title>
                            <Card.Subtitle className="text-muted pb">Psst... możesz wpisać które chcesz</Card.Subtitle>
                            <Form onSubmit={onFormSubmit}>
                                <Form.Group>
                                    <FloatingLabel className="mb-3" label="ID pracownika">
                                        <Form.Control name="id" placeholder="ID pracownika"></Form.Control>
                                    </FloatingLabel>
                                </Form.Group>
                                <Row className="mb-3">
                                    <Form.Group as={Col} controlId="name">
                                        <FloatingLabel className="mb-3" label="Imię pracownika">
                                            <Form.Control name="name" placeholder="Imię pracownika"></Form.Control>
                                        </FloatingLabel>
                                    </Form.Group>
                                    <Form.Group as={Col} controlId="surname">
                                        <FloatingLabel className="mb-3" label="Nazwisko pracownika">
                                            <Form.Control name="surname" placeholder="Nazwisko pracownika"></Form.Control>
                                        </FloatingLabel>
                                    </Form.Group>
                                </Row>
                                <Form.Group controlId="pesel">
                                    <FloatingLabel className="mb-3" label="PESEL pracownika">
                                        <Form.Control name="pesel" placeholder="PESEL pracownika"></Form.Control>
                                    </FloatingLabel>
                                </Form.Group>
                                <Row>
                                    <Col>
                                        <div className="d-grid gap-2 pt">
                                            <Button variant="primary" type="submit" size="lg">Szukaj</Button>
                                        </div>
                                    </Col>
                                    <Col>
                                        <Link to="/kreatorPracownikow">
                                            <div className="d-grid gap-2 pt">
                                                <Button variant="secondary" type="null" size="lg">Dodaj Pracownika</Button>
                                            </div>
                                        </Link>
                                    </Col>
                                </Row>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col></Row>
            </Container>
            <Container fluid>
                <Row className="justify-content-md-center">
                    <Col lg={8}>
                        <ListGroup as="ol" className="pt pb">{newdata}</ListGroup>
                    </Col>
                </Row>
            </Container>
        </Fragment>
    );
}

export default PrisonerList;