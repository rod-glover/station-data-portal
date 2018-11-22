import React, {Component} from 'react';
import { Row, Col } from 'react-bootstrap';

import logger from '../../logger';
import BCMap from "../BCMap";

import './Portal.css';

logger.configure({active: true});

class Portal extends Component {
    render() {
        return (
            <Row className="Portal">
                <Col lg={10} className="Map">
                    <BCMap/>
                </Col>
                <Col lg={2} className="Data">
                    <Row>
                        Filters
                    </Row>
                    <Row>
                        Download
                    </Row>
                </Col>
            </Row>
        );
    }
}

export default Portal;
