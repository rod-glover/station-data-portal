import axios from 'axios';
import urljoin from 'url-join';


const SDS_URL = process.env.REACT_APP_SDS_URL;


export function getNetworks() {
  return axios.get(urljoin(SDS_URL, 'networks'));
}


export function getVariables() {
  return axios.get(urljoin(SDS_URL, 'variables'));
}


export function getStations(config) {
  return axios.get(
    urljoin(SDS_URL, 'stations'),
    config,
  );
}


export function getObservationCounts(config) {
  return axios.get(
    urljoin(SDS_URL, 'observations', 'counts'),
    config,
  );
}
