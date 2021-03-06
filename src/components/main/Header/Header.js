import React, {Component} from 'react';
import { Row, Col } from 'react-bootstrap';

import './Header.css';

class Header extends Component {

    render() {
        return (
            <Row className={'Header'}>
                <Col lg={3} className="text-left">
                    <a href='https://pacificclimate.org/'>
                        <img
                            src={require('./logo.png')}
                            width='328'
                            height='38'
                            alt='Pacific Climate Impacts Consortium'
                        />
                    </a>
                </Col>
                <Col lg={7}>
                    <h1>YNWT Station Data Portal</h1>
                </Col>
                <Col lg={2} className='text-right'>
                  <small>Version: {process.env.REACT_APP_VERSION}</small>
                </Col>
            </Row>
        );
    }
}

export default Header;
