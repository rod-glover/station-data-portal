import contains from 'lodash/fp/contains';
import every from 'lodash/fp/every';
import filter from 'lodash/fp/filter';
import flatten from 'lodash/fp/flatten';
import flow from 'lodash/fp/flow';
import intersection from 'lodash/fp/intersection';
import map from 'lodash/fp/map';
import some from 'lodash/fp/some';
import uniq from 'lodash/fp/uniq';
import { isPointInPolygonWn } from '../geospatial';


const checkGeoJSONPolygon = geometry => {
  if (geometry['type'] !== 'Polygon') {
    throw new Error(`Invalid geometry type: ${geometry['type']}`)
  }
};

const getX = point => point[0];
const getY = point => point[1];
export const isPointInGeoJSONPolygon = isPointInPolygonWn(getX, getY);


export const stationFilter = (
  startDate, endDate, selectedNetworks, selectedVariables, selectedFrequencies,
  onlyWithClimatology, area, allNetworks, allVariables, allStations
) => {
  // console.log('filteredStations allStations', allStations)
  // console.log('filteredStations allVariables', this.state.allVariables)
  console.log('test date', new Date())
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
    filter(station => {
      return (
        // Filter for selected date range covered entirely by station
        // records date range.
        (
          startDate === null ||
          !station.min_obs_time ||  // not supposed to happen; optimistic
          startDate >= station.min_obs_time
        ) &&
        (
          endDate === null ||
          !station.max_obs_time ||  // observations to current date
          endDate <= station.max_obs_time
        ) &&

        // Filter for selected date range with any overlap at all with
        // station records date range. Probably not wanted.
        // (
        //   endDate === null ||
        //   !station.min_obs_time ||
        //   endDate >= station.min_obs_time
        // ) &&
        // (
        //   startDate === null ||
        //   !station.max_obs_time ||
        //   startDate <= station.max_obs_time
        // ) &&

        // Station is part of one of selected networks
        contains(
          station.network_uri,
          map(nw => nw.value.uri)(selectedNetworks)
        ) &&

        // Station reports one of selected variables
        (
          station.histories && station.histories[0] &&
          intersection(station.histories[0].variable_uris, selectedVariableUris).length > 0
        ) &&

        // Station recording frequency is one of selected frequencies
        (
          station.histories && station.histories[0] &&
          contains(station.histories[0].freq, selectedFrequencyValues)
        )
      )
    }),

    // Stations match `onlyWithClimatology`:
    // If `onlyWithClimatology`, station reports a climatology variable.
    filter(station => {
      if (!onlyWithClimatology) {
        return true;
      }
      return flow(
        // Select variables that station reports
        filter(({ uri }) => contains(uri, station.histories[0].variable_uris)),
        // Test that some reported variable is a climatology -- criterion from
        // PDP PCDS backend
        some(({ cell_method }) => /(within|over)/.test(cell_method))
      )(allVariables)
    }),

    // Stations are inside `area`
    filter(station => {
      if (!area) {
        return true;
      }
      checkGeoJSONPolygon(area.geometry);
      // Dumbest possible version: Only test the first vertex list in the
      // polygon.
      return isPointInGeoJSONPolygon(
        area.geometry.coordinates[0],
        [station.histories[0].lon, station.histories[0].lat])
    }),
  )(allStations);
};
