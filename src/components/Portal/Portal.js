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
                      {/*<Polygon positions={[[50.449219,-127.514648,],[52.426758,-127.514648,],[52.426758,-125.024414,],[50.449219,-125.024414,]]}/>*/}
                      <SimpleGeoJSON data={{"type":"Feature","properties":{"source":"PCIC Climate Explorer"},"geometry":{"type":"Polygon","coordinates":[[[-127.514648,50.449219],[-127.514648,52.426758],[-125.024414,52.426758],[-125.024414,50.449219],[-127.514648,50.449219]]]}}}/>
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
