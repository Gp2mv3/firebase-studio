import React from "react";

import Alert from "react-bootstrap/Alert";

export default ({ flash: { success, error } }) => {
  if (!success && !error) return null;
  return (
    <Alert variant={success ? "success" : "warning"}>{success || error}</Alert>
  );
};
