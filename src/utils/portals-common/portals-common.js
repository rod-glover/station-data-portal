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
      }
    ),
  )(allStations);
};
