import React, { useEffect, useState } from "react";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

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
        <Col>
          <Table data={users} onFetch={fetchList}/>
        </Col>
      </Row>
    </Container>
  );
};
