import {
  contains, filter, flatten, flow, intersection, map,
  uniq
} from 'lodash/fp';

export const stationFilter =     (startDate, endDate, selectedNetworks, selectedVariables, selectedFrequencies, allStations) => {
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
    filter(
      station => {
        return (
          (
            endDate === null ||
            !station.min_obs_time ||
            endDate >= station.min_obs_time
          ) &&
          (
            startDate === null ||
            !station.max_obs_time ||
            startDate <= station.max_obs_time
          ) &&
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
};
