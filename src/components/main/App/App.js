import React, {Component} from 'react';
import { Grid } from 'react-bootstrap';
import { BrowserRouter as Router } from 'react-router-dom';
import { Navbar, Nav, NavItem } from 'react-bootstrap';
import { Route, Redirect, Switch } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';

import logger from '../../../logger';
import Header from '../Header/Header';

import PortalA from '../PortalA';
import PortalB from '../PortalB';
import PortalC from '../PortalC';
import PortalD from '../PortalD';
import PortalE from '../PortalE';

import './App.css';

const navSpec = [
  { label: 'Version A', path: 'A', component: PortalA },
  { label: 'Version B', path: 'B', component: PortalB },
  { label: 'Version C', path: 'C', component: PortalC },
  { label: 'Version D', path: 'D', component: PortalD },
  { label: 'Version E', path: 'E', component: PortalE },
];


export default class App extends Component {
    render() {
        return (
          <Router basename={'/#'}>
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
                    <Redirect to={'/E'}/>
                  </Switch>
              </Grid>
            </div>
          </Router>
        );
    }
}
