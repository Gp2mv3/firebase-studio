import React, { useEffect, useState } from "react";

import { useParams } from "react-router-dom";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";

import locale from "react-json-editor-ajrm/locale/en";

import { getConfig } from "../services/configManager";
import { Alert } from "react-bootstrap";

export default () => {
  const { id } = useParams();

  const [user, setUser] = useState(undefined);
  const [canSend, setCanSend] = useState(false);
  const [formValue, setFormValue] = useState({});
  const [flash, setFlash] = useState(null);


  async function fetchUser() {
    const { url, credentials } = await getConfig();

    const {
      user,
    } = await fetch(`${url}/user/${id}`, {
      method: "get",
      headers: { credentials },
    }).then((r) => r.json());

    setUser(user);
    console.log(user);
  }

  async function sendUser() {
    setCanSend(false);
    const { url, credentials } = await getConfig();

    try {
      const result = await fetch(`${url}/user/${id}/claims`, {
        method: "post",
        body: JSON.stringify({user}),
        headers: { credentials, 'Content-Type': 'application/json' },
      }).then((r) => r.json());
      setFlash({success: true});
    }
    catch (e) {
      setFlash({success: false, message: e.message});
    }
  }


  

  useEffect(() => {
    fetchUser();
  }, [id]);

  return (
    <Container fluid>
       <Row>
        <Col>
          {!!flash && <Alert variant={flash.success ? "success" : 'warning'}>{flash.message || "Claims updated !"}</Alert>}

        </Col>
      </Row>

      <Row>
        <Col>
          <Button onClick={fetchUser}>Refresh </Button>
        </Col>
      </Row>


      <Row>
        <Col>
         {!!user && JSON.stringify(user)}
         
          <Button onClick={sendUser} disabled={!canSend}>Update user</Button>
        </Col>
      </Row>
    </Container>
  );
};
