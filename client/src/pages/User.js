import React, { useEffect, useState } from "react";

import { useParams } from "react-router-dom";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Button from "react-bootstrap/Button";
import { Alert } from "react-bootstrap";

import { GrRefresh } from 'react-icons/gr';
import { useForm } from "react-hook-form";
import locale from "react-json-editor-ajrm/locale/en";

import FlashMessage from '../components/FlashMessage';

import { fetchGet, fetchPost } from "../services/networkManager";

export default () => {
  const { id } = useParams();

  const [user, setUser] = useState(undefined);
  const [canSend, setCanSend] = useState(false);
  const [flash, setFlash] = useState({});
  const { register, handleSubmit, watch, errors } = useForm();

  async function fetchUser() {
    const { user } = await fetchGet(`user/${id}`);

    console.log({ user });
    setUser(user);
    setCanSend(true);
  }

  const onSubmit = async ({
    sendVerificationEmail,
    askPasswordReset,
    passwordCheck,
    ...user
  }) => {
    setCanSend(false);

    try {
      await fetchPost(`user/${id}`, { user, sendVerificationEmail });
      setFlash({ success: "User updated !" });
    } catch (e) {
      setFlash({ error: e.message });
    }

    setCanSend(true);
  };

  useEffect(() => {
    fetchUser();
  }, [id]);

  return (
    <Container fluid>
      <Row>
        <Col>
          <h2>Edit user info</h2>
          {!!user && (
            <Form onSubmit={handleSubmit(onSubmit)}>
              <Form.Group controlId="displayName">
                <Form.Label>Display Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Display Name"
                  defaultValue={user.displayName}
                  name="displayName"
                  ref={register}
                />
              </Form.Group>

              <Form.Group controlId="email">
                <Form.Label>Email address</Form.Label>
                <InputGroup>
                  <Form.Control
                    type="email"
                    placeholder="Email address"
                    defaultValue={user.email}
                    name="email"
                    ref={register}
                  />
                  <InputGroup.Append>
                    <InputGroup.Text>@</InputGroup.Text>
                  </InputGroup.Append>
                </InputGroup>
                {/*
                <Form.Check
                  type="checkbox"
                  label="Send verification email (after change)"
                  name="sendVerificationEmail"
                  defaultChecked={user.emailVerified}
                  ref={register}
                  style={{
                    display: user.email !== watch("email") ? "block" : "none",
                  }}
                /> 
                */}
                <Form.Check
                  type="checkbox"
                  label="Verified email address"
                  name="emailVerified"
                  defaultChecked={user.emailVerified}
                  ref={register}
                  style={{
                    // display: user.email !== watch("email") ? "none" : "block",
                  }}
                />
              </Form.Group>

              <Form.Group controlId="phone">
                <Form.Label>Phone number</Form.Label>
                <InputGroup>
                  <Form.Control
                    type="tel"
                    placeholder="Phone number"
                    defaultValue={user.phoneNumber}
                    name="phoneNumber"
                    ref={register}
                  />
                  <InputGroup.Append>
                    <InputGroup.Text>#</InputGroup.Text>
                  </InputGroup.Append>
                </InputGroup>
              </Form.Group>

              <Form.Group controlId="photoURL">
                <Form.Label>Photo URL</Form.Label>
                <InputGroup>
                  <Form.Control
                    type="url"
                    placeholder="Photo URL"
                    defaultValue={user.photoURL}
                    name="photoURL"
                    ref={register}
                  />
                  <InputGroup.Append>
                    <InputGroup.Text>://</InputGroup.Text>
                  </InputGroup.Append>
                </InputGroup>
              </Form.Group>

              <hr />
              <Form.Group controlId="password">
                <Form.Label>New password</Form.Label>
                <Row>
                  <Col>
                    <Form.Control
                      type="password"
                      placeholder="Password"
                      name="password"
                      ref={register}
                    />
                  </Col>
                  <Col>
                    <Form.Control
                      type="password"
                      placeholder="Repeat password"
                      name="passwordCheck"
                      ref={register({
                        validate: (v) => v === watch("password"),
                      })}
                    />
                  </Col>
                </Row>
                {/*
                  <Form.Check
                  type="checkbox"
                  label="Send password reset email"
                  name="askPasswordReset"
                  ref={register}
                /> 
                */}
              </Form.Group>

              <Form.Group controlId="photoURL">
                <Form.Label>Disable user</Form.Label>
                <Form.Check
                  type="checkbox"
                  label="User is disabld (Cannot use your app while disabled)"
                  name="disabled"
                  defaultChecked={user.disabled}
                  ref={register}
                />
              </Form.Group>

              {errors.exampleRequired && <span>This field is required</span>}

              <Button type="submit" disabled={!canSend}>
                Update user
              </Button>
            </Form>
          )}
        </Col>

        <Col lg="4">
          <Button onClick={fetchUser}><GrRefresh /> Refresh form</Button>
          
          <FlashMessage flash={flash} />

          <Alert variant="info">
            <p>All user properties are optional.</p>

            <p>
              If a certain property is not specified (field is empty), the value
              for that property will be deleted.
            </p>

            <p>Old values are lost after you update a user.</p>
          </Alert>
        </Col>
      </Row>
    </Container>
  );
};
