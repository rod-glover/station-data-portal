import React, { Component } from 'react';
import { Row, Col, Button } from 'react-bootstrap';
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
  join,
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
    allNetworks: null,
    selectedNetworks: [],

    allVariables: null,
    selectedVariables: [],

    selectedFrequencies: [],

    allStations: null,
  };

  handleChange = (name, value) => this.setState({ [name]: value });
  handleChangeNetwork = this.handleChange.bind(this, 'selectedNetworks');
  handleChangeVariable = this.handleChange.bind(this, 'selectedVariables');
  handleChangeFrequency = this.handleChange.bind(this, 'selectedFrequencies');

  handleClickAll = () => null;
  handleClickNone = () => null;

  componentDidMount() {
    getNetworks().then(response => this.setState({ allNetworks: response.data }));
    getVariables().then(response => this.setState({ allVariables: response.data }));
    getStations({
      params: {
        // limit: 1000,
        stride: 50,  // load every 10th station
      },
    })
    .then(response => this.setState({ allStations: response.data }));
  }

  filteredStations = memoize(
    (selectedNetworks, selectedVariables, selectedFrequencies, allStations) => {
      // console.log('filteredStations allStations', allStations)
      // console.log('filteredStations allVariables', this.state.allVariables)
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
      )(allStations);
    }
  );

  render() {
    const filteredStations = this.filteredStations(
      this.state.selectedNetworks,
      this.state.selectedVariables,
      this.state.selectedFrequencies,
      this.state.allStations
    );

    const selections = [
      {
        name: 'networks',
        items: this.state.selectedNetworks,
      },
      {
        name: 'variables',
        items: this.state.selectedVariables,
      },
      {
        name: 'frequencies',
        items: this.state.selectedFrequencies,
      },
    ];

    const unselectedThings = flow(
      filter(thing => thing.items.length === 0),
      map(thing => thing.name),
      join(', or '),
    )(selections);

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
                allNetworks={this.state.allNetworks}
                allVariables={this.state.allVariables}
              />
            </LayerGroup>
          </BCBaseMap>
        </Col>
        <Col lg={3} md={4} sm={12} className="Data">
          <Row className={'text-left'}>
            <Col lg={12} md={12} sm={12}>
              <p>{
                this.state.allStations ?
                  `${this.state.allStations.length} stations available` :
                  `Loading station info ... (this may take a couple of minutes)`
              }</p>
              {
                this.state.allStations && (
                  filteredStations.length ?
                    (<p>{`${filteredStations.length} stations selected`}</p>) :
                    (<p>No stations selected.</p>)
                )
              }
              {
                unselectedThings &&
                <p>You haven't selected any {unselectedThings}.</p>
              }
            </Col>
          </Row>
          <Row className={'text-left'}>
            <Col lg={12} md={12} sm={12}>
              <Button bsSize={'small'} onClick={this.handleClickAll}>All</Button>
              <Button bsSize={'small'} onClick={this.handleClickNone}>None</Button>
            </Col>
          </Row>
          <Row className={'text-left'}>
            <Col lg={12} md={12} sm={12}>
              <NetworkSelector
                allNetworks={this.state.allNetworks}
                value={this.state.selectedNetworks}
                onChange={this.handleChangeNetwork}
                isSearchable
              />
              {/*<JSONstringify object={this.state.selectedNetworks}/>*/}
            </Col>
          </Row>
          <Row className={'text-left'}>
            <Col lg={12} md={12} sm={12}>
              <VariableSelector
                allVariables={this.state.allVariables}
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
