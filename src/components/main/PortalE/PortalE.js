import React, { Component } from 'react';
import {
  Row, Col,
  Button,
  Panel,
  Tabs, Tab
} from 'react-bootstrap';
import memoize from 'memoize-one';
import flow from 'lodash/fp/flow';
import map from 'lodash/fp/map';
import filter from 'lodash/fp/filter';
import join from 'lodash/fp/join';

import css from '../common.module.css';

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
      .then(response => this.setState({ allNetworks: response.data }));
    getVariables()
      .then(response => this.setState({ allVariables: response.data }));
    getStations()
    .then(response => this.setState({ allStations: response.data }));
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
      <div className={css.portal}>
        <Row>
          <AdjustableColumns
            defaultLgs={defaultLgs}
            contents={[
              <Panel style={{ marginLeft: '-10px', marginRight: '-15px' }}>
                <Panel.Heading>Station Filters</Panel.Heading>
                <Panel.Body>
                  <p>{`
                    ${filteredStations.length} stations selected of
                    ${this.state.allStations ? this.state.allStations.length : 0} available
                  `}</p>
                  <Row>
                    <Col lg={6} md={6} sm={6}>
                      {/*<Button bsSize={'small'} onClick={this.handleClickAll}>Select all criteria</Button>*/}
                      {/*<Button bsSize={'small'} onClick={this.handleClickNone}>Clear all criteria</Button>*/}
                      <DateSelector
                        value={this.state.startDate}
                        onChange={this.handleChangeStartDate}
                        label={'Start Date'}
                      />
                    </Col>
                    <Col lg={6} md={6} sm={6}>
                      <DateSelector
                        value={this.state.endDate}
                        onChange={this.handleChangeEndDate}
                        label={'End Date'}
                      />
                    </Col>
                    <Col lg={12} md={12} sm={12}>
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
                        allStations={this.state.allStations}
                        onReady={this.handleFrequencySelectorReady}
                        value={this.state.selectedFrequencies}
                        onChange={this.handleChangeFrequency}
                        isClearable={false}
                        styles={commonSelectorStyles}
                      />
                      {/*<JSONstringify object={this.state.selectedFrequencies}/>*/}
                    </Col>
                  </Row>
                </Panel.Body>
              </Panel>
              ,

              <StationMap
                stations={filteredStations}
                allNetworks={this.state.allNetworks}
                allVariables={this.state.allVariables}
                onSetArea={this.handleSetArea}
              />,

              <Panel style={{ marginLeft: '-15px', marginRight: '-10px' }}>
                <Panel.Heading>Selected Stations</Panel.Heading>
                <Panel.Body>
                  <Tabs defaultActiveKey={'Metadata'} className={css.mainTabs}>
                    <Tab eventKey={'Metadata'} title={'Metadata'}>
                      <Button disabled>
                        Download Metadata
                      </Button>

                      <p>{filteredStations.length} stations selected</p>
                      <StationMetadata
                        stations={filteredStations}
                        allNetworks={this.state.allNetworks}
                      />

                    </Tab>

                    <Tab eventKey={'Data'} title={'Data'}>
                      <p>{
                        this.state.allStations ?
                          `${filteredStations.length} stations selected of
                    ${this.state.allStations ? this.state.allStations.length : 0} available` :
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
                        unselectedThings &&
                        <p>You haven't selected any {unselectedThings}.</p>
                      }

                      <ObservationCounts stations={filteredStations}/>

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

                    </Tab>

                  </Tabs>
                </Panel.Body>
              </Panel>

            ]}
          />
        </Row>
      </div>
    );
  }
}

export default Portal;
