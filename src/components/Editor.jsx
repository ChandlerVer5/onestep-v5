import React, { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api'
import '@vscode/codicons/dist/codicon.ttf'
import utoolsLib from '../data/utools.d.ts'

monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
  noSemanticValidation: true,
  noSyntaxValidation: false
})
monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
  target: monaco.languages.typescript.ScriptTarget.ES2020,
  noLib: true,
  allowNonTsExtensions: true
})
monaco.languages.typescript.javascriptDefaults.addExtraLib(utoolsLib, "ts:filename/global.d.ts");

const MonacoEditor = forwardRef((props, editorRef) => {
  const editorDOMRef = useRef(null);
  let codeEditor = null;

  const onResize = () => {
    codeEditor?.layout();
  };

  useImperativeHandle(editorRef, () => ({
    el: editorDOMRef.current,
    getValue: () => codeEditor.getValue(),
    setValue: (value) => codeEditor.setValue(value),
  }), []);

  useEffect(() => {
    window.addEventListener('resize', onResize);
    if (editorDOMRef.current) {
      codeEditor = monaco.editor.create(editorDOMRef.current, {
        language: 'javascript',
        theme: window.matchMedia('(prefers-color-scheme: dark)').matches
          ? 'vs-dark'
          : 'vs',
        tabSize: 2,
        minimap: {
          enabled: false
        },
        links: true, // 是否点击链接
        contextmenu: false,
        lineNumbers: "off",
        lineDecorationsWidth: 0,
        readOnly: props.readOnly,
        foldingStrategy: 'indentation', // 代码可分小段折叠
        automaticLayout: true, // 自适应布局
        overviewRulerBorder: false, // 不要滚动条的边框
        scrollBeyondLastLine: false, // 取消代码后面一大段空白
        useTabStops: false,
        // fontSize: 13, //字体大小
        autoIndent: true, //自动布局
        quickSuggestionsDelay: 100, //代码提示延时
      });

      // TODO 打开时，自动 focus
      props.readOnly || codeEditor.focus();
    }
    return () => {
      window.removeEventListener('resize', onResize);
    };
  }, [props.readOnly]);

  return <div ref={editorDOMRef} className='code-editor'></div>;
});

export default MonacoEditor;
