import React from 'react';
import ReactDOM from 'react-dom';
import StationMetadata from '../StationMetadata';

jest.mock('../../../data-services/weather-anomaly-data-service');

it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<StationMetadata/>, div);
});

