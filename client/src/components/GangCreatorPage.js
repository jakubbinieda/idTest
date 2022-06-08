import React, { Fragment } from 'react';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import FloatingLabel from 'react-bootstrap/FloatingLabel'
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";


function GangCreatorPage() {
    const [error, setError] = React.useState(null);
    const [msg, setMsg] = React.useState(null);

    const onFormSubmit = e => {
        e.preventDefault();
        var formData = new FormData(e.target);
        var name=formData.get("name");
        var sign=formData.get("sign");

        var query="/query/INSERT INTO gangi(nazwa,znak_rozpoznawczy) VALUES('"+name+"','"+sign+"');";
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
                        <Card.Title>Dodaj gang</Card.Title>
                        <Card.Subtitle className="text-muted pb">I have a bad feeling about this</Card.Subtitle>
                        <Form onSubmit={onFormSubmit}>
                            <Row className="mb-3">
                                <Form.Group as={Col} controlId="name">
                                    <FloatingLabel className="mb-3" label="Nazwa gangu">
                                        <Form.Control name="name" placeholder="Nazwa gangu"></Form.Control>
                                    </FloatingLabel>
                                </Form.Group>
                                <Form.Group as={Col} controlId="sign">
                                    <FloatingLabel className="mb-3" label="Znak rozpoznawczy gangu">
                                        <Form.Control name="sign" placeholder="Znak rozpoznawczy gangu"></Form.Control>
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

export default GangCreatorPage;