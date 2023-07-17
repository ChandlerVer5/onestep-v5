import React from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { useAllStore, shallow } from '../store';

export default function Message() {
  const [messageData, showMessage] = useAllStore((state) => [state.messageData, state.showMessage], shallow);

  if (!messageData) return;

  const handleClose = (_e, reason) => {
    if (reason !== 'clickaway') {
      showMessage(null)
    }
  };

  return (
    <Snackbar
      key={messageData.key}
      open={!!messageData}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'center'
      }}
      autoHideDuration={3000}
      onClose={handleClose}
    >
      <Alert onClose={handleClose} variant="filled" severity={messageData.type}>
        {messageData.body}
      </Alert>
    </Snackbar>
  );
}
