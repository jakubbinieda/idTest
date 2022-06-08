import React, { Fragment } from 'react';
import { useParams } from "react-router-dom";
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import FloatingLabel from 'react-bootstrap/FloatingLabel'
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert"
import ListGroup from 'react-bootstrap/ListGroup'
import Badge from 'react-bootstrap/Badge'

function GangProfilePage() {
    let { id } = useParams();
    id=id.substring(1);

    const [gang, setGang] = React.useState([]);
    const [error, setError] = React.useState(null);
    const [bosses, setBosses] = React.useState([]);
    const [relations, setRelations] = React.useState([]);
    const [msg, setMsg] = React.useState(null);
    React.useEffect(() => {
        getQueryRes("SELECT * FROM gangi WHERE id_gangu="+id+";",setGang);
        getQueryRes("SELECT * FROM liderzy_gangu("+id+");",setBosses);
        getQueryRes("SELECT relacje_gangi.*,ga1.nazwa AS nazwa1,ga2.nazwa AS nazwa2 FROM relacje_gangi JOIN gangi AS ga1 ON ga1.id_gangu=id_gangu_1 JOIN gangi AS ga2 ON ga2.id_gangu=id_gangu_2 WHERE id_gangu_1="+id+" OR id_gangu_2="+id+";",setRelations);
    }, []);
    
    function getQueryRes(cmd,fun) {
        var status;
        fetch('/query/'+cmd)
        .then(response => { 
            status=response.status;
            return response.json(); 
        }).then(data => { 
            if(status==500) setError(data.error);
            else fun(data); 
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

    const removeBoss = e => {
        e.preventDefault();
        var formData = new FormData(e.target);
        var currId=formData.get("id");
        currId=currId.substring(0,currId.indexOf(' '));

        var status;
        fetch("/query/UPDATE historia_liderow SET data_zakonczenia=NOW() WHERE data_zakonczenia IS NULL AND id_gangu="+id+" AND id_wieznia="+currId+";")
        .then(res => {
            status=res.status;
            return res.json(); 
        }).then(data => { 
            if(status==500) setError(data.error);
            else setMsg("Update was successful!");
        });
    }

    const onFormSubmit = e => {
        e.preventDefault();
        var formData = new FormData(e.target);
        var id_gangu=formData.get("id");
        var name=formData.get("name");
        var sign=formData.get("sign");

        gang.map((gang) => {
            var query='/query/UPDATE gangi SET';
            if(id_gangu!=gang.id_gangu) query=query+' id_gangu='+id_gangu;
            if(name!=gang.nazwa) {
                if(id_gangu!=gang.id_gangu) query=query+", nazwa='"+name+"'";
                else query=query+" nazwa='"+name+"'";
            }
            if(sign!=gang.znak_rozpoznawczy) {
                if(id_gangu!=gang.id_gangu || name!=gang.nazwa) query=query+", znak_rozpoznawczy='"+sign+"'";
                else query=query+" znak_rozpoznawczy='"+sign+"'";
            }

            if(id_gangu!=gang.id_gangu || name!=gang.nazwa || sign!=gang.znak_rozpoznawczy) {
                var status;
                fetch(query+' WHERE id_gangu='+gang.id_gangu+';')
                .then(res => {
                    status=res.status;
                    return res.json(); 
                }).then(data => { 
                    if(status==500) setError(data.error);
                    else setMsg("Update was successful!");
                });
            }
        });
    }

    const onFormSubmit2 = e => {
        e.preventDefault();
        var formData = new FormData(e.target);
        var idCurr=formData.get("id");

        var query="/query/INSERT INTO historia_liderow VALUES("+id+","+idCurr+",NOW(),"+"NULL);";

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

    const onFormSubmit3 = e => {
        e.preventDefault();
        var formData = new FormData(e.target);
        var idCurr=formData.get("id");
        var type=formData.get("type")

        var query="/query/INSERT INTO relacje_gangi VALUES("+id+","+idCurr+",'"+type+"');";

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

    const bossesData=bosses.map((boss)=>{
        return (
            <ListGroup.Item as="li" className="d-flex justify-content-between align-items-start">
            <div className="ms-2 me-auto">
                <div>{boss.inf}</div>
            </div>
            <Form onSubmit={removeBoss}>
                <Form.Group className="notVisible" controlId="id">
                    <Form.Control name="id" defaultValue={boss.inf}></Form.Control>
                </Form.Group>
                <Button variant="danger" type="submit" size="sm">Usuń lidera</Button>
            </Form>
        </ListGroup.Item>
        )
    })

    const relationsData=relations.map((relation)=>{
        return (
            <ListGroup.Item as="li" className="d-flex justify-content-between align-items-start">
            <div className="ms-2 me-auto">
                <div className="fw-bold">{relation.typ_relacji=='N'?'Negatywne':'Pozytywne'} relacje</div>
                Pomiędzy {relation.nazwa1} i {relation.nazwa2}
            </div>
        </ListGroup.Item>
        )
    })

    const newdata=gang.map((gang)=>{
        return (
            <Container fluid>
                <Row className="justify-content-md-center pt pb"><Col lg={8}>
                    <Card className='pb'>
                        <Card.Body>
                            <Card.Title className="text-center">Gang numer {gang.id_gangu}</Card.Title>
                            <Form onSubmit={onFormSubmit}>
                                <Row className="mb-3">
                                    <Form.Group as={Col} controlId="id">
                                        <FloatingLabel className="mb-3" label="ID gangu">
                                            <Form.Control name="id" defaultValue={gang.id_gangu}></Form.Control>
                                        </FloatingLabel>
                                    </Form.Group>
                                    <Form.Group as={Col} controlId="name">
                                        <FloatingLabel className="mb-3" label="Nazwa gangu">
                                            <Form.Control name="name" defaultValue={gang.nazwa}></Form.Control>
                                        </FloatingLabel>
                                    </Form.Group>
                                    <Form.Group as={Col} controlId="sign">
                                        <FloatingLabel className="mb-3" label="Znak rozpoznawczy gangu">
                                            <Form.Control name="sign" defaultValue={gang.znak_rozpoznawczy}></Form.Control>
                                        </FloatingLabel>
                                    </Form.Group>
                                </Row>
                                <Row>
                                    <Col>
                                        <div className="d-grid gap-2 pt">
                                            <Button variant="success" type="submit" size="lg">Zapisz</Button>
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
                <Row className="justify-content-md-center pt pb"><Col lg={8}>
                    <Card>
                        <Card.Body>
                            <Card.Title className="text-center">Liderzy gangu numer {gang.id_gangu}</Card.Title>
                            <ListGroup as="ol" numbered>
                                {bossesData}
                            </ListGroup>
                        </Card.Body>
                    </Card>
                </Col></Row>
                <Row className="justify-content-md-center pt pb"><Col lg={8}>
                    <Card>
                        <Card.Body>
                            <Card.Title className="text-center">Relacje gangu numer {gang.id_gangu}</Card.Title>
                            <ListGroup as="ol" numbered>
                                {relationsData}
                            </ListGroup>
                        </Card.Body>
                    </Card>
                </Col></Row>
                <Row className="justify-content-md-center pt pb"><Col lg={8}>
                    <Row className="match-height">
                        <Col lg={6}>
                            <Card>
                                <Card.Body>
                                    <Card.Title>Dodaj lidera</Card.Title>
                                    <Form onSubmit={onFormSubmit2}>
                                        <Row className="mb-3">
                                            <Form.Group as={Col} controlId="id">
                                                <FloatingLabel className="mb-3" label="ID więźnia">
                                                    <Form.Control name="id" placeholder="ID więźnia"></Form.Control>
                                                </FloatingLabel>
                                            </Form.Group>
                                        </Row>
                                        <Row>
                                            <Col>
                                                <div className="d-grid gap-2 pt">
                                                    <Button variant="primary" type="submit" size="lg">Dodaj</Button>
                                                </div>
                                            </Col>
                                        </Row>
                                    </Form>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col lg={6}>
                            <Card>
                                <Card.Body>
                                    <Card.Title>Dodaj relacje</Card.Title>
                                    <Form onSubmit={onFormSubmit3}>
                                        <Row className="mb-3">
                                            <Form.Group as={Col} controlId="id">
                                                <FloatingLabel className="mb-3" label="ID gangu">
                                                    <Form.Control name="id" placeholder="ID gangu"></Form.Control>
                                                </FloatingLabel>
                                            </Form.Group>
                                            <Form.Group as={Col} controlId="type">
                                                <FloatingLabel className="mb-3" label="Typ relacji">
                                                    <Form.Control name="type" placeholder="Typ relacji"></Form.Control>
                                                </FloatingLabel>
                                            </Form.Group>
                                        </Row>
                                        <Row>
                                            <Col>
                                                <div className="d-grid gap-2 pt">
                                                    <Button variant="primary" type="submit" size="lg">Dodaj</Button>
                                                </div>
                                            </Col>
                                        </Row>
                                    </Form>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Col></Row>
            </Container>
        )
    })
    return (
        <Fragment>
            <FailedQuery/>
            <SuccessfulQuery/>
            {newdata}
        </Fragment>
    );
}

export default GangProfilePage;