import React, { useEffect, useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useAllStore, shallow } from '../store';
import './scriptargsdialog.style.scss';

export default function ScriptArgsDialog() {
  const [
    scriptArgsData,
    updateScriptArgs
  ] = useAllStore(state => [
    state.scriptArgsData,
    state.updateScriptArgs
  ], shallow)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (scriptArgsData !== null) {
      setOpen(true);
    }
  }, [scriptArgsData])

  const handleClose = () => {
    setOpen(false);
    updateScriptArgs(null)
  }

  // 设置后更新
  const handleOk = () => {
    scriptArgsData.scriptArgs = {};
    document.querySelectorAll(".script-args-dialog-form input").forEach((t => {
      scriptArgsData.scriptArgs[t.name] = t.value
    }));
    updateScriptArgs(scriptArgsData)
    // TODO 设置scriptArgsData，
    window.utools.db.put(scriptArgsData)
    handleClose()
  }


  return (
    <>
      {!!scriptArgsData && (
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle >
            脚本参数设置
          </DialogTitle>
          <DialogContent className="script-args-dialog-form">
            {Object.keys(scriptArgsData.scriptArgs).map((i) =>
              <div key={i}>
                <TextField
                  fullWidth
                  name={i}
                  label={i}
                  defaultValue={scriptArgsData.scriptArgs[i]}
                  variant="standard"
                />
              </div>
            )}
          </DialogContent>
          <DialogActions>
            <Button
              onClick={handleClose}
              color="primary"
            >
              取消
            </Button>
            <Button
              onClick={handleOk}
            >
              确定
            </Button>
          </DialogActions>
        </Dialog >
      )
      }
    </>
  );
}
