import React, { Component } from 'react';
import { Row, Col, Button, Checkbox, Tabs, Tab, Table } from 'react-bootstrap';
import { FeatureGroup, LayerGroup } from 'react-leaflet';
import { EditControl } from 'react-leaflet-draw';
import memoize from 'memoize-one';
import flow from 'lodash/fp/flow';
import map from 'lodash/fp/map';
import filter from 'lodash/fp/filter';
import join from 'lodash/fp/join';

import './PortalE.css';

import logger from '../../../logger';
import NetworkSelector from '../../selectors/NetworkSelector';
import {
  getNetworks,
  getVariables,
  getStations,
} from '../../../data-services/station-data-service';
import { dataDownloadTarget } from '../../../data-services/pdp-data-service';
import VariableSelector from '../../selectors/VariableSelector';
import FrequencySelector from '../../selectors/FrequencySelector/FrequencySelector';
import DateSelector from '../../selectors/DateSelector';
import FileFormatSelector from '../../selectors/FileFormatSelector';
import ClipToDateControl from '../../controls/ClipToDateControl';
import ObservationCounts from '../../info/ObservationCounts';
import { stationFilter } from '../../../utils/portals-common';
import ButtonToolbar from 'react-bootstrap/es/ButtonToolbar';
import StationMetadata from '../../info/StationMetadata';
import OnlyWithClimatologyControl
  from '../../controls/OnlyWithClimatologyControl';
import StationMap from '../../maps/StationMap';
import JSONstringify from '../../util/JSONstringify';
import AdjustableColumns from '../../util/AdjustableColumns';


logger.configure({ active: true });


const commonSelectorStyles = {
  menu: (provided) => {
    return {
      ...provided,
      zIndex: 999,
    }
  },
  valueContainer: (provided, state) => ({
    ...provided,
    maxHeight: '10em',
    overflowY: 'auto',
  }),
  indicatorsContainer: (provided, state) => ({
    ...provided,
    width: '2em',
  }),
  option: (styles) => {
    return {
      ...styles,
      padding: '0.5em',
      fontSize: '0.9em',
    }
  }
};


const defaultLgs = [2, 6, 4];


class Portal extends Component {
  state = {
    startDate: null,
    endDate: null,

    allNetworks: null,
    selectedNetworks: [],
    networkActions: {},

    allVariables: null,
    selectedVariables: [],
    variableActions: {},

    selectedFrequencies: [],
    frequencyActions: {},

    onlyWithClimatology: false,

    allStations: null,

    fileFormat: undefined,
    clipToDate: false,

    area: undefined,
  };

  handleChange = (name, value) => this.setState({ [name]: value });
  toggleBoolean = name =>
    this.setState(state => ({ [name]: !state[name] }));

  handleChangeStartDate = this.handleChange.bind(this, 'startDate');
  handleChangeEndDate = this.handleChange.bind(this, 'endDate');

  handleChangeNetwork = this.handleChange.bind(this, 'selectedNetworks');
  handleNetworkSelectorReady = this.handleChange.bind(this, 'networkActions');

  handleChangeVariable = this.handleChange.bind(this, 'selectedVariables');
  handleVariableSelectorReady = this.handleChange.bind(this, 'variableActions');

  handleChangeFrequency = this.handleChange.bind(this, 'selectedFrequencies');
  handleFrequencySelectorReady = this.handleChange.bind(this, 'frequencyActions');

  handleClickAll = () => {
    this.state.networkActions.selectAll();
    this.state.variableActions.selectAll();
    this.state.frequencyActions.selectAll();
  };
  handleClickNone = () => {
    this.state.networkActions.selectNone();
    this.state.variableActions.selectNone();
    this.state.frequencyActions.selectNone();
  };

  handleChangeFileFormat = this.handleChange.bind(this, 'fileFormat');

  toggleClipToDate = this.toggleBoolean.bind(this, 'clipToDate');
  toggleOnlyWithClimatology =
    this.toggleBoolean.bind(this, 'onlyWithClimatology');

  handleSetArea = this.handleChange.bind(this, 'area');

  componentDidMount() {
    getNetworks()
      .then(response => this.setState({ allNetworks: response.data }))
      .then(() => this.state.networkActions.selectAll())
    ;
    getVariables()
      .then(response => this.setState({ allVariables: response.data }))
      .then(() => this.state.variableActions.selectAll())
    ;
    getStations({
      params: {
        // limit: 1000,
        stride: 10,  // load every 10th station
      },
    })
      .then(response => this.setState({ allStations: response.data }))
      .then(() => this.state.frequencyActions.selectAll())
    ;
  }

  stationFilter = memoize(stationFilter);

  downloadTarget = dataCategory => dataDownloadTarget({
    startDate: this.state.startDate,
    endDate: this.state.endDate,
    networks: this.state.selectedNetworks,
    variables: this.state.selectedVariables,
    frequencies: this.state.selectedFrequencies,
    polygon: this.state.area,
    clipToDate: this.state.clipToDate,
    onlyWithClimatology: this.state.onlyWithClimatology,
    dataCategory,
    dataFormat: this.state.fileFormat,
  });

  render() {
    const filteredStations = this.stationFilter(
      this.state.startDate,
      this.state.endDate,
      this.state.selectedNetworks,
      this.state.selectedVariables,
      this.state.selectedFrequencies,
      this.state.onlyWithClimatology,
      this.state.area,
      this.state.allNetworks,
      this.state.allVariables,
      this.state.allStations,
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
      <React.Fragment>
        <Row>
          <AdjustableColumns
            defaultLgs={defaultLgs}
            contents={[
              <React.Fragment>
                <Row>
                  <Col lg={6} md={6} sm={6}>
                    {/*<Button bsSize={'small'} onClick={this.handleClickAll}>Select all criteria</Button>*/}
                    {/*<Button bsSize={'small'} onClick={this.handleClickNone}>Clear all criteria</Button>*/}
                    <div>
                      <DateSelector
                        value={this.state.startDate}
                        onChange={this.handleChangeStartDate}
                        label={'Start Date'}
                      />
                    </div>
                    <div>
                      <DateSelector
                        value={this.state.endDate}
                        onChange={this.handleChangeEndDate}
                        label={'End Date'}
                      />
                    </div>
                  </Col>
                  <Col lg={6} md={6} sm={6}>
                    <OnlyWithClimatologyControl
                      value={this.state.onlyWithClimatology}
                      onChange={this.toggleOnlyWithClimatology}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col lg={12} md={12} sm={12}>
                    <NetworkSelector
                      allNetworks={this.state.allNetworks}
                      onReady={this.handleNetworkSelectorReady}
                      value={this.state.selectedNetworks}
                      onChange={this.handleChangeNetwork}
                      isSearchable
                      isClearable={false}
                      styles={commonSelectorStyles}
                    />
                    {/*<JSONstringify object={this.state.selectedNetworks}/>*/}
                  </Col>
                </Row>
                <Row>
                  <Col lg={12} md={12} sm={12}>
                    <VariableSelector
                      allVariables={this.state.allVariables}
                      onReady={this.handleVariableSelectorReady}
                      value={this.state.selectedVariables}
                      onChange={this.handleChangeVariable}
                      isSearchable
                      isClearable={false}
                      styles={commonSelectorStyles}
                    />
                    {/*<JSONstringify object={this.state.selectedVariables}/>*/}
                  </Col>
                </Row>
                <Row>
                  <Col lg={12} md={12} sm={12}>
                    <FrequencySelector
                      onReady={this.handleFrequencySelectorReady}
                      value={this.state.selectedFrequencies}
                      onChange={this.handleChangeFrequency}
                      isClearable={false}
                      styles={commonSelectorStyles}
                    />
                    {/*<JSONstringify object={this.state.selectedFrequencies}/>*/}
                  </Col>
                </Row>
              </React.Fragment>
              ,
              <StationMap
                stations={filteredStations}
                allNetworks={this.state.allNetworks}
                allVariables={this.state.allVariables}
                onSetArea={this.handleSetArea}
              />,

              <Row>
                <Tabs defaultActiveKey={'Stations and Metadata'}>
                  <Tab eventKey={'Stations and Metadata'} title={'Stations and Metadata'}>
                    <Button disabled>
                      Download Metadata
                    </Button>

                    <p>{filteredStations.length} stations selected</p>
                    <StationMetadata
                      stations={filteredStations}
                      allNetworks={this.state.allNetworks}
                    />

                  </Tab>

                  <Tab eventKey={'Download Data'} title={'Download Data'}>
                    <h1>Station Data</h1>

                    <FileFormatSelector
                      value={this.state.fileFormat}
                      onChange={this.handleChangeFileFormat}
                    />

                    <ClipToDateControl
                      value={this.state.clipToDate}
                      onChange={this.toggleClipToDate}
                    />

                    <ButtonToolbar>
                      <Button href={this.downloadTarget('timeseries')}>
                        Download Timeseries
                      </Button>
                      <Button href={this.downloadTarget('climatology')}>
                        Download Climatology
                      </Button>
                    </ButtonToolbar>

                    <h1>Overview</h1>
                    <p>{
                      this.state.allStations ?
                        `${this.state.allStations.length} stations available.` :
                        `Loading station info ... (this may take a couple of minutes)`
                    }</p>
                    <p>{`
            Available stations are filtered by
            the network they are part of,
            the variable(s) they observe,
            and the frequency of obervation.
            Stations matching selected criteria are displayed on the map.
            `}</p>
                    {
                      this.state.allStations &&
                      <p>{`${filteredStations.length || 'No'} stations match criteria.`}</p>
                    }
                    {
                      unselectedThings &&
                      <p>You haven't selected any {unselectedThings}.</p>
                    }

                    <ObservationCounts stations={filteredStations}/>
                  </Tab>

                </Tabs>
              </Row>

            ]}
          />
        </Row>
      </React.Fragment>
    );
  }
}

export default Portal;
