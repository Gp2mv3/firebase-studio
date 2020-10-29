import React, { useEffect, useState } from "react";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

import { useForm } from "react-hook-form";

import { getConfig, storeConfig } from "../services/configManager";
import FlashMessage from "../components/FlashMessage";

export default () => {
  const [flash, setFlash] = useState({});

  const { register, handleSubmit, setValue } = useForm();
  const onSubmit = ({ proxyAddress, proxySecret }) => {
    storeConfig(proxyAddress, proxySecret).then(() =>
      setFlash({ success: "Config stored !" })
    );
  };

  useEffect(() => {
    getConfig().then(({ url, secret }) => {
      setValue("proxyAddress", url);
      setValue("proxySecret", secret);
    });
  }, []);

  return (
    <>
      <FlashMessage flash={flash} />

      <Container fluid>
        <Row>
          <Col>
            <Form onSubmit={handleSubmit(onSubmit)}>
              <Form.Group controlId="proxy-address">
                <Form.Label>Proxy Address</Form.Label>
                <Form.Control
                  type="text"
                  name="proxyAddress"
                  placeholder="localhost:8080"
                  ref={register}
                  required
                />
              </Form.Group>

              <Form.Group controlId="proxy-secret">
                <Form.Label>Proxy secret token</Form.Label>
                <Form.Control
                  type="password"
                  name="proxySecret"
                  placeholder=""
                  ref={register}
                  required
                />
              </Form.Group>

              <Button variant="primary" type="submit">
                Store config
              </Button>
            </Form>
          </Col>
        </Row>
      </Container>
    </>
  );
};
