import React, { useEffect, useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import { useAllStore, shallow } from '../store';

export default function DeleteAlert() {
  const [
    deleteData,
    featureDocs,
    downloadedIdDic,
    enabledFeatureCodes,
    updateScriptsState,
    showMessage,
    updateDeleteAlert
  ] = useAllStore(state => ([
    state.deleteData,
    state.getFeatureDocs(),
    state.downloadedIdDic,
    state.enabledFeatureCodes,
    state.updateScriptsState,
    state.showMessage,
    state.updateDeleteAlert
  ]), shallow)

  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (deleteData !== null) {
      setOpen(true);
    }
  }, [deleteData])


  const handleClose = () => {
    setOpen(false);
    updateDeleteAlert(null)
  }

  // 删除后更新
  const handleDeleteItem = () => {
    if (!deleteData) return;
    if (window.utools.db.remove(deleteData).error)
      return showMessage("删除失败", "error");

    const { code } = deleteData.feature;
    if (enabledFeatureCodes.includes(code)) {
      window.utools.removeFeature(code)
      enabledFeatureCodes.splice(enabledFeatureCodes.indexOf(code), 1)
    }
    featureDocs[1].splice(featureDocs[1].indexOf(deleteData), 1)
    deleteData.scriptId && delete downloadedIdDic[deleteData.scriptId]

    updateScriptsState({
      downloadedIdDic,
      enabledFeatureCodes,
      [featureDocs[0]]: featureDocs[1]
    })
    updateDeleteAlert(null)
  }


  return (
    <>
      {!!deleteData && (
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle >
            确定要删除该条自动化脚本吗？
          </DialogTitle>
          <DialogActions>
            <Button
              disableFocusRipple
              onClick={handleClose}
              color="primary"
            >
              取消
            </Button>
            <Button
              disableFocusRipple
              onClick={handleDeleteItem}
              color="secondary"
            >
              删除
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
}
