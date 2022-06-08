import React, { Fragment, Component } from 'react';
import Card from 'react-bootstrap/Card';

export default class Footer extends Component {
    render() {
        return (
            <Fragment>
                <Card className="text-center">
                    <Card.Body>
                        <Card.Text>
                            <Card.Text>Copyright © 2022 : <a href="https://jakubbinieda.omg.lol">Jakub Binięda</a></Card.Text>
                        </Card.Text>
                    </Card.Body>
                </Card>
            </Fragment>
        );
    }
}