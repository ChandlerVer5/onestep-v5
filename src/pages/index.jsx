import React, { useEffect, useState } from 'react';
import { Button, LinearProgress } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';

import Scripts from './Scripts';
import Hub from './Hub';
import HeadTabs from '../components/Tabs';
import { useAllStore, shallow } from '../store';
import './index.style.scss'

export default function() {
  const [activeTab, createScript, updateScriptsState] = useAllStore(state => [
    state.activeTab,
    state.createScript,
    state.updateScriptsState
  ], shallow)

  const [scripts, setScripts] = useState(null)

  useEffect(() => {
    // TODO
    window.utools.db.promises.allDocs("scripts/").then(scripts => {
      // const scripts = JSON.parse('[{"featurb0ce4f59dd4e0c"}]')
      setScripts(scripts)
      const cmds = window.utools.getFeatures().map(e => e.code);
      const idDoc = {}, downloadedScripts = [], customScripts = [];

      scripts.sort((e, t) => t.updateAt - e.updateAt).forEach(doc => {
        doc.scriptId && (idDoc[doc.scriptId] = doc);
        (doc.scriptId ? downloadedScripts : customScripts).push(doc)
      })

      updateScriptsState({
        downloadedScripts,
        customScripts,
        downloadedIdDic: idDoc,
        enabledFeatureCodes: cmds
      })
    })
  }, [])


  return (
    scripts ? <div className='onestep-main'>
      <Button
        className='onestep-create-btn'
        onClick={() => createScript()}
        size='small'
        variant='contained'
        startIcon={<AddIcon />}
      >
        创建自动化脚本
      </Button>
      <HeadTabs />
      <div className='onestep-page'>
        {
          activeTab === 0 ? (
            <Hub />
          ) : (
            <Scripts />
          )
        }
      </div>
    </div> : <LinearProgress />
  );
}
