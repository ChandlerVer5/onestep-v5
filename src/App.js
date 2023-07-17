import React, { useEffect, useRef, useState } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { ThemeDic } from './utils/constant';
import Pages from './pages';
import ScriptViewer from './components/ScriptViewer';
import Message from './components/Message';
import DeleteAlert from './components/DeleteAlert';
import ScriptArgsDialog from './components/ScriptArgsDialog';
import ScriptArgsStart from './components/ScriptArgsStart';
import { useAllStore } from './store';
import './app.scss';

export default function App() {
  const [showMessage] = useAllStore((state) => [state.showMessage]);
  const [state, setState] = useState({
    theme: window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light',
    action: null // 进入哪个页面
  });
  const actionPay = useRef(null)

  useEffect(() => {
    window
      .matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', (e) => {
        setState({
          ...state,
          theme: e.matches ? 'dark' : 'light'
        });
        monaco.editor.setTheme(e.matches ? "vs-dark" : "vs")
      });

    // 每次进入时 -- 考虑进入的页面、需要配置参数的脚本
    window.utools.onPluginEnter(({ code, type, payload }) => {
      if (code.startsWith('setting')) {
        window.utools.setExpendHeight(560);
        actionPay.current = parseInt(code.split('-')[1] || 0);
        return setState({
          ...state,
          action: 'main'
        });
      }

      let script = '';
      const scriptDoc = window.utools.db.get("scripts/" + code);
      if (!scriptDoc) {
        window.utools.removeFeature(code)
        return window.utools.outPlugin();
      }
      if (scriptDoc.scriptArgs) {
        if (Object.values(scriptDoc.scriptArgs).includes("")) {
          window.utools.setExpendHeight(560)
          actionPay.current = {
            doc: scriptDoc,
            enterPay: {
              code,
              type,
              payload
            }
          }
          return setState({
            ...state,
            action: "scriptArgs"
          });
        }
        script = scriptDoc.script;
        for (const arg in scriptDoc.scriptArgs)
          script = script.replaceAll(`"{{${arg}}}"`, JSON.stringify(scriptDoc.scriptArgs[arg]))
      } else {
        script = scriptDoc.script;
      }
      window.services.vmRunScript(script, {
        code,
        type,
        payload
      })
    });

    window.utools.onPluginOut(() => {
      actionPay.current && (actionPay.current = null)
      if (state.action) {
        setState({
          ...state,
          action: null,
        })
        showMessage(null)
      }
    })

  }, []);

  const { action } = state
  return (
    //
    !!action && <ThemeProvider theme={ThemeDic[state.theme]}>
      {
        "main" === action && <Pages />
      }
      {
        "scriptArgs" === action && <ScriptArgsStart data={actionPay.current} showMessage={showMessage} />
      }
      {/* 删除确认 */}
      <DeleteAlert />
      {/* 脚本参数 */}
      <ScriptArgsDialog />
      {/* 源码弹窗 */}
      <ScriptViewer />
      {/* 信息提示 */}
      <Message />
    </ThemeProvider>
  );
}
