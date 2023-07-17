import React from 'react';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Switch from '@mui/material/Switch';

import GetAppIcon from '@mui/icons-material/GetApp';
import NewReleasesIcon from '@mui/icons-material/NewReleases';
import DoneIcon from '@mui/icons-material/Done';

import './ScriptItem.style.scss';
import { useAllStore, shallow } from '../store';

/**
* @description 列表项最右侧的状态：是否下载；是否启用
*/
export default function ItemStatus(props) {

  const [
    enabledFeatureCodes,
    updateScriptsState,
    downloadScript
  ] = useAllStore(state => [
    state.enabledFeatureCodes,
    state.updateScriptsState,
    state.downloadScript
  ], shallow)

  const { item, isHubTab, downloadedScript } = props
  // 是否启用了该脚本功能
  const isEnabled = enabledFeatureCodes.includes(item.feature.code)

  function _enableFeature(feature, enabled) {
    if (enabled) {
      window.utools.setFeature(feature) && !enabledFeatureCodes.includes(feature.code) && enabledFeatureCodes.push(feature.code);
    } else {
      window.utools.removeFeature(feature.code);
      const index = enabledFeatureCodes.indexOf(feature.code)
      if (-1 === index) return;
      enabledFeatureCodes.splice(index, 1);
    }
    updateScriptsState({
      enabledFeatureCodes
    })
  }

  /**
  * @description 启用该脚本
  */
  const handleSwitchChange = (e) => {
    _enableFeature(item.feature, e.target.checked);
  };

  return (
    <>
      {isHubTab ? (
        downloadedScript ? (
          downloadedScript?.versionAt !== item.updated_at ? (
            <Tooltip placement='left' title='有更新'>
              <NewReleasesIcon color='warning' />
            </Tooltip>
          ) : (
            <Tooltip placement='left' title='已下载'>
              <DoneIcon color='success' />
            </Tooltip>
          )
        ) : (
          <Tooltip placement='left' title='下载使用'>
            <IconButton
              disableFocusRipple
              color="primary"
              onClick={(e) => {
                e.currentTarget.blur()
                downloadScript(item)
              }}
              edge="end"
            >
              <GetAppIcon />
            </IconButton>
          </Tooltip>
        )
      ) : (
        <Tooltip
          disableFocusListener
          placement='left'
          title={isEnabled ? '停用' : '启用'}
        >
          <Switch
            color='primary'
            checked={isEnabled}
            onChange={handleSwitchChange}
            edge='end'
          />
        </Tooltip>
      )}
    </>
  );
}
