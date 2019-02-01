import React, { Component } from 'react';
import { Row, Col } from 'react-bootstrap';
import { FeatureGroup, LayerGroup } from 'react-leaflet';
import { EditControl } from 'react-leaflet-draw';
import memoize from 'memoize-one';
import {
  flow,
  map,
  filter,
  flatten,
  uniq,
  intersection,
  contains,
  pick,
  tap
} from 'lodash/fp';

import { BCBaseMap } from 'pcic-react-leaflet-components';

import './Portal.css';

import logger from '../../../logger';
import NetworkSelector from '../../selectors/NetworkSelector';
import StationMarkers from '../../maps/StationMarkers';
import {
  getNetworks,
  getVariables,
  getStations,
} from '../../../data-services/station-data-service';
import VariableSelector from '../../selectors/VariableSelector';
import JSONstringify from '../../util/JSONstringify';
import FrequencySelector from '../../selectors/FrequencySelector/FrequencySelector';

logger.configure({ active: true });

class Portal extends Component {
  state = {
    networks: null,
    seletedNetworks: [],

    variables: null,
    selectedVariables: [],

    selectedFrequencies: [],

    stations: null,
  };

  handleChange = (name, value) => this.setState({ [name]: value });
  handleChangeNetwork = this.handleChange.bind(this, 'seletedNetworks');
  handleChangeVariable = this.handleChange.bind(this, 'selectedVariables');
  handleChangeFrequency = this.handleChange.bind(this, 'selectedFrequencies');

  componentDidMount() {
    getNetworks().then(response => this.setState({ networks: response.data }));
    getVariables().then(response => this.setState({ variables: response.data }));
    getStations({
      params: {
        // limit: 1000,
        stride: 10,  // load every 10th station
      },
    })
    .then(response => this.setState({ stations: response.data }));
  }

  filteredStations = memoize(
    (selectedNetworks, selectedVariables, selectedFrequencies, stations) => {
      // console.log('filteredStations stations', stations)
      // console.log('filteredStations variables', this.state.variables)
      const selectedVariableUris = flow(
        map(selectedVariable => selectedVariable.contexts),
        flatten,
        map(context => context.uri),
        uniq,
      )(selectedVariables);
      // console.log('filteredStations selectedVariableUris', selectedVariableUris)
      const selectedFrequencyValues =
        map(option => option.value)(selectedFrequencies);
      // console.log('filteredStations selectedVariableUris', selectedVariableUris)
      return flow(
        filter(
          station => {
            return (
              contains(
                station.network_uri,
                map(nw => nw.value.uri)(selectedNetworks)
              ) && (
                station.histories && station.histories[0] &&
                intersection(station.histories[0].variable_uris, selectedVariableUris).length > 0
              ) && (
                station.histories && station.histories[0] &&
                contains(station.histories[0].freq, selectedFrequencyValues)
              )
            )
          }
        ),
      )(stations);
    }
  );

  render() {
    const filteredStations = this.filteredStations(
      this.state.seletedNetworks,
      this.state.selectedVariables,
      this.state.selectedFrequencies,
      this.state.stations
    );
    return (
      <Row className="Portal">
        <Col lg={9} md={8} sm={12} className="Map">
          <BCBaseMap viewport={BCBaseMap.initialViewport}>
            <FeatureGroup>
              <EditControl
                position={'topleft'}
              />
            </FeatureGroup>
            <LayerGroup>
              <StationMarkers
                stations={filteredStations}
                networks={this.state.networks}
              />
            </LayerGroup>
          </BCBaseMap>
        </Col>
        <Col lg={3} md={4} sm={12} className="Data">
          <Row className={'text-left'}>
            <Col lg={12} md={12} sm={12}>
              <p>{
                this.state.stations ?
                  `${this.state.stations.length} stations available` :
                  `Loading station info ... (this may take a couple of minutes)`
              }</p>
              {
                this.state.stations && (
                  filteredStations.length ?
                    (<p>{`${filteredStations.length} stations selected`}</p>) :
                    (<p>No stations selected. Select at least one network, at least one variable, and at least one observation frequency.</p>)
                )
              }

            </Col>
          </Row>
          <Row className={'text-left'}>
            <Col lg={12} md={12} sm={12}>
              <NetworkSelector
                networks={this.state.networks}
                value={this.state.seletedNetworks}
                onChange={this.handleChangeNetwork}
                isSearchable
              />
              {/*<JSONstringify object={this.state.seletedNetworks}/>*/}
            </Col>
          </Row>
          <Row className={'text-left'}>
            <Col lg={12} md={12} sm={12}>
              <VariableSelector
                variables={this.state.variables}
                value={this.state.selectedVariables}
                onChange={this.handleChangeVariable}
                isSearchable
              />
              {/*<JSONstringify object={this.state.selectedVariables}/>*/}
            </Col>
          </Row>
          <Row className={'text-left'}>
            <Col lg={12} md={12} sm={12}>
              <FrequencySelector
                value={this.state.selectedFrequencies}
                onChange={this.handleChangeFrequency}
              />
              {/*<JSONstringify object={this.state.selectedFrequencies}/>*/}
            </Col>
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
