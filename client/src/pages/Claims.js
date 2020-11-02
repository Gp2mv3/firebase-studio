import React, { useEffect, useState } from "react";

import { useParams } from "react-router-dom";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";

import JSONInput from "react-json-editor-ajrm";
import locale from "react-json-editor-ajrm/locale/en";

import FlashMessage from '../components/FlashMessage';

import { fetchGet, fetchPost } from '../services/networkManager';

export default () => {
  const { id } = useParams();

  const [claims, setClaims] = useState({});
  const [canSend, setCanSend] = useState(false);
  const [formValue, setFormValue] = useState({});
  const [flash, setFlash] = useState({});


  async function fetchClaims() {
    const {
      user: { claims },
    } = await fetchGet(`user/${id}`);

    setClaims(claims);
    console.log(claims);
  }

  async function sendClaims() {
    setCanSend(false);
    try {
      await fetchPost(`user/${id}/claims`, {claims: formValue});
      setFlash({success: "Claims updated !"});
    }
    catch (e) {
      setFlash({error: e.message});
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
              height="200px"
              width="100%"
              onKeyPressUpdate={false}
              onChange={onChange}
            />
            <Button onClick={sendClaims} disabled={!canSend}>Update claims</Button>
          </Col>
        </Row>
        </Col>

        <Col lg="4">
          <FlashMessage flash={flash} />

          <Alert variant="info">
              <p>Set <a href="https://firebase.google.com/docs/auth/admin/custom-claims" target="_blank">Custom Claims</a> with this editor.</p>
              
              <p>Custom Claims cannot exceed 1000 bytes.</p>

              <p>Updating custom claims overrides the complete object and is irreversible.</p>
            </Alert>
        </Col>
      </Row>


    </Container>
  );
};
