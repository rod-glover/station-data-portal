import axios from 'axios';
import urljoin from 'url-join';


const SDS_URL = process.env.REACT_APP_SDS_URL;


export function getNetworks() {
  return axios.get(urljoin(SDS_URL, 'networks'));
}


export function getVariables() {
  return axios.get(urljoin(SDS_URL, 'variables'));
}


export function getStations(params) {
  return axios.get(
    urljoin(SDS_URL, 'stations'),
    {
      params,
    },
  );
}