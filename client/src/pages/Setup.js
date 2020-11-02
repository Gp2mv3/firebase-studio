import React, { useEffect, useState } from "react";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import InputGroup from "react-bootstrap/InputGroup";

import { useForm } from "react-hook-form";

import { GrTrash } from 'react-icons/gr';

import { clearConfig, getConfig, storeConfig } from "../services/configManager";
import FlashMessage from "../components/FlashMessage";

export default () => {
  const [flash, setFlash] = useState({});

  const { register, handleSubmit, setValue } = useForm();
  const onSubmit = ({ proxyAddress, proxySecret }) => {
    storeConfig(proxyAddress, proxySecret).then(() =>
      setFlash({ success: "Config stored !" })
    );
  };

  const clearButtonClicked = () => {
    clearConfig();

    setValue("proxyAddress", "");
    setValue("proxySecret", "");

    setFlash({ success: "Config cleared !" });
  };

  useEffect(() => {
    getConfig().then(({ url, secret }) => {
      setValue("proxyAddress", url);
      setValue("proxySecret", secret);
    });
  }, []);

  return (
    <>
      <Container fluid>
        <Row>
          <Col>
            <h2>Setup proxy</h2>
            <Form onSubmit={handleSubmit(onSubmit)}>
              <Form.Group controlId="proxy-address">
                <Form.Label>Proxy Address</Form.Label>
                <InputGroup>
                  <Form.Control
                    type="text"
                    name="proxyAddress"
                    placeholder="http://localhost:8080"
                    ref={register}
                    required
                  />
                  <InputGroup.Append>
                    <InputGroup.Text>://</InputGroup.Text>
                  </InputGroup.Append>
                </InputGroup>
              </Form.Group>

              <Form.Group controlId="proxy-secret">
                <Form.Label>Proxy secret token</Form.Label>
                <Form.Control
                  type="password"
                  name="proxySecret"
                  placeholder=""
                  ref={register}
                />
              </Form.Group>

              <Button variant="primary" type="submit">
                Store config
              </Button>
            </Form>
          </Col>

          <Col lg="4">
            <Button variant="danger" onClick={clearButtonClicked} style={{color: "black"}}>
              <GrTrash /> Clear config
            </Button>

            <FlashMessage flash={flash} />

            <Alert variant="info">
              <p>
                Install a <a href="https://github.com/Gp2mv3/firebase-studio" target="_blank">Firebase Studio proxy</a> and configure it with your <a href="https://firebase.google.com/docs/admin/setup#initialize-sdk" target="_blank">Firebase Admin credentials</a>.
              </p>

              <p>
                Your proxy has to be accessible by your browser. Requests are
                sent directly to the URL. If your proxy is exposed to the web,
                use a strong secret key to ensure security and change it
                regularly.
              </p>

              <p>
                Your setup is stored in your browser (in <a href="https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage" target="_blank"> localStorage</a>).
              </p>
            </Alert>
          </Col>
        </Row>
      </Container>
    </>
  );
};
