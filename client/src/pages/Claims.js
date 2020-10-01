import React, { useEffect, useState } from "react";

import { useParams } from "react-router-dom";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";

import JSONInput from "react-json-editor-ajrm";
import locale from "react-json-editor-ajrm/locale/en";

import { getConfig } from "../services/configManager";
import { Alert } from "react-bootstrap";

export default () => {
  const { id } = useParams();

  const [claims, setClaims] = useState({});
  const [canSend, setCanSend] = useState(false);
  const [formValue, setFormValue] = useState({});
  const [flash, setFlash] = useState(null);


  async function fetchClaims() {
    const { url, credentials } = await getConfig();

    const {
      user: { claims },
    } = await fetch(`${url}/user/${id}`, {
      method: "get",
      headers: { credentials },
    }).then((r) => r.json());

    setClaims(claims);
    console.log(claims);
  }

  async function sendClaims() {
    setCanSend(false);
    const { url, credentials } = await getConfig();

    try {
      const result = await fetch(`${url}/user/${id}/claims`, {
        method: "post",
        body: JSON.stringify({claims: formValue}),
        headers: { credentials, 'Content-Type': 'application/json' },
      }).then((r) => r.json());
      setFlash({success: true});
    }
    catch (e) {
      setFlash({success: false, message: e.message});
    }
  }


  async function onChange(content) {
    if (!content.error && content.jsObject) {
      setCanSend(true);
      return setFormValue(content.jsObject);
    }     
    setCanSend(false);
  }

  useEffect(() => {
    fetchClaims();
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
          <Button onClick={fetchClaims}>Refresh </Button>
        </Col>
      </Row>


      <Row>
        <Col>
          <JSONInput
            id="claimEditor"
            theme="light_mitsuketa_tribute"
            placeholder={claims}
            locale={locale}
            height="150px"
            onKeyPressUpdate={false}
            onChange={onChange}
          />
          <Button onClick={sendClaims} disabled={!canSend}>Update claims</Button>
        </Col>
      </Row>
    </Container>
  );
};
