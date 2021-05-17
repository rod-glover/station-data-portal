import React from 'react';
import ReactDOM from 'react-dom';
import StationPopup from '../StationPopup';

const station =   {
  "histories": [
      {
          "country": null,
          "edate": null,
          "elevation": 1430.0,
          "freq": "hourly",
          "id": 33,
          "lat": 60.5992,
          "lon": -136.208,
          "province": "YT",
          "sdate": null,
          "station_name": "Kusawa",
          "tz_offset": null,
          "uri": "/histories/33",
          "variable_uris": []
      }
  ],
  "id": 37,
  "max_obs_time": null,
  "min_obs_time": null,
  "native_id": "YPKU",
  "network_uri": "/networks/8",
  "uri": "/stations/37"
};

const network =     {
  "color": "#ff0000",
  "id": 2,
  "long_name": "Environment and Climate Change Canada",
  "name": "ECCC",
  "publish": true,
  "uri": "/networks/2",
  "virtual": null
};

it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(
      <StationPopup
        station={station}
        network={network}
        variables={[]}
      />,
      div
    );
});

