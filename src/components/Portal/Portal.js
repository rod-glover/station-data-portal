import React, {Component} from 'react';
import { Row, Col } from 'react-bootstrap';
import { FeatureGroup, Circle, Polygon } from 'react-leaflet';
import { EditControl } from 'react-leaflet-draw';
import { BCBaseMap } from 'pcic-react-leaflet-components';

import SimpleGeoJSON from '../SimpleGeoJSON';

import './Portal.css';

import logger from '../../logger';

logger.configure({active: true});

class Portal extends Component {
    render() {
        return (
            <Row className="Portal">
                <Col lg={10} className="Map">
                  <BCBaseMap viewport={BCBaseMap.initialViewport}>
                    <FeatureGroup>
                      <EditControl
                        position={'topleft'}
                      />
                    </FeatureGroup>
                  </BCBaseMap>
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
