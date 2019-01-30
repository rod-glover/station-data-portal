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
  getVariables,
  getStations,
} from '../../data-services/station-data-service';
import VariableSelector from '../selectors/VariableSelector';

logger.configure({ active: true });

class Portal extends Component {
  state = {
    networks: null,
    network: null,
    variables: null,
    variable: null,
    stations: null,
  };

  handleChange = (name, value) => this.setState({ [name]: value });
  handleChangeNetwork = this.handleChange.bind(this, 'network');
  handleChangeVariable = this.handleChange.bind(this, 'variable');

  componentDidMount() {
    getNetworks().then(response => this.setState({ networks: response.data }));
    getVariables().then(response => this.setState({ variables: response.data }));
    getStations({ limit: 100 })
    .then(response => this.setState({ stations: response.data }));
  }

  render() {
    return (
      <Row className="Portal">
        <Col lg={10} md={8} sm={12} className="Map">
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
        <Col lg={2} md={4} sm={12} className="Data">
          <Row className={'text-left'}>
            <NetworkSelector
              networks={this.state.networks}
              value={this.state.network}
              onChange={this.handleChangeNetwork}
              isSearchable
            />
            <div>Network: {this.state.network ? this.state.network.label : 'unselected'}</div>

            <VariableSelector
              variables={this.state.variables}
              value={this.state.variable}
              onChange={this.handleChangeVariable}
              isSearchable
            />
            <div>Variable: {this.state.variable ? this.state.variable.label : 'unselected'}</div>
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
