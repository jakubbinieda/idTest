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
import Alert from "react-bootstrap/Alert";
import { Link } from "react-router-dom";

function PrisonerList() {
    const [prisoners, setPrisoners] = React.useState([]);
    const [error, setError] = React.useState(null);
    React.useEffect(() => {
        getQueryRes('SELECT * FROM wiezniowie;',setPrisoners);
    }, []);
    
    function getQueryRes(cmd,fun) {
        var status;
        fetch('/query/'+cmd)
        .then(response => { 
            status=response.status;
            return response.json(); 
        })
        .then(data => { 
            if(status==500) setError(data.error);
            else fun(data); 
        });
    }

    const newdata=prisoners.map((prisoners) =>{
      return (
        <ListGroup.Item as="li" className="d-flex justify-contqent-between align-items-start">
            <div className="ms-2 me-auto">
                <Link to={"/profilWieznia:"+prisoners.id_wieznia}><div className="fw-bold">{prisoners.imie+" "+prisoners.nazwisko}</div></Link>
                PESEL: {prisoners.pesel}
            </div>
            <Badge bg="primary" pill>{prisoners.plec}</Badge>
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
        const gang_id=formData.get("gang_id");
        const start=formData.get("start");
        const end=formData.get("end");

        var query;
        if(!id && !name && !surname && !pesel && !gang_id && !start  && !end) query="SELECT * FROM wiezniowie;";
        else {
            query="SELECT * FROM wiezniowie LEFT OUTER JOIN wiezniowie_gangi USING(id_wieznia) LEFT OUTER JOIN historia_wiezniowie USING(id_wieznia) WHERE ";
            if(id) query=query+"id_wieznia='"+id+"' ";
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
            if(gang_id) {
                if(id || name || surname || pesel) query=query+"AND ";
                query=query+"id_gangu='"+gang_id+"' ";
            }
            if(start) {
                if(id || name || surname || pesel || gang_id) query=query+"AND ";
                query=query+"data_rozpoczecia='"+start+"' ";
            }
            if(end) {
                if(id || name || surname || pesel || gang_id || start) query=query+"AND ";
                query=query+"data_rozpoczecia='"+end+"' ";
            }
            query=query+";";
        }
        
        getQueryRes(query,setPrisoners);
      }

    function FailedQuery() {
        if(error) {
            return (
                <Alert key="danger" variant="danger">{error}</Alert>
            );
        }
    }

    return (
        <Fragment>
            <FailedQuery/>
            <Container fluid>
                <Row className="justify-content-md-center pt pb"><Col lg={8}>
                    <Card>
                        <Card.Body>
                            <Card.Title>Wyszukaj więźnia</Card.Title>
                            <Card.Subtitle className="text-muted pb">Psst... możesz wpisać które chcesz</Card.Subtitle>
                            <Form onSubmit={onFormSubmit}>
                                <Form.Group>
                                    <FloatingLabel className="mb-3" label="ID więźnia">
                                        <Form.Control name="id" placeholder="ID więźnia"></Form.Control>
                                    </FloatingLabel>
                                </Form.Group>
                                <Row className="mb-3">
                                    <Form.Group as={Col} controlId="name">
                                        <FloatingLabel className="mb-3" label="Imię więźnia">
                                            <Form.Control name="name" placeholder="Imię więźnia"></Form.Control>
                                        </FloatingLabel>
                                    </Form.Group>
                                    <Form.Group as={Col} controlId="surname">
                                        <FloatingLabel className="mb-3" label="Nazwisko więźnia">
                                            <Form.Control name="surname" placeholder="Nazwisko więźnia"></Form.Control>
                                        </FloatingLabel>
                                    </Form.Group>
                                </Row>
                                <Row>
                                    <Form.Group as={Col} controlId="pesel">
                                        <FloatingLabel className="mb-3" label="PESEL więźnia">
                                            <Form.Control name="pesel" placeholder="PESEL więźnia"></Form.Control>
                                        </FloatingLabel>
                                    </Form.Group>
                                    <Form.Group as={Col} controlId="gang_id">
                                        <FloatingLabel className="mb-3" label="ID gangu więźnia">
                                            <Form.Control name="gang_id" placeholder="ID gangu więźnia"></Form.Control>
                                        </FloatingLabel>
                                    </Form.Group>
                                </Row>
                                <Row>
                                    <Form.Group as={Col} controlId="start">
                                        <FloatingLabel className="mb-3" label="Data przyjęcia więźnia">
                                            <Form.Control name="start" placeholder="Data przyjęcia więźnia"></Form.Control>
                                        </FloatingLabel>
                                    </Form.Group>
                                    <Form.Group as={Col} controlId="end">
                                        <FloatingLabel className="mb-3" label="Data wypuszczenia więźnia">
                                            <Form.Control name="end" placeholder="Data wypuszczenia więźnia"></Form.Control>
                                        </FloatingLabel>
                                    </Form.Group>
                                </Row>
                                <Row>
                                    <Col>
                                        <div className="d-grid gap-2 pt">
                                            <Button variant="primary" type="submit" size="lg">Szukaj</Button>
                                        </div>
                                    </Col>
                                    <Col>
                                        <Link to="/kreatorWiezniow">
                                            <div className="d-grid gap-2 pt">
                                                <Button variant="secondary" type="null" size="lg">Dodaj Więźnia</Button>
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