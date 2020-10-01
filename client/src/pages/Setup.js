import React, {useState} from "react";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

import { useForm } from "react-hook-form";

import { storeConfig } from '../services/configManager'
import FlashMessage from '../components/FlashMessage'

export default () => {

  const [flash, setFlash] = useState({});

  function fetchList(fields, sort) {}

  const { register, handleSubmit, watch, errors } = useForm();
  const onSubmit = (data) => {
    console.log(data);

    var reader = new FileReader();
    reader.onload = (e) => {
      storeConfig(data.proxyAddress, e.target.result).then(() => setFlash({success: "Config stored !"}));
    };  
    reader.readAsText(data.configFile[0]);

  };

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

            <Form.Group controlId="configuration-key">
              <Form.Label>Configuration key</Form.Label>
              <Form.File
                label="Configuration file"
                name="configFile"
                custom
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
