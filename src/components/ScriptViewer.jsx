import React, { useEffect, useRef, useState } from 'react';
import { Dialog, Slide, Button } from '@mui/material';
import {
  Save as SaveIcon,
  Close as CloseIcon,
  CreateSharp as CreateSharpIcon,
  DownloadForOfflineOutlined as DownloadForOfflineOutlinedIcon
} from '@mui/icons-material';

import FeatureForm from './FeatureForm';
import MonacoEditor from './Editor';
import './ScriptViewer.style.scss';
import { request } from '../utils/fetch';
import { formatArgs, openUrlFromEditor } from '../utils';
import { useAllStore, shallow } from '../store';

const Transition = React.forwardRef((props, ref) => <Slide direction='left' ref={ref} {...props} />);

/**
* @description 源码编辑弹窗
*/
export default function ScriptViewer() {
  const [editorData, showMessage] = useAllStore((state) => [state.editorData, state.showMessage], shallow);
  const [open, setOpen] = useState(false);

  const editorRef = useRef(null);
  const featureFormRef = useRef(null);


  useEffect(() => {
    if (editorData !== null) {
      setTimeout(() => {
        editorRef.current.el.addEventListener('click', openUrlFromEditor)
      });


      setOpen(true);
      const { featureDoc } = editorData;

      if (featureDoc._id) {
        if (featureDoc.script) {
          setTimeout(() => {
            editorRef.current.setValue(featureDoc.script);
          });
        }
      } else if (featureDoc.id) {
        if (featureDoc.script) {
          setTimeout(() => {
            editorRef.current.setValue(featureDoc.script);
          });
        } else {
          request('/scripts/' + featureDoc.id)
            .then((res) => {
              featureDoc.script = res.script;
              editorRef.current.setValue(res.script);
            })
            .catch(error => {
              showMessage(error.message, 'error');
            });
        }
      }
    }
  }, [editorData]);

  // 保存/创建脚本
  const handleSubmit = () => {
    if (!editorData.featureDoc._id) return;
    // 获取 features
    const feature = featureFormRef.current?.getData();
    if (!feature) return;

    const scriptCode = editorRef.current?.getValue();
    const needFeatureUpdate =
      !editorData.featureDoc._rev ||
      JSON.stringify(editorData.featureDoc.feature) !== JSON.stringify(feature);

    if (!needFeatureUpdate && editorData.featureDoc.script === scriptCode) {
      return setOpen(false);
    }
    const featureDoc = {
      ...editorData.featureDoc,
      feature: feature,
      script: scriptCode,
      updateAt: Date.now()
    };
    formatArgs(featureDoc, scriptCode);

    const dbState = window.utools.db.put(featureDoc);
    if (dbState.error) return showMessage('保存失败：' + dbState.message, 'error');
    featureDoc._rev = dbState.rev;
    if (needFeatureUpdate && (dbState.rev.startsWith('1-') || editorData.isEnabled)) {
      window.utools.setFeature(feature);
    }
    editorData.submitCallback(featureDoc);
    setOpen(false);
  };

  // 下载脚本
  const handleDownloadClick = () => {
    // if(editorData.upgrade) {}
    setOpen(false);
    editorData.downloadScript(editorData.featureDoc);
  };


  if (!editorData) return;
  const { readOnly } = editorData;

  return (
    <Dialog
      fullScreen
      open={open}
      onClose={() => setOpen(false)}
      TransitionComponent={Transition}
    >
      <div className='script-dialog-body'>
        <MonacoEditor readOnly={readOnly} ref={editorRef} />
        <div>
          <FeatureForm
            ref={featureFormRef}
            disabled={readOnly}
            data={editorData.featureDoc.feature}
          />
          <div className='script-dialog-handle'>
            <Button
              disableFocusRipple
              fullWidth
              onClick={() => setOpen(false)}
              color='secondary'
              variant='contained'
              startIcon={<CloseIcon />}
            >
              关闭
            </Button>
            {!readOnly &&
              <Button
                disableFocusRipple
                fullWidth
                onClick={handleSubmit}
                color='primary'
                variant='contained'
                startIcon={<SaveIcon />}
              >
                {editorData.featureDoc._rev ? '保存' : '创建'}
              </Button>
            }
            {readOnly && editorData.downloadScript && (
              <Button
                disableFocusRipple
                fullWidth
                onClick={handleDownloadClick}
                variant='contained'
                color={editorData.upgrade ? 'warning' : 'primary'}
                startIcon={<DownloadForOfflineOutlinedIcon />}
              >
                {editorData.upgrade ? '更新' : '下载'}
              </Button>
            )}
            {readOnly && editorData.downloadScript && (
              <Button
                disableFocusRipple
                fullWidth
                onClick={() => { }}
                variant='contained'
                color={editorData.upgrade ? 'warning' : 'primary'}
                startIcon={<CreateSharpIcon />}
              >
                创建
              </Button>
            )}
            {/*readOnly && editorData.approvalCallback && (
              <Fragment>
                <Button disableFocusRipple onClick={handleApprovalClick} color="info" variant="contained">
                  审核
                </Button>
                <ApprovalMessage approvalData={approvalData} showMessage={showMessage} />
              </Fragment>
            )*/}
          </div>
        </div>
      </div>
    </Dialog>
  );
}
