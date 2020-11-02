import React, { useEffect, useState } from "react";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";

import { GrRefresh } from 'react-icons/gr';

import Table from '../components/Table';

import { fetchGet } from '../services/networkManager';

export default () => {

  const [users, setUsers] = useState([]);

  async function fetchList(fields, sort) {
    const { users } = await fetchGet(`user/list`);
    setUsers(users);
  }

  useEffect(function effect() {
    fetchList();
  }, []);

  return (
    <Container fluid>
      <Row>
        <Col><Button onClick={fetchList}><GrRefresh /> Fetch </Button></Col>
      </Row>

      <Row>
        <Col>
          <Table data={users}/>
        </Col>
      </Row>
    </Container>
  );
};
