import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

import {
  Navbar,
  Nav,
  Container,
  Row,
  Col,
  Form,
  FormControl,
  Button,
} from "react-bootstrap";

import { LinkContainer } from "react-router-bootstrap";

import List from "./pages/List";
import Setup from "./pages/Setup";
import Claims from "./pages/Claims";
import User from "./pages/User";

function App() {
  return (
    <Router>
      <div id="wrapper">
        {/*
        
        Sidebar

        <ul
          class="navbar-nav bg-gradient-dark sidebar sidebar-dark accordion"
          id="accordionSidebar"
        >
          <a
            class="sidebar-brand d-flex align-items-center justify-content-center"
            href="/"
          >
            <div class="sidebar-brand-text mx-3">Firebase Studio</div>
          </a>

          <hr class="sidebar-divider my-0" />
        </ul>*/}

        <div id="content-wrapper" class="d-flex flex-column">
          <div id="content">
            <Navbar bg="primary" variant="dark">
              <Nav className="mr-auto"></Nav>

              <Nav>
                <LinkContainer to="/setup">
                  <Nav.Link>Setup</Nav.Link>
                </LinkContainer>
              </Nav>
            </Navbar>

            <Container flex>
              <Switch>
                <Route path="/setup">
                  <Setup />
                </Route>

                <Route path="/user/:id">
                  <User />
                </Route>

                <Route path="/claims/:id">
                  <Claims/>
                </Route>

                <Route path="/">
                  <List />
                </Route>

              </Switch>
            </Container>
          </div>

{ /* Footer
          <footer class="sticky-footer bg-white">
            <div class="container my-auto">
              <div class="copyright text-center my-auto">
                <span>Copyright &copy; Your Website 2020</span>
              </div>
            </div>
          </footer>
 */}

        </div>
      </div>
    </Router>
  );
}

export default App;
