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
    const [gangs, setGangs] = React.useState([]);
    const [error, setError] = React.useState(null);
    React.useEffect(() => {
        getQueryRes('SELECT * FROM gangi;',setGangs);
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

    const newdata=gangs.map((gangs) =>{
      return (
        <ListGroup.Item as="li" className="d-flex justify-contqent-between align-items-start">
            <div className="ms-2 me-auto">
                <Link to={"/profilGangu:"+gangs.id_gangu}><div className="fw-bold">{gangs.nazwa}</div></Link>
                Znak rozpoznawczy: {gangs.znak_rozpoznawczy}
            </div>
            <Badge bg="primary" pill>{gangs.id_gangu}</Badge>
        </ListGroup.Item> 
      )
    })

    const onFormSubmit = e => {
        e.preventDefault()
        const formData = new FormData(e.target);
        const id=formData.get("id");
        const name=formData.get("name");
        const sign=formData.get("sign");

        var query;
        if(!id && !name && !sign) query="SELECT * FROM gangi;";
        else {
            query="SELECT * FROM gangi WHERE ";
            if(id) query=query+"id_gangu='"+id+"' ";
            if(name) {
                if(id) query=query+"AND ";
                query=query+"UPPER(nazwa)=UPPER('"+name+"') ";
            }
            if(sign) {
                if(id || name) query=query+"AND ";
                //query=query+"UPPER(znak_rozpoznawczy) LIKE UPPER('\%"+sign+"\%')";
                query=query+"UPPER(znak_rozpoznawczy)=UPPER('"+sign+"')";
            } 
            
            query=query+";";
        }
        
        getQueryRes(query,setGangs);
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
                            <Card.Title>Wyszukaj gang</Card.Title>
                            <Card.Subtitle className="text-muted pb">Psst... możesz wpisać które chcesz</Card.Subtitle>
                            <Form onSubmit={onFormSubmit}>
                                <Form.Group>
                                    <FloatingLabel className="mb-3" label="ID Gangu">
                                        <Form.Control name="id" placeholder="ID Gangu"></Form.Control>
                                    </FloatingLabel>
                                </Form.Group>
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
                                            <Button variant="primary" type="submit" size="lg">Szukaj</Button>
                                        </div>
                                    </Col>
                                    <Col>
                                        <Link to="/kreatorGangow">
                                            <div className="d-grid gap-2 pt">
                                                <Button variant="secondary" type="null" size="lg">Dodaj Gang</Button>
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