import React, {Component} from 'react';
import { Grid } from 'react-bootstrap';
import { BrowserRouter as Router } from 'react-router-dom';
import { Navbar, Nav, NavItem } from 'react-bootstrap';
import { Route, Redirect, Switch } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';

import logger from '../../../logger';
import Header from '../Header/Header';

import PortalD from '../PortalD';
import PortalE from '../PortalE';

import './App.css';

const getLocation = url => {
  const a = window.document.createElement('a');
  a.href = url;
  return a;
};

const navSpec = [
  { label: 'Version A', path: 'A', component: PortalD },
  { label: 'Version B', path: 'B', component: PortalE },
];


export default class App extends Component {
    render() {
      const basePath = getLocation(process.env.PUBLIC_URL).pathname;
      return (
        <Router basename={`${basePath}/#`}>
          <div>
            <Navbar fluid>
              <Nav>
                {
                  navSpec.map(({label, path}) => (
                    <LinkContainer to={`/${path}`}>
                      <NavItem eventKey={path}>
                        {label}
                      </NavItem>
                    </LinkContainer>
                  ))
                }
              </Nav>
            </Navbar>

            <Grid fluid className="App">
                <Header/>
                <Switch>
                  {
                    navSpec.map(({path, component}) => (
                      <Route path={`/${path}`} component={component}/>
                    ))
                  }
                  <Redirect to={'/A'}/>
                </Switch>
            </Grid>
          </div>
        </Router>
        );
    }
}
