import React, { useEffect, useState } from "react";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import Table from '../components/Table';

import { fetchGet } from '../services/networkManager';
import { getConfig } from '../services/configManager';
import FlashMessage from "../components/FlashMessage";

export default () => {

  const [users, setUsers] = useState([]);
  const [flash, setFlash] = useState({});

  async function fetchList() {
    const { users } = await fetchGet(`user/list`);
    setUsers(users);
  }

  useEffect(function effect() {
    getConfig().then(({ isSetup }) => {
      if (!isSetup) return setFlash({error: "You didn't setup yur proxy. Use the Setup Proxy button in the upper right corner."});

      return fetchList();
    });
  }, []);

  return (
    <Container fluid>
      <Row>
        <Col>
          {flash.error ? <FlashMessage flash={flash} /> : <Table data={users} onFetch={fetchList}/>}
        </Col>
      </Row>
    </Container>
  );
};
