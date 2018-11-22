import React, {Component} from 'react';
import { Grid } from 'react-bootstrap';

import logger from '../../logger';
import Header from '../Header';
import Portal from '../Portal';

import './App.css';

class App extends Component {
    render() {
        return (
            <Grid fluid className="App">
                <Header/>
                <Portal/>
            </Grid>
        );
    }
}

export default App;
