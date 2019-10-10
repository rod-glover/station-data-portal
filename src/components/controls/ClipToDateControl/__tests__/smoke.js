import React from 'react';
import ReactDOM from 'react-dom';
import ClipToDateControl from '../ClipToDateControl';

it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<ClipToDateControl/>, div);
});

