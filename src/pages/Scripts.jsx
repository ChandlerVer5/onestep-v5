import React, { useState } from 'react';
import List from '@mui/material/List';
import ScriptItem from '../components/ScriptItem';

import { useAllStore, shallow } from '../store';
import { request } from '../utils/fetch';
import { TABS } from '../utils/constant';

/**
 * @description 已下载脚本 + 我创建的脚本
 */
export default function Scripts() {
  const [activeTab, featureDocs] = useAllStore(
    (state) => [state.activeTab, state.getFeatureDocs()[1]], shallow
  );
  const [showMessage, downloadScript] = useAllStore(
    (state) => [state.showMessage, state.downloadScript]
  );

  const [state, setState] = useState({
    updatedScriptIds: null
  })

  function init() {
    if (activeTab === TABS['DOWNLOADED']) {
      if (state.updatedScriptIds) return;
      const scriptIds = featureDocs.map(doc => doc.scriptId);
      if (0 === scriptIds.length) return;

      return request("/scripts/updated_at", {
        script_ids: scriptIds.join(",")
      }, "POST").then(scripts => {
        const updatedStamps = {};
        scripts.forEach(e => updatedStamps[e.id] = e.updated_at);
        const ids = featureDocs.filter(doc => doc?.versionAt !== updatedStamps?.[doc.scriptId]).map(e => e.scriptId);

        setState({
          ...state,
          updatedScriptIds: ids
        })
      })
    }
  }
  init()

  function downloadUpgradeScript(script) {
    downloadScript(script).then(success => {
      if (success) {
        const index = state.updatedScriptIds.indexOf(script.id);
        if (-1 === index) return;
        state.updatedScriptIds.splice(index, 1)
      }
    })
  }

  // 有更新时，更新脚本
  const handleUpgradeClick = (item) => {
    request("/scripts/" + item.scriptId).then(script => {
      openScriptEditor({
        featureDoc: {
          id: script.id,
          feature: JSON.parse(script.feature),
          script: script.script
        },
        upgrade: true,
        downloadScript: downloadUpgradeScript
      })
    }).catch(error => {
      showMessage(error.message, "error")
    })
  }

  return (
    featureDocs.length === 0
      ? <div className="onestep-empty">
        暂无数据
      </div>
      : <List>
        {
          featureDocs.map((doc) => (
            <ScriptItem
              key={doc.scriptId}
              item={doc}
              handleUpgradeClick={() => handleUpgradeClick(doc)}
              // 是否有更新
              isNewUpdate={
                doc.scriptId && state.updatedScriptIds?.includes(doc.scriptId)
              }
            />
          ))
        }
      </List>
  );
}
