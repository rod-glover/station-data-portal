import React, { Component } from 'react';
import { Row, Col } from 'react-bootstrap';
import { FeatureGroup, LayerGroup } from 'react-leaflet';
import { EditControl } from 'react-leaflet-draw';
import memoize from 'memoize-one';
import { flow, map, filter, flatten, uniq, intersection, contains, tap } from 'lodash/fp';

import { BCBaseMap } from 'pcic-react-leaflet-components';

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
import JSONstringify from '../util/JSONstringify';

logger.configure({ active: true });

class Portal extends Component {
  state = {
    networks: null,
    seletedNetworks: [],

    variables: null,
    selectedVariables: [],

    stations: null,
  };

  handleChange = (name, value) => this.setState({ [name]: value });
  handleChangeNetwork = this.handleChange.bind(this, 'seletedNetworks');
  handleChangeVariable = this.handleChange.bind(this, 'selectedVariables');

  componentDidMount() {
    getNetworks().then(response => this.setState({ networks: response.data }));
    getVariables().then(response => this.setState({ variables: response.data }));
    getStations({
      limit: 200,
      stride: 50,
    })
    .then(response => this.setState({ stations: response.data }));
  }

  filteredStations = memoize(
    (selectedNetworks, selectedVariables, stations) => {
      // console.log('filteredStations stations', stations)
      // console.log('filteredStations variables', this.state.variables)
      const selectedVariableUris = flow(
        map(selectedVariable => selectedVariable.contexts),
        flatten,
        map(context => context.uri),
        uniq,
      )(selectedVariables);
      // console.log('filteredStations selectedVariableUris', selectedVariableUris)
      return flow(
        // Filter by selected networks
        filter(
          station => (
            contains(
              station.network_uri,
              map(nw => nw.value.uri)(selectedNetworks)
            )
          )
        ),
        // Then filter by selected variables
        filter(
          station =>
            intersection(station.histories[0].variable_uris, selectedVariableUris).length > 0
        ),
      )(stations);
    }
  );

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
                stations={
                  this.filteredStations(
                    this.state.seletedNetworks,
                    this.state.selectedVariables,
                    this.state.stations
                  )
                }
                networks={this.state.networks}
              />
            </LayerGroup>
          </BCBaseMap>
        </Col>
        <Col lg={2} md={4} sm={12} className="Data">
          <Row className={'text-left'}>
            <NetworkSelector
              networks={this.state.networks}
              value={this.state.seletedNetworks}
              onChange={this.handleChangeNetwork}
              isSearchable
            />
            {/*<JSONstringify object={this.state.seletedNetworks}/>*/}

            <VariableSelector
              variables={this.state.variables}
              value={this.state.selectedVariables}
              onChange={this.handleChangeVariable}
              isSearchable
            />
            {/*<JSONstringify object={this.state.selectedVariables}/>*/}
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
