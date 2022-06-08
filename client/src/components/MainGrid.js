import React, { Fragment } from 'react';
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Stack from "react-bootstrap/Stack";
import Alert from "react-bootstrap/Alert"
import { PersonCircle , EmojiSunglasses, DashCircleDotted} from 'react-bootstrap-icons';
import moment from "moment";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip,Legend} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { ArcElement } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { Link } from "react-router-dom"

ChartJS.register( CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);


function MainGrid() {
    var date=moment().format('HH:mm:ss');
    const [prisonerCount, setPrisonerCount] = React.useState([]);
    const [workerCount, setWorkerCount] = React.useState([]);
    const [gangCount, setGangCount] = React.useState([]);
    const [cellCount, setCellCount] = React.useState([]);
    const [freeSpace, setFreeSpace] = React.useState([]);
    const [workersOnLeave, setworkersOnLeave] = React.useState([]);
    const [workersWorking, setworkersWorking] = React.useState([]);
    const [cntWithGang, setCntWithGang] = React.useState([]);
    const [cntWithoutGang, setCntWithoutGang] = React.useState([]);
    const [cntToday, setCntToday] = React.useState([]);
    const [ratio, setRatio] = React.useState([]);
    const [error, setError] = React.useState(null);
    React.useEffect(() => {
        getQueryRes('SELECT COUNT(*) AS count FROM pracownicy;',setWorkerCount);
        getQueryRes('SELECT COUNT(*) AS count FROM wiezniowie;',setPrisonerCount);
        getQueryRes('SELECT COUNT(*) AS count FROM gangi;',setGangCount);
        getQueryRes('SELECT COUNT(*) AS count FROM cele;',setCellCount);
        getQueryRes('SELECT * FROM procent_zapelnienia_wiezienia();',setFreeSpace);
        getQueryRes('SELECT * FROM ile_pracownikow_dzisiaj_obecnych();',setworkersWorking);
        getQueryRes('SELECT * FROM ile_pracownikow_nieobecnych();',setworkersOnLeave);
        getQueryRes('SELECT * FROM ile_wiezniow_nalezy_do_gangow();',setCntWithGang);
        getQueryRes('SELECT * FROM ile_wiezniow_nie_nalezy_do_gangow();',setCntWithoutGang);
        getQueryRes('SELECT COUNT(*) FROM wiezniowie_wyroki WHERE data_skazania=(SELECT CURRENT_DATE);',setCntToday);
        getQueryRes('SELECT * FROM last_years() ORDER BY rok;',setRatio);
    }, []);
  
    function getQueryRes(cmd,fun) {
        var status;
        fetch('query/'+cmd)
        .then(response => { 
            status=response.status;
            return response.json(); 
        }).then(data => { 
            if(status==500) setError(data.error);
            else fun(data); 
        });
    }

    function getIn(from,to) {
        getQueryRes("SELECT * FROM range_wiezien_info('"+from+"','"+to+"');",setRatio);
        return ratio.map((cnt)=>{return cnt.ile_przyszlo});
    }

    function FailedQuery() {
        if(error) {
            return (
                <Alert key="danger" variant="danger">{error}</Alert>
            );
        }
    }

    const options1 = {
    responsive: true,
    plugins: {
        legend: { display: false, position: 'top', },
        title: { display: false, text: 'Some chart iunno', },
        xAxes: [{  gridLines: { display:false } }],
        yAxes: [{ gridLines: { display:false } }] },
    };

    const data1 = {
    labels: ratio.map((entry)=>{return entry.rok}),
    datasets: [
    {
      label: 'Przyszło',
      data: ratio.map((entry)=>{return entry.ile_przyszlo}),
      backgroundColor: 'rgba(53, 162, 235, 0.5)',
    },
    {
      label: 'Odeszło',
      data: ratio.map((entry)=>{return entry.ile_odeszlo}),
      backgroundColor: 'rgba(255, 99, 132, 0.5)',
    },
  ],
};

    const data2 = {
        labels: ['Zajęte','Wolne'],
        datasets: [{
            data: [ freeSpace.map((cnt)=>{return cnt.procent_zapelnienia_wiezienia}),100-freeSpace.map((cnt)=>{return cnt.procent_zapelnienia_wiezienia}) ],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
            ],
            borderWidth: 1,
        },],
    };

    const data3 = {
        labels: ['Obecnych','Zwolnionych'],
        datasets: [{
            data: [ workersWorking.map((cnt)=>{return cnt.ile_pracownikow_dzisiaj_obecnych}),workersOnLeave.map((cnt)=>{return cnt.ile_pracownikow_nieobecnychs}) ],
            backgroundColor: [
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 99, 132, 0.2)',
            ],
            borderColor: [
                'rgba(54, 162, 235, 1)',
                'rgba(255, 99, 132, 1)',
            ],
            borderWidth: 1,
        },],
    };

    const data4 = {
        labels: ['W gangu','Bez gangu'],
        datasets: [{
            data: [ cntWithGang.map((cnt)=>{return cnt.ile_wiezniow_nalezy_do_gangow}),cntWithoutGang.map((cnt)=>{return cnt.ile_wiezniow_nie_nalezy_do_gangow}) ],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
            ],
            borderWidth: 1,
        },],
    };

    return (
        <Fragment>
            <FailedQuery/>
            <Container fluid>
                <Row className="match-height pt pb">
                    <Col xl={4}>
                        <Card>
                            <Card.Body>
                                <Card.Title>Witaj z powrotem 👮‍♂️</Card.Title>
                                <Card.Subtitle className="mb-2 text-muted">Tęskniliśmy!</Card.Subtitle>
                                <Card.Text>Dzisiaj przybyło {cntToday.map((cnt)=>{return(cnt.count)})} więźniów</Card.Text>
                                <Link to="/wiezniowie">
                                    <Button variant="primary">Wyświetl wieźniów</Button>
                                </Link>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col xl={8}>
                        <Card>
                            <Card.Body>
                                <Stack direction="horizontal">
                                    <Card.Title>Statystyki</Card.Title>
                                    <Card.Text className="ms-auto">Uaktualnione {date}</Card.Text>
                                </Stack>
                                <Card className="text-center">
                                    <Card.Body>
                                        <Row>
                                            <Col md={2} xl={3} sm={6}>
                                                <Card.Text><PersonCircle color="blue" size={48}/></Card.Text>
                                                <Card.Subtitle>{workerCount.map((workerCount)=>{return(workerCount.count)})}</Card.Subtitle>
                                                <Card.Text>Pracowników</Card.Text>
                                            </Col>
                                            <Col md={2} xl={3} sm={6}>
                                                <Card.Text><PersonCircle color="orange" size={48}/></Card.Text>
                                                <Card.Subtitle>{prisonerCount.map((prisonerCount)=>{return(prisonerCount.count)})}</Card.Subtitle>
                                                <Card.Text>Więźniów</Card.Text>
                                            </Col>
                                            <Col md={2} xl={3} sm={6}>
                                                <Card.Text><DashCircleDotted color="grey" size={48}/></Card.Text>
                                                <Card.Subtitle>{cellCount.map((cellCount)=>{return(cellCount.count)})}</Card.Subtitle>
                                                <Card.Text>Cel</Card.Text>
                                            </Col>
                                            <Col md={2} xl={3} sm={6}>
                                                <Card.Text><EmojiSunglasses color="red" size={48}/></Card.Text>
                                                <Card.Subtitle>{gangCount.map((gangCount)=>{return(gangCount.count)})}</Card.Subtitle>
                                                <Card.Text>Gangów</Card.Text>
                                            </Col>
                                        </Row>
                                    </Card.Body>
                                </Card>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
                <Row className="match-height pt pb">
                    <Col xl={4}>
                        <Row className="match-height pb">
                            <Col md={6}>
                                <Card>
                                    <Card.Body>
                                        <Card.Title>Zapełnienie</Card.Title>
                                        <Pie options={options1} data={data2} />
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col md={6}>
                                <Card>
                                    <Card.Body>
                                        <Card.Title>Pracownicy</Card.Title>
                                        <Pie options={options1} data={data3} />
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                        <Row className="pt">
                            <Col md={12}>
                                <Card>
                                    <Card.Body>
                                        <Card.Title>Gangi</Card.Title>
                                        <Row>
                                            <Col md={6}>
                                                W naszym więzieniu tylko {cntWithGang.map((cnt)=>{return cnt.ile_wiezniow_nalezy_do_gangow})} więźniów należy do gangu. Co czyni nas jedną z najbezpieczniejszych placówek w Polsce.
                                            </Col>
                                            <Col md={6}>
                                                <Pie options={options1} data={data4} />
                                            </Col>
                                        </Row>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                    </Col>
                    <Col xl={8}>
                    <Card>
                        <Card.Body>
                            <Card.Title>Przyjścia i odejścia</Card.Title>
                            <Bar options={options1} data={data1} />
                        </Card.Body>
                    </Card>
                    </Col>
                </Row>
            </Container>
        </Fragment>
    )
}

export default MainGrid;