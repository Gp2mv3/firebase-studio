import React, { useEffect, useState } from "react";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";

import Table from '../components/Table';

import {getConfig} from '../services/configManager'

export default () => {

  const [users, setUsers] = useState([]);

  async function fetchList(fields, sort) {
    const { url, credentials } = await getConfig();

    const {users} = await fetch(`${url}/list`, {
      method: 'get',
      headers: { credentials }
    }).then(r => r.json());

    setUsers(users);
  }

  useEffect(function effect() {
    fetchList();
  }, []);

  return (
    <Container fluid>
      <Row>
        <Col><Button onClick={fetchList}>Fetch </Button></Col>
      </Row>

      <Row>
        <Col>
          <Table data={users}/>
        </Col>
      </Row>
    </Container>
  );
};
