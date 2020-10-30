import React from "react";
import { Modal, Button } from "react-bootstrap";

export default function ConfirmModal({ onClose, show, isDelete, userID }) {
  return (
    <>
      <Modal show={show} onHide={() => onClose(false)} backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>
            Are you sure you want to {isDelete ? "delete" : "disable"} this user?
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {isDelete
            ? `Deleting ${userID} is irreversible. Are you sure you want to continue ?`
            : `${userID}, will not be able to log-in while disabled.`}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => onClose(false)}>
            No, go back
          </Button>
          <Button variant="danger" onClick={() => onClose(true)}>
            Yes, continue
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
