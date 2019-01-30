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
import {
  getNetworks,
  getStations
} from '../../data-services/station-data-service';

logger.configure({ active: true });

class Portal extends Component {
  state = {
    networks: null,
    network: null,
    stations: null,
  };

  handleChange = (name, value) => this.setState({ [name]: value });
  handleChangeNetwork = this.handleChange.bind(this, 'network');

  componentDidMount() {
    getNetworks().then(response => this.setState({ networks: response.data }));
    getStations({ limit: 100 })
    .then(response => this.setState({ stations: response.data }));
  }

  render() {
    return (
      <Row className="Portal">
        <Col lg={10} md={10} sm={10} className="Map">
          <BCBaseMap viewport={BCBaseMap.initialViewport}>
            <FeatureGroup>
              <EditControl
                position={'topleft'}
              />
            </FeatureGroup>
            <LayerGroup>
              <StationMarkers
                stations={this.state.stations}
                networks={this.state.networks}
              />
            </LayerGroup>
          </BCBaseMap>
        </Col>
        <Col lg={2} md={2} sm={2} className="Data">
          <Row>
            <NetworkSelector
              networks={this.state.networks}
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
