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

function PrisonerProfilePage() {
    let { id } = useParams();
    id=id.substring(1);

    const [prisoner, setPrisoner] = React.useState([]);
    const [error, setError] = React.useState(null);
    const [msg, setMsg] = React.useState(null);
    const [history, setHistory] = React.useState([])
    const [prisHistory, setPrisonerHistory] = React.useState([])
    React.useEffect(() => {
        getQueryRes("SELECT * FROM wiezien_info("+id+");",setPrisoner);
        getQueryRes("SELECT wiezniowie_wyroki.*,historia_wyroku.*,CAST(historia_wyroku.dlugosc_wyroku AS TEXT) AS dlugosc_wyroku_text FROM historia_wyroku JOIN wiezniowie_wyroki USING(id_wyroku) WHERE id_wieznia="+id+";",setHistory);
        getQueryRes("SELECT * FROM his_of_wiezien("+id+");",setPrisonerHistory);
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

    const onFormSubmit = e => {
        e.preventDefault();
        var formData = new FormData(e.target);
        var id=formData.get("id");
        var name=formData.get("name");
        var surname=formData.get("surname");
        var pesel=formData.get("pesel");
        var birth=formData.get("birth");
        var gender=formData.get("gender");
        if(gender=='Mężczyzna') gender='M';
        else if(gender=='Kobieta') gender='K';
        var cellNum=formData.get("cellNum");
        var incelFrom=formData.get("incelFrom");
        var incelTo=formData.get("incelTo");

        prisoner.map((prisoner) => {
            var success=true;
            var query='/query/UPDATE wiezniowie SET';
            if(id!=prisoner.id_wieznia) query=query+' id_wieznia='+id;
            if(name!=prisoner.imie) {
                if(id!=prisoner.id_wieznia) query=query+", imie='"+name+"'";
                else query=query+" imie='"+name+"'";
            }
            if(surname!=prisoner.nazwisko) {
                if(id!=prisoner.id_wieznia || name!=prisoner.imie) query=query+", nazwisko='"+surname+"'";
                else query=query+" nazwisko='"+surname+"'";
            }
            if(pesel!=prisoner.pesel) {
                if(id!=prisoner.id_wieznia || name!=prisoner.imie || surname!=prisoner.nazwisko) query=query+", pesel='"+pesel+"'";
                else query=query+" pesel='"+pesel+"'";
            }
            if(birth!=prisoner.data_urodzenia.substring(0,10)) {
                if(id!=prisoner.id_wieznia || name!=prisoner.imie || surname!=prisoner.nazwisko || pesel!=prisoner.pesel) query=query+", data_urodzenia="+birth;
                else query=query+" data_urodzenia='"+birth+"'";
            }
            if(gender!=prisoner.plec) {
                if(id!=prisoner.id_wieznia || name!=prisoner.imie || surname!=prisoner.nazwisko || pesel!=prisoner.pesel || birth!=prisoner.data_urodzenia.substring(0,10)) query=query+", plec='"+gender+"'";
                else query=query+" plec='"+gender+"'";
            }
            
            if(id!=prisoner.id_wieznia || name!=prisoner.imie || surname!=prisoner.nazwisko || pesel!=prisoner.pesel || birth!=prisoner.data_urodzenia.substring(0,10) || gender!=prisoner.plec) {
                var status;
                fetch(query+' WHERE id_wieznia='+prisoner.id_wieznia+';')
                .then(res => {
                    status=res.status;
                    return res.json(); 
                }).then(data => { 
                    if(status==500) setError(data.error);
                    else setMsg("Update was successful!");
                });
            }

            if(success) {
                query='/query/UPDATE wiezniowie_cele SET'
                if(cellNum!=prisoner.nr_celi) {
                    query=query+" nr_celi="+cellNum;
                }
                if(incelFrom!=prisoner.data_przydzialu) {
                    if(cellNum!=prisoner.nr_celi) {
                        if(incelFrom=='TERAZ')query=query+', data_przydzialu=NOW()';
                        else query=query+", data_przydzialu='"+incelFrom+"'";
                    } else {
                        if(incelFrom=='TERAZ')query=query+' data_przydzialu=NOW()';
                        else query=query+" data_przydzialu='"+incelFrom+"'";
                    }
                } 
                if(incelTo!=prisoner.data_wyprowadzki) {
                    if(cellNum!=prisoner.nr_celi || incelFrom!=prisoner.data_przydzialu) {
                        if(incelTo=='') query=query+', data_wyprowadzki=NULL';
                        else if(incelTo=='TERAZ') query=query+', data_wyprowadzki=NOW()';
                        else query=query+", data_wyprowadzki='"+incelTo+"'";
                    } else {
                        if(incelTo=='') query=query+' data_wyprowadzki=NULL';
                        else if(incelTo=='TERAZ') query=query+' data_wyprowadzki=NOW()';
                        else query=query+" data_wyprowadzki='"+incelTo+"'";
                    }
                }

                if(cellNum!=prisoner.nr_celi || incelFrom!=prisoner.data_przydzialu || incelTo!=prisoner.data_wyprowadzki) {
                    var status;
                    fetch(query+' WHERE id_wieznia='+prisoner.id_wieznia+';')
                    .then(res => {
                        status=res.status;
                        return res.json(); 
                    }).then(data => { 
                        if(status==500) setError(data.error);
                        else setMsg("Update was successful!");
                    });
                }

                if(!success) msg=null;
            }
        })
    }

    const onFormSubmit2 = e => {
        e.preventDefault();
        var formData = new FormData(e.target);
        var type=formData.get("type");
        var blah=formData.get("blah");
        var weight=formData.get("weight");
        var query="/query/INSERT INTO sprawowanie VALUES('"+type+"',"+id+",NOW(),'"+blah+"',"+weight+");";
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
        var idZesp=formData.get("idZesp");
        var idPrac=formData.get("idPrac");
        var query="/query/INSERT INTO wiezniowie_prace VALUES("+id+","+idPrac+","+idZesp+");";
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

    const onFormSubmit4 = e => {
        e.preventDefault();
        var formData = new FormData(e.target);
        var why=formData.get("why");
        var query="/query/UPDATE historia_wiezniowie SET powod="+why+" WHERE id_wieznia="+id+" AND data_zakonczenia IS NULL;";
        var status;
        fetch(query)
        .then(res => {
            status=res.status;
            return res.json(); 
        }).then(data => { 
            if(status==500) setError(data.error);
            else {
                setMsg("Update was successful!");
                fetch("/query/SELECT * FROM wywal_wieznia("+id+",CAST(NOW() AS DATE) );");
            }
        });
    }

    const onFormSubmit5= e => {
        e.preventDefault();
        var formData = new FormData(e.target);
        var cellNum=formData.get("cellNum");
        var query="/query/SELECT * FROM zmien_cele("+id+","+cellNum+");";
        var status;
        fetch(query)
        .then(res => {
            status=res.status;
            return res.json(); 
        }).then(data => { 
            if(status==500) setError(data.error);
            else {
                setMsg("Update was successful!");
            }
        });
    }

    const onFormSubmit6= e => {
        e.preventDefault();
        var formData = new FormData(e.target);
        var gangId=formData.get("gangId");
        var query="/query/SELECT * FROM change_gang("+id+","+gangId+");";
        var status;
        fetch(query)
        .then(res => {
            status=res.status;
            return res.json(); 
        }).then(data => { 
            if(status==500) setError(data.error);
            else {
                setMsg("Update was successful!");
            }
        });
    }

    const onFormSubmit7= e => {
        e.preventDefault();
        var formData = new FormData(e.target);
        var date=formData.get("date");
        var length=formData.get("length");
        var blah=formData.get("blah");
        var query="/query/SELECT * FROM dodaj_wyrok_do_wieznia("+id+",'"+date+"','"+length+"','"+blah+"');";
        var status;
        fetch(query)
        .then(res => {
            status=res.status;
            return res.json(); 
        }).then(data => { 
            if(status==500) setError(data.error);
            else {
                setMsg("Update was successful!");
            }
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

    const sentenceHistory=history.map((entry) =>{
        return (
            <ListGroup.Item as="li" className="d-flex justify-content-between align-items-start">
                <div className="ms-2 me-auto">
                    <div className="fw-bold">Wyrok z dnia: {entry.data_skazania.substring(0,10)}</div>
                    {entry.opis}
                </div>
                <Badge bg="danger" pill>{entry.dlugosc_wyroku_text}</Badge>
            </ListGroup.Item>
        )
    })

    const prisonerHistory=prisHistory.map((entry) =>{
        return (
            <ListGroup.Item as="li" className="d-flex justify-content-between align-items-start">
                <div className="ms-2 me-auto">
                    <div className="fw-bold">{entry.data.substring(0,10)}</div>
                    {entry.opis}
                </div>
            </ListGroup.Item>
        )
    })

    const newdata=prisoner.map((prisoner) =>{
        return (
            <Container fluid>
                <Row className="justify-content-md-center pt pb"><Col lg={8}>
                    <Card className='pb'>
                        <Card.Body>
                            <Card.Title className="text-center">Więzień numer {prisoner.id_wieznia}</Card.Title>
                            <Form onSubmit={onFormSubmit}>
                                <Row className="mb-3">
                                    <Form.Group as={Col} controlId="name">
                                        <FloatingLabel className="mb-3" label="Imię więźnia">
                                            <Form.Control name="name" defaultValue={prisoner.imie}></Form.Control>
                                        </FloatingLabel>
                                    </Form.Group>
                                    <Form.Group as={Col} controlId="surname">
                                        <FloatingLabel className="mb-3" label="Nazwisko więźnia">
                                            <Form.Control name="surname" defaultValue={prisoner.nazwisko}></Form.Control>
                                        </FloatingLabel>
                                    </Form.Group>
                                </Row>
                                <Row className="mb-3">
                                    <Form.Group as={Col} controlId="pesel">
                                        <FloatingLabel className="mb-3" label="PESEL więźnia">
                                            <Form.Control name="pesel" defaultValue={prisoner.pesel}></Form.Control>
                                        </FloatingLabel>
                                    </Form.Group>
                                    <Form.Group as={Col} controlId="birth">
                                        <FloatingLabel className="mb-3" label="Data urodzenia więźnia">
                                            <Form.Control name="birth" defaultValue={prisoner.data_urodzenia.substring(0,10)}></Form.Control>
                                        </FloatingLabel>
                                    </Form.Group>
                                </Row>
                                <Row>
                                    <Form.Group as={Col} controlId="id">
                                        <FloatingLabel className="mb-3" label="ID więźnia">
                                            <Form.Control name="id" defaultValue={prisoner.id_wieznia}></Form.Control>
                                        </FloatingLabel>
                                    </Form.Group>
                                    <Form.Group as={Col} controlId="gender">
                                        <FloatingLabel className="mb-3" label="Płeć więźnia">
                                            <Form.Control name="gender" defaultValue={prisoner.plec=='M'?"Mężczyzna":"Kobieta"}></Form.Control>
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
                            <Card.Title className="text-center">O więźniu numer {prisoner.id_wieznia}</Card.Title>
                            <ListGroup as="ol" numbered>
                                <ListGroup.Item as="li">Członek gangu: {prisoner.nazwa_gangu}</ListGroup.Item>
                                <ListGroup.Item as="li">Pozytywne sprawowania: {prisoner.ilosc_dobrych_sprawowan}</ListGroup.Item>
                                <ListGroup.Item as="li">Negatywne sprawowania: {prisoner.ilosc_zlych_sprawowan}</ListGroup.Item>
                                <ListGroup.Item as="li">Brał udział w {prisoner.liczba_prac} pracach społecznych</ListGroup.Item>
                            </ListGroup>
                        </Card.Body>
                    </Card>
                </Col></Row>
                <Row className="justify-content-md-center pt pb"><Col lg={8}>
                    <Card>
                        <Card.Title className="text-center">Historia skazania</Card.Title>
                        <Card.Body>
                            <ListGroup as="ol" numbered>
                                {sentenceHistory}
                            </ListGroup>
                        </Card.Body>
                    </Card>
                </Col></Row>
                <Row className="justify-content-md-center pt pb"><Col lg={8}>
                    <Card>
                        <Card.Title className="text-center">Historia więźnia w placówce</Card.Title>
                        <Card.Body>
                            <ListGroup as="ol" numbered>
                                {prisonerHistory}
                            </ListGroup>
                        </Card.Body>
                    </Card>
                </Col></Row>
                <Row className="justify-content-md-center pt pb"><Col lg={8}>
                    <Row className="match-height">
                        <Col lg={6}>
                            <Card>
                                <Card.Body>
                                    <Card.Title>Zmień celę</Card.Title>
                                    <Card.Subtitle className="text-muted pb">Chwilowo więzień znajduje się w celi nr {prisoner.nr_celi} </Card.Subtitle>
                                    <Form onSubmit={onFormSubmit5}>
                                        <Row className="mb-3">
                                            <Form.Group as={Col} controlId="cellNum">
                                                <FloatingLabel className="mb-3" label="Numer nowej celi">
                                                    <Form.Control name="cellNum" placeholder="Numer nowej celi"></Form.Control>
                                                </FloatingLabel>
                                            </Form.Group>
                                        </Row>
                                        <Row>
                                            <Col>
                                                <div className="d-grid gap-2 pt">
                                                    <Button variant="primary" type="submit" size="lg">Zmień</Button>
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
                                    <Card.Title>Zmień gang</Card.Title>
                                    <Card.Subtitle className="text-muted pb">Chwilowo więzień znajduje się w gangu nr {prisoner.nazwa_gangu} </Card.Subtitle>
                                    <Form onSubmit={onFormSubmit6}>
                                        <Row className="mb-3">
                                            <Form.Group as={Col} controlId="gangId">
                                                <FloatingLabel className="mb-3" label="ID nowego gangu">
                                                    <Form.Control name="gangId" placeholder="ID nowego gangu"></Form.Control>
                                                </FloatingLabel>
                                            </Form.Group>
                                        </Row>
                                        <Row>
                                            <Col>
                                                <div className="d-grid gap-2 pt">
                                                    <Button variant="primary" type="submit" size="lg">Zmień</Button>
                                                </div>
                                            </Col>
                                        </Row>
                                    </Form>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Col></Row>
                <Row className="justify-content-md-center pt pb"><Col lg={8}>
                    <Row className="match-height">
                        <Col lg={6}>
                            <Card>
                                <Card.Body>
                                    <Card.Title>Dodaj sprawowanie</Card.Title>
                                    <Form onSubmit={onFormSubmit2}>
                                        <Row className="mb-3">
                                            <Form.Group as={Col} controlId="type">
                                                <FloatingLabel className="mb-3" label="Typ sprawowania">
                                                    <Form.Control name="type" placeholder="Typ sprawowania"></Form.Control>
                                                </FloatingLabel>
                                            </Form.Group>
                                            <Form.Group as={Col} controlId="weight">
                                                <FloatingLabel className="mb-3" label="Waga sprawowania">
                                                    <Form.Control name="weight" placeholder="Waga sprawowania"></Form.Control>
                                                </FloatingLabel>
                                            </Form.Group>
                                        </Row>
                                        <Row>
                                            <Form.Group as={Col} controlId="blah">
                                                <FloatingLabel className="mb-3" label="Opis">
                                                    <Form.Control name="blah" placeholder="Opis"></Form.Control>
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
                                    <Card.Title>Dodaj wyrok</Card.Title>
                                    <Form onSubmit={onFormSubmit7}>
                                        <Row className="mb-3">
                                            <Form.Group as={Col} controlId="date">
                                                <FloatingLabel className="mb-3" label="Data skazania">
                                                    <Form.Control name="date" placeholder="Data skazania"></Form.Control>
                                                </FloatingLabel>
                                            </Form.Group>
                                            <Form.Group as={Col} controlId="length">
                                                <FloatingLabel className="mb-3" label="Długość wyroku">
                                                    <Form.Control name="length" placeholder="Długość wyroku"></Form.Control>
                                                </FloatingLabel>
                                            </Form.Group>
                                        </Row>
                                        <Row>
                                            <Form.Group as={Col} controlId="blah">
                                                <FloatingLabel className="mb-3" label="Opis">
                                                    <Form.Control name="blah" placeholder="Opis"></Form.Control>
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
                <Row className="justify-content-md-center pt pb"><Col lg={8}>
                    <Row className="match-height">
                        <Col lg={6}>
                            <Card>
                                <Card.Body>
                                    <Card.Title>Zapisz więźnia na prace społeczne</Card.Title>
                                    <Form onSubmit={onFormSubmit3}>
                                        <Row className="mb-3">
                                            <Form.Group as={Col} controlId="idPrac">
                                                <FloatingLabel className="mb-3" label="ID pracy">
                                                    <Form.Control name="idPrac" placeholder="ID pracy"></Form.Control>
                                                </FloatingLabel>
                                            </Form.Group>
                                        </Row>
                                        <Row className="mb-3">
                                            <Form.Group as={Col} controlId="idZesp">
                                                <FloatingLabel className="mb-3" label="ID zespołu pilnującego">
                                                    <Form.Control name="idZesp" placeholder="ID zespołu pilnującego"></Form.Control>
                                                </FloatingLabel>
                                            </Form.Group>
                                        </Row>
                                        <Row>
                                            <Col>
                                                <div className="d-grid gap-2 pt">
                                                    <Button variant="primary" type="submit" size="lg">Zapisz</Button>
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
                                    <Card.Title>Wypuść więźnia</Card.Title>
                                    <Form onSubmit={onFormSubmit4}>
                                        <Row className="mb-3">
                                            <Form.Group as={Col} controlId="why">
                                                <FloatingLabel className="mb-3" label="ID rodzaju zakończenia">
                                                    <Form.Control name="why" placeholder="ID rodzaju zakończenia"></Form.Control>
                                                </FloatingLabel>
                                            </Form.Group>
                                        </Row>
                                        <Row>
                                            <Col>
                                                <div className="d-grid gap-2 pt">
                                                    <Button variant="danger" type="submit" size="lg">Wypuść</Button>
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

export default PrisonerProfilePage;