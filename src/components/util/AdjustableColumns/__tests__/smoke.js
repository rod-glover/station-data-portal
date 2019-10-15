import React from 'react';
import ReactDOM from 'react-dom';
import AdjustableColumns from '../AdjustableColumns';

it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<AdjustableColumns/>, div);
});

