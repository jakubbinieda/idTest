import React, { Fragment } from 'react';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import FloatingLabel from 'react-bootstrap/FloatingLabel'
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert"

function MD() {
    const [data, setData] = React.useState([]);
    const [error, setError] = React.useState(null);

    const onFormSubmit = e => {
        e.preventDefault()
        var formData = new FormData(e.target);
        var status;
        fetch('/query/'+formData.get("query"))
        .then(response => { 
            status=response.status;
            //
            if(status==500) setError(data.error);
            return response.json(); 
        }).then(data => {
            setData(data);
        })
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
                            <Card.Title>Uruchom własne zapytanie</Card.Title>
                            <Card.Subtitle className="text-muted pb">Uwaga, jest to bardzo niebezpieczne </Card.Subtitle>
                            <Form onSubmit={onFormSubmit}>
                                <Form.Group>
                                    <FloatingLabel className="mb-3" label="Zapytanie">
                                        <Form.Control name="query" placeholder="Zapytanie"></Form.Control>
                                    </FloatingLabel>
                                </Form.Group>
                                <Row>
                                    <Col>
                                        <div className="d-grid gap-2 pt">
                                            <Button variant="primary" type="submit" size="lg">Uruchom</Button>
                                        </div>
                                    </Col>
                                </Row>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col></Row>
                <Row className="justify-content-md-center pt pb"><Col lg={8}>
                    <Card>
                        <Card.Body>
                            <Card.Title>Wynik pojawi się tutaj</Card.Title>
                            {data.map((entry)=>{return JSON.stringify(entry)})}
                        </Card.Body>
                    </Card>
                </Col></Row>
            </Container>
        </Fragment>
    );
}

export default MD;