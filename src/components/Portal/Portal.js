import React, { Component } from 'react';
import { Row, Col } from 'react-bootstrap';
import { FeatureGroup, LayerGroup } from 'react-leaflet';
import { EditControl } from 'react-leaflet-draw';
import { BCBaseMap } from 'pcic-react-leaflet-components';

import SimpleGeoJSON from '../SimpleGeoJSON';

import './Portal.css';

import logger from '../../logger';
import NetworkSelector from '../selectors/NetworkSelector';
import StationMarkers from '../maps/StationMarkers';

logger.configure({ active: true });

class Portal extends Component {
  state = {
    network: null,
  };

  handleChange = (name, value) => this.setState({ [name]: value });
  handleChangeNetwork = this.handleChange.bind(this, 'network');

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
            <LayerGroup>
              <StationMarkers/>
            </LayerGroup>
          </BCBaseMap>
        </Col>
        <Col lg={2} className="Data">
          <Row>
            <NetworkSelector
              value={this.state.network}
              onChange={this.handleChangeNetwork}
              isSearchable
            />
            <div>{this.state.network ? this.state.network.label : 'unselected'}</div>
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
