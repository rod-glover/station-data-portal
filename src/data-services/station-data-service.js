import axios from 'axios';
import urljoin from 'url-join';
import { flow, tap, identity, map, mapValues, isString } from 'lodash/fp';
import { mapDeep } from '../utils/fp';

const SDS_URL = process.env.REACT_APP_SDS_URL;


// Regex for ISO 8601 date strings; allows YYYY-MM-DD with optional T spec.
// Now you've got two problems :)
const ISO_8601 = /\d{4}-\d{2}-\d{2}(Td{2}:\d{2}:\d{2})?/;

function transformIso8601Date(value) {
  // If `value` is a string that matches the ISO 8601 date format,
  // transform it to a JS Date.
  // Otherwise return it unmolested.
  const isDateString = isString(value) && ISO_8601.test(value);
  return isDateString ?
    new Date(Date.parse(value)) :
    value
}


export function getNetworks() {
  return axios.get(urljoin(SDS_URL, 'networks'));
}


export function getVariables() {
  return axios.get(urljoin(SDS_URL, 'variables'));
}


export function getStations(config) {
  return axios.get(
    urljoin(SDS_URL, 'stations'),
    {
      transformResponse: axios.defaults.transformResponse.concat(
        mapDeep(transformIso8601Date)
        // map(mapValues(transformIso8601Date))
      ),
      ...config,
    },
  );
}


export function getObservationCounts(config) {
  return axios.get(
    urljoin(SDS_URL, 'observations', 'counts'),
    config,
  );
}
