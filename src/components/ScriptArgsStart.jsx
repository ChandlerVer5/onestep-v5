import React from "react";
import Paper from "@mui/material/Paper";
import FormControlLabel from '@mui/material/FormControlLabel';
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import Button from "@mui/material/Button";
import SendIcon from "@mui/icons-material/Send";
import "./scriptargsstart.style.scss"

export default function ScriptArgsStart({ data, showMessage }) {

  const { doc, enterPay } = data
  const handleSubmit = (e) => {
    const formData = new window.FormData(e.currentTarget);
    e.preventDefault();

    let script = doc.script;
    const scriptArgs = document.getElementById("args-save-checkbox").checked ? {} : null;

    for (const [key, value] of formData.entries()) {
      if (!value) {
        return showMessage(`"${key}" 未设置`, "error");
      }
      if (scriptArgs) {
        scriptArgs[key] = value;
      }
      script = script.replaceAll(`"{{${key}}}"`, JSON.stringify(value));
    }

    if (scriptArgs) {
      doc.scriptArgs = scriptArgs;
      window.utools.db.put(doc);
    }

    window.services.vmRunScript(script, enterPay);
  };

  return (
    <div className="script-args-body">
      <Paper>
        <Box onSubmit={handleSubmit} component="form">
          <h2>脚本参数设置</h2>
          {Object.keys(doc.scriptArgs).map((arg) => (
            <div key={arg}>
              <TextField
                fullWidth
                name={arg}
                label={arg}
                defaultValue={doc.scriptArgs[arg]}
                variant="standard"
              />
            </div>
          ))}
          <div>
            <FormControlLabel
              label="保存到我的脚本文档，下次直接使用"
              control={
                <Checkbox
                  id="args-save-checkbox"
                  defaultChecked
                />
              }
            />
          </div>
          <Button
            type="submit"
            disableFocusRipple
            fullWidth
            endIcon={<SendIcon />}
            variant="contained"
          >
            运行
          </Button>
        </Box>
      </Paper>
    </div>
  );
};
