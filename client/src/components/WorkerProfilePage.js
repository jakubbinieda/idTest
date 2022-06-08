import React, { Fragment } from 'react';
import { useParams } from "react-router-dom";
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import FloatingLabel from 'react-bootstrap/FloatingLabel'
import Button from "react-bootstrap/Button";
import ListGroup from 'react-bootstrap/ListGroup';
import Alert from "react-bootstrap/Alert";

function WorkerProfilePage() {
    let { id } = useParams();
    id=id.substring(1);

    const [worker, setWorker] = React.useState([]);
    const [error, setError] = React.useState(null);
    const [msg, setMsg] = React.useState(null);
    const [isWorking, setIsWorking] = React.useState([]);
    const [isOnLeave, setIsOnLeave] = React.useState([]);
    const [positions, setPositions] = React.useState([]);
    const [isEmployed, setIsEmployed] = React.useState([]);
    const [workHistory, setWorkHistory] = React.useState([])
    React.useEffect(() => {
        getQueryRes('SELECT * FROM pracownicy WHERE id_pracownika='+id+';',setWorker);
        getQueryRes('SELECT * FROM czy_pracownik_na_urlopie('+id+');',setIsOnLeave);
        getQueryRes('SELECT * FROM czy_pracownik_obecnie_na_zmianie('+id+');',setIsWorking);
        getQueryRes('SELECT * FROM stanowisko_przelozony_prac('+id+');',setPositions);
        getQueryRes("SELECT * FROM his_of_pracownik("+id+");",setWorkHistory);
        getQueryRes("SELECT * FROM aktywny_prac("+id+");",setIsEmployed);
    }, []);
    
    function getQueryRes(cmd,fun) {
        fetch('/query/'+cmd)
        .then(response => { return response.json(); })
        .then(data => { fun(data); });
    }

    const workerHistory=workHistory.map((entry) =>{
        return (
            <ListGroup.Item as="li" className="d-flex justify-content-between align-items-start">
                <div className="ms-2 me-auto">
                    <div className="fw-bold">{entry.data.substring(0,10)}</div>
                    {entry.opis}
                </div>
            </ListGroup.Item>
        )
    })

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

        worker.map((worker) => {
            var query='/query/UPDATE pracownicy SET';
            if(id!=worker.id_pracownika) query=query+' id_pracownika='+id;
            if(name!=worker.imie) {
                if(id!=worker.id_pracownika) query=query+", imie='"+name+"'";
                else query=query+" imie='"+name+"'";
            }
            if(surname!=worker.nazwisko) {
                if(id!=worker.id_pracownika || name!=worker.imie) query=query+", nazwisko='"+surname+"'";
                else query=query+" nazwisko='"+surname+"'";
            }
            if(pesel!=worker.pesel) {
                if(id!=worker.id_pracownika || name!=worker.imie || surname!=worker.nazwisko) query=query+", pesel='"+pesel+"'";
                else query=query+" pesel='"+pesel+"'";
            }
            if(birth!=worker.data_urodzenia) {
                if(id!=worker.id_pracownika || name!=worker.imie || surname!=worker.nazwisko || pesel!=worker.pesel) query=query+", data_urodzenia="+birth;
                else query=query+" data_urodzenia='"+birth+"'";
            }
            if(gender!=worker.plec) {
                if(id!=worker.id_pracownika || name!=worker.imie || surname!=worker.nazwisko || pesel!=worker.pesel || birth!=worker.data_urodzenia) query=query+", plec='"+gender+"'";
                else query=query+" plec='"+gender+"'";
            }
            
            if(id!=worker.id_pracownika || name!=worker.imie || surname!=worker.nazwisko || pesel!=worker.pesel || birth!=worker.data_urodzenia || gender!=worker.plec) {
                var status;
                fetch(query+' WHERE id_pracownika='+worker.id_pracownika+';')
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
        var newJob=formData.get("newJob");
        var newBoss=formData.get("newBoss");
        var query;
        if(newBoss=='') query="/query/SELECT * FROM zmien_stanowisko_prac("+id+","+newJob+");";
        else query="/query/SELECT * FROM zmien_stanowisko_prac_oraz_przel("+id+","+newJob+","+newBoss+");";

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
        var start=formData.get("start");
        var end=formData.get("end");
        var why=formData.get("why");

        var query="/query/INSERT INTO pracownicy_nieobecnosci VALUES("+id+",'"+start+"','"+end+"',"+why+");";

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

    const newdata=worker.map((worker) =>{
        return (
            <Container fluid>
                <FailedQuery/>
                <SuccessfulQuery/>
                <Row className="justify-content-md-center pt pb"><Col lg={8}>
                    <Card>
                        <Card.Body>
                            <Card.Title className="text-center">Pracownik numer {worker.id_pracownika}</Card.Title>
                            <Form onSubmit={onFormSubmit}>
                                <Row className="mb-3">
                                    <Form.Group as={Col} controlId="name">
                                        <FloatingLabel className="mb-3" label="Imię Pracownika">
                                            <Form.Control name="name" defaultValue={worker.imie}></Form.Control>
                                        </FloatingLabel>
                                    </Form.Group>
                                    <Form.Group as={Col} controlId="surname">
                                        <FloatingLabel className="mb-3" label="Nazwisko Pracownika">
                                            <Form.Control name="surname" defaultValue={worker.nazwisko}></Form.Control>
                                        </FloatingLabel>
                                    </Form.Group>
                                </Row>
                                <Row className="mb-3">
                                    <Form.Group as={Col} controlId="pesel">
                                        <FloatingLabel className="mb-3" label="PESEL Pracownika">
                                            <Form.Control name="pesel" defaultValue={worker.pesel}></Form.Control>
                                        </FloatingLabel>
                                    </Form.Group>
                                    <Form.Group as={Col} controlId="birth">
                                        <FloatingLabel className="mb-3" label="Data urodzenia Pracownika">
                                            <Form.Control name="birth" defaultValue={worker.data_urodzenia}></Form.Control>
                                        </FloatingLabel>
                                    </Form.Group>
                                </Row>
                                <Row>
                                    <Form.Group as={Col} controlId="id">
                                        <FloatingLabel className="mb-3" label="ID Pracownika">
                                            <Form.Control name="id" defaultValue={worker.id_pracownika}></Form.Control>
                                        </FloatingLabel>
                                    </Form.Group>
                                    <Form.Group as={Col} controlId="gender">
                                        <FloatingLabel className="mb-3" label="Płeć Pracownika">
                                            <Form.Control name="gender" defaultValue={worker.plec=='M'?"Mężczyzna":"Kobieta"}></Form.Control>
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
                            <Card.Title className="text-center">O pracowniku numer {worker.id_pracownika}</Card.Title>
                            <ListGroup as="ol" numbered>
                                <ListGroup.Item as="li">ID stanowiska: {positions.map((entry)=>{return entry.id_stanowiska})}</ListGroup.Item>
                                <ListGroup.Item as="li">Czy jest na urlopie: {isOnLeave.map((is)=>{return is.czy_pracownik_na_urlopie=='f'?"Tak":"Nie"})}</ListGroup.Item>
                                <ListGroup.Item as="li">Czy teraz pracuje: {isWorking.map((entry)=>{return entry.czy_pracownik_obecnie_na_zmianie=='f'?"Tak":"Nie"})}</ListGroup.Item>
                                <ListGroup.Item as="li">ID przełożonego: {positions.map((entry)=>{return entry.id_przelozonego})}</ListGroup.Item>
                                <ListGroup.Item as="li">Czy jest aktualnie zatrudniony: {isEmployed.map((entry)=>{return entry.aktywny_prac?"Tak":"Nie"})}</ListGroup.Item>
                            </ListGroup>
                        </Card.Body>
                    </Card>
                </Col></Row>
                <Row className="justify-content-md-center pt pb"><Col lg={8}>
                    <Card>
                        <Card.Title className="text-center">Historia pracownika w placówce</Card.Title>
                        <Card.Body>
                            <ListGroup as="ol" numbered>
                                {workerHistory}
                            </ListGroup>
                        </Card.Body>
                    </Card>
                </Col></Row>
                <Row className="justify-content-md-center pt pb"><Col lg={8}>
                    <Row className="match-height">
                        <Col lg={6}>
                            <Card>
                                <Card.Body>
                                    <Card.Title>Zmień stanowisko</Card.Title>
                                    <Card.Subtitle className="text-muted pb">Chwilowo pracuje na stanowisku o id {positions.map((entry)=>{return entry.id_stanowiska})}</Card.Subtitle>
                                    <Form onSubmit={onFormSubmit2}>
                                        <Row className="mb-3">
                                            <Form.Group as={Col} controlId="newJob">
                                                <FloatingLabel className="mb-3" label="ID stanowiska">
                                                    <Form.Control name="newJob" placeholder="ID stanowiska"></Form.Control>
                                                </FloatingLabel>
                                            </Form.Group>
                                        </Row>
                                        <Row className="mb-3">
                                            <Form.Group as={Col} controlId="newBoss">
                                                <FloatingLabel className="mb-3" label="ID przełożonego">
                                                    <Form.Control name="newBoss" placeholder="ID przełożonego"></Form.Control>
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
                                    <Card.Title>Dodaj nieobeność</Card.Title>
                                    <Card.Subtitle className="text-muted pb">Każdemu się zdarza</Card.Subtitle>
                                    <Form onSubmit={onFormSubmit3}>
                                        <Row className="mb-3">
                                            <Form.Group as={Col} controlId="start">
                                                <FloatingLabel className="mb-3" label="Data rozpoczęcia">
                                                    <Form.Control name="start" placeholder="Data rozpoczęcia"></Form.Control>
                                                </FloatingLabel>
                                            </Form.Group>
                                            <Form.Group as={Col} controlId="end">
                                                <FloatingLabel className="mb-3" label="Data zakończenia">
                                                    <Form.Control name="end" placeholder="Data zakończenia"></Form.Control>
                                                </FloatingLabel>
                                            </Form.Group>
                                        </Row>
                                        <Row className="mb-3">
                                            <Form.Group as={Col} controlId="why">
                                                <FloatingLabel className="mb-3" label="ID powodu">
                                                    <Form.Control name="why" placeholder="ID powodu"></Form.Control>
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
            {newdata}
        </Fragment>
    );
}

export default WorkerProfilePage;