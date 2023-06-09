import React, { useState, useEffect } from "react";
import { Alert } from "@mui/material";
import { Snackbar } from "@mui/material";

interface Props {
  onClose?: () => void;
  errorMessage?: string;
}

const AlertComponent = ({ onClose, errorMessage }: Props) => {
  const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }

    if (onClose) onClose();
    close();
  };

  const close = () => {
    errorMessage = undefined;
  };

  return (
    <Snackbar
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
      open={errorMessage ? true : false} // Змінено значення open
      autoHideDuration={3000} // Змінено значення autoHideDuration
    >
      <Alert onClose={handleClose} severity="error">
        {errorMessage ? errorMessage : "Неправильно введені дані"}
      </Alert>
    </Snackbar>
  );
};

export default AlertComponent;
