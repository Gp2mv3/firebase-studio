import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import {
  Navbar,
  Nav,
  Container,
  Row,
  Col,
  NavbarBrand
} from "react-bootstrap";

import { LinkContainer } from "react-router-bootstrap";
import { GrTroubleshoot, GrUnorderedList } from 'react-icons/gr';

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
              <Container>
                <LinkContainer to="/">
                  <NavbarBrand>
                    Firebase Studio
                  </NavbarBrand>
                </LinkContainer>

                <Nav>
                  <LinkContainer to="/" exact>
                    <Nav.Link><GrUnorderedList /> User list</Nav.Link>
                  </LinkContainer>
                </Nav>

                <Nav className="mr-auto"></Nav>

                <Nav>
                  <LinkContainer to="/setup" exact>
                    <Nav.Link><GrTroubleshoot /> Setup Proxy</Nav.Link>
                  </LinkContainer>
                </Nav>
              </Container>
            </Navbar>

            <Container id="mainPageContainer">
              <Switch>
                <Route path="/setup">
                  <Setup />
                </Route>

                <Route path="/user/:id">
                  <User />
                </Route>

                <Route path="/claims/:id">
                  <Claims />
                </Route>

                <Route path="/">
                  <List />
                </Route>
              </Switch>
            </Container>
          </div>

          <footer class="sticky-footer">
            <Container className="text-center my-auto">
              <Row>
                <Col>
                  <hr />
                  <span>
                    Made by{" "}
                    <a href="https://gp2mv3.com" target="_blank">
                      Gp2mv3
                    </a>{" "}
                    - The code is on{" "}
                    <a
                      href="https://github.com/Gp2mv3/firebase-studio"
                      target="_blank"
                    >
                      Github
                    </a>
                  </span>
                </Col>
              </Row>
            </Container>
          </footer>
        </div>
      </div>
    </Router>
  );
}

export default App;
