import React, { useEffect, useState } from "react";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Link, Redirect } from "react-router-dom";

import { getConfig } from "../services/configManager";

export default () => {
  const [redirect, setRedirect] = useState(false);

  useEffect(function effect() {
    getConfig().then(({ isSetup }) =>  setRedirect(isSetup));
  }, []);

  if (redirect) return (<Redirect to="/list" />)

  return (
    <Container fluid>
      <Row>
        <Col>
          <h2>Welcome to Firebase Studion</h2>
          <p>
            Firebase Studio is composed of two components:
            <ul>
              <li>
                The Client (in your browser, actually, you are in front of it)
              </li>
              <li>The Proxy (backend connected to your Firebase account)</li>
            </ul>
          </p>

          <p>
            To use Firebase Studio, you need to setup the proxy on your server
            or locally. The proxy will connect to Firebase, using your Firebase
            Credentials and will proxy requests from the Client.
          </p>

          <p>
            To setup your proxy, follow the guide in the{" "}
            <a href="https://github.com/Gp2mv3/firebase-studio" target="_blank">
              Firebase Studio doc
            </a>
            , then <Link to="/setup">configure it in the client</Link>.
          </p>
        </Col>
      </Row>
    </Container>
  );
};
