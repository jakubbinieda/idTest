import React, { Fragment } from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import Badge from 'react-bootstrap/Badge';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import FloatingLabel from 'react-bootstrap/FloatingLabel'
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";


function PrisonerCreatorPage() {
    const [error, setError] = React.useState(null);
    const [msg, setMsg] = React.useState(null);

    const onFormSubmit = e => {
        e.preventDefault();
        var formData = new FormData(e.target);
        var name=formData.get("name");
        var surname=formData.get("surname");
        var pesel=formData.get("pesel");
        var birth=formData.get("birth");
        var gender=formData.get("gender");
        if(gender=='Mężczyzna') gender='M';
        else if(gender=='Kobieta') gender='K';
        var start=formData.get("start");
        var position=formData.get("position");
        var bossId=formData.get("bossId");

        var query
        if(bossId!='') query="/query/SELECT * FROM dodaj_pracownika('"+name+"','"+surname+"','"+pesel+"','"+gender+"','"+birth+"','"+start+"','"+bossId+"','"+position+"');";
        else query=query="/query/SELECT * FROM dodaj_pracownika('"+name+"','"+surname+"','"+pesel+"','"+gender+"','"+birth+"','"+start+"',NULL,'"+position+"');";
        var status;
        fetch(query)
        .then(res => {
            status=res.status;
            return res.json(); 
        }).then(data => { 
            if(status==500) setError(data.error);
            else setMsg("Update was successful!");
        });
    }

    function FailedQuery() {
        if(error) {
            return (
                <Alert key="danger" variant="danger">{error}</Alert>
            );
        }
    }

    function SuccessfulQuery() {
        if(msg) {
            return (
                <Alert key="success" variant="success">{msg}</Alert>
            );
        }
    }

    return (
        <Fragment>
            <FailedQuery/>
            <SuccessfulQuery/>
            <Row className="justify-content-md-center pt pb"><Col lg={8}>
                <Card>
                    <Card.Body>
                        <Card.Title>Dodaj pracownika</Card.Title>
                        <Card.Subtitle className="text-muted pb">Witamy w zespole! 🥳</Card.Subtitle>
                        <Form onSubmit={onFormSubmit}>
                            <Row className="mb-3">
                                <Form.Group as={Col} controlId="name">
                                    <FloatingLabel className="mb-3" label="Imię pracownika">
                                        <Form.Control name="name" placeholder="Imię więźnia"></Form.Control>
                                    </FloatingLabel>
                                </Form.Group>
                                <Form.Group as={Col} controlId="surname">
                                    <FloatingLabel className="mb-3" label="Nazwisko pracownika">
                                        <Form.Control name="surname" placeholder="Nazwisko pracownika"></Form.Control>
                                    </FloatingLabel>
                                </Form.Group>
                            </Row>
                            <Row>
                                <Form.Group as={Col} controlId="pesel">
                                    <FloatingLabel className="mb-3" label="PESEL pracownika">
                                        <Form.Control name="pesel" placeholder="PESEL pracownika"></Form.Control>
                                    </FloatingLabel>
                                </Form.Group>
                                <Form.Group as={Col} controlId="gender">
                                    <FloatingLabel className="mb-3" label="Płeć pracownika">
                                        <Form.Control name="gender" placeholder="Płeć pracownika"></Form.Control>
                                    </FloatingLabel>
                                </Form.Group>
                                <Form.Group as={Col} controlId="birth">
                                    <FloatingLabel className="mb-3" label="Data urodzenia pracownika">
                                        <Form.Control name="birth" placeholder="Data urodzenia pracownika"></Form.Control>
                                    </FloatingLabel>
                                </Form.Group>
                            </Row>
                            <Row>
                                <Form.Group as={Col} controlId="start">
                                    <FloatingLabel className="mb-3" label="Data rozpoczęcia pracy pracownika">
                                        <Form.Control name="start" placeholder="Data rozpoczęcia pracy pracownika"></Form.Control>
                                    </FloatingLabel>
                                </Form.Group>
                                <Form.Group as={Col} controlId="position">
                                    <FloatingLabel className="mb-3" label="ID stanowiska pracownika">
                                        <Form.Control name="position" placeholder="ID stanowiska pracownika"></Form.Control>
                                    </FloatingLabel>
                                </Form.Group>
                                <Form.Group as={Col} controlId="bossId">
                                    <FloatingLabel className="mb-3" label="ID przełożonego pracownika">
                                        <Form.Control name="bossId" placeholder="ID przełożonego pracownika"></Form.Control>
                                    </FloatingLabel>
                                </Form.Group>
                            </Row>
                            <Row>
                                <Col>
                                    <div className="d-grid gap-2 pt">
                                        <Button variant="success" type="submit" size="lg">Dodaj</Button>
                                    </div>
                                </Col>
                                <Col>
                                    <div className="d-grid gap-2 pt">
                                        <Button variant="danger" type="reset" size="lg">Anuluj</Button>
                                    </div>
                                </Col>
                            </Row>
                        </Form>
                    </Card.Body>
                </Card>
            </Col></Row>
        </Fragment>
    );
}

export default PrisonerCreatorPage;