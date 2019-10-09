import React from 'react';
import ReactDOM from 'react-dom';
import ObservationCounts from '../ObservationCounts';

it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<ObservationCounts/>, div);
});

