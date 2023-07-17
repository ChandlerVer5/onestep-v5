import React from 'react';
import ListItem from '@mui/material/ListItem';
import Button from '@mui/material/Button';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Tooltip from '@mui/material/Tooltip';
import Avatar from '@mui/material/Avatar';
import ListItemText from '@mui/material/ListItemText';
import PageviewIcon from '@mui/icons-material/Pageview';
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import CycloneIcon from '@mui/icons-material/Cyclone';
import PermDataSettingIcon from '@mui/icons-material/PermDataSetting';
import NewReleasesIcon from '@mui/icons-material/NewReleases';
import Typography from '@mui/material/Typography';

import ItemStatus from './ScriptItemStatus';
import CMD from './CMD';
import './ScriptItem.style.scss';
import { getPlatForm } from '../utils';
import { TABS } from '../utils/constant';
import { useAllStore, shallow } from '../store';

/**
* @description 脚本列表项
* @examples
  featureDoc: {
    feature: {
      code: '118',
      explain: 'npm1s npm项目代码快速查看',
      cmds: [
        {
          label: "npmjs1s"
          match:{
              app: ['chrome.exe', 'Safari.app', 'Opera.app', 'Vivaldi.app', 'Brave Browser.app', 'Microsoft Edge.app', 'chrome', 'firefox']
              title: "/npm$/"
            },
          type: "window"
        }
      ],
      icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUK5CYII='
    },
    script: "utools.readCurrentBrowserUrl().then(npmView)"
    scriptId: 118 // means be downloaded
    versionAt: "2022-06-30 22:34:26" // means be downloaded
    updateAt: 1678372038895
    _id: "scripts/118"
    _rev: "1-f54a4bfbc30
  }
*/
export default function ScriptItem(props) {
  const [activeTab, downloadedIdDic] = useAllStore(state => [state.activeTab, state.downloadedIdDic], shallow)
  const [
    downloadScript,
    openScriptEditor,
    updateScriptArgs,
    updateDeleteAlert,
    createScript
  ] = useAllStore(state => [
    state.downloadScript,
    state.updateEditorData,
    state.updateScriptArgs,
    state.updateDeleteAlert,
    state.createScript
  ])

  // item is a featureDoc
  const { item, isNewUpdate, handleUpgradeClick } = props;

  // 查看当前脚本内容
  function openScriptViewer() {
    const script = downloadedIdDic[item.id];
    if (script) {
      if (script.versionAt !== item.updated_at) {
        openScriptEditor({
          featureDoc: item,
          upgrade: true,
          downloadScript,
        });
      } else {
        item.script = script.script;
        openScriptEditor({
          featureDoc: item
        })
      }
    }
    else {
      openScriptEditor({
        featureDoc: item,
        downloadScript,
      });
    }
  };

  // 点击查看/编辑源码
  const handleClick = () => openScriptEditor({
    featureDoc: item,
  })

  const handleDeleteClick = () => updateDeleteAlert(item)
  const handleCloneCreate = () => {
    createScript([JSON.parse(JSON.stringify(item.feature)), item.script]);
  };

  // TODO 导出按钮 该功能未实现
  const handleExportClick = () => {
    const featureDoc = {
      feature: item.feature,
      script: item.script
    };
    window.services.saveFileToDownloadFolder(
      item.feature.code + '.script.json',
      JSON.stringify(featureDoc, null, 4)
    );
  };

  // 设置脚本参数
  const handleScriptArgsClick = () => updateScriptArgs(item)

  // 点击当前项目
  const handleItemClick = (e) => {
    e.currentTarget.blur()
    openScriptViewer()
  };

  const Item = () => (<>
    <ListItemAvatar>
      <Avatar variant='square' src={item.feature.icon || 'logo.png'} />
    </ListItemAvatar>
    <ListItemText
      primary={
        <Typography component='div'>
          <CMD cmds={item.feature.cmds} />
        </Typography>
      }
      secondary={
        <Typography component='div' variant='body2'>
          <div>{item.feature.explain}</div>
          {activeTab === TABS["HUB"] ? (
            <div className='hubs-item-sub'>
              <div>
                分享者：<span>{item.nickname}</span>
              </div>
              <div>
                用户数：<span>{item.downloads}</span>
              </div>
              <div>
                分享时间：<span>{item.created_at}</span>
              </div>
            </div>
          ) : (
            <div className='scripts-item-sub'>
              {(item.feature.platform || ['win32', 'darwin', 'linux']).map(
                (platform) => (
                  <Tooltip
                    disableFocusListener
                    key={platform}
                    placement='top'
                    title={`可在 ${getPlatForm(platform)} 平台运行`}
                  >
                    <img draggable="false" src={'res/' + platform + '.png'} />
                  </Tooltip>
                )
              )}
              <Button
                disableFocusRipple
                onClick={handleClick}
                size='small'
                variant='text'
                color='inherit'
                startIcon={item.scriptId ? <PageviewIcon /> : <EditIcon />}
              >
                {item.scriptId ? '查看' : '编辑'}
              </Button>
              <Button
                disableFocusRipple
                onClick={handleDeleteClick}
                size='small'
                variant='text'
                color='inherit'
                startIcon={<DeleteForeverIcon />}
              >
                删除
              </Button>
              <Button
                disableFocusRipple
                onClick={handleCloneCreate}
                size='small'
                variant='text'
                color='inherit'
                startIcon={<CycloneIcon />}
              >
                拷贝创建
              </Button>
              {item.scriptArgs && (
                <Button
                  disableFocusRipple
                  onClick={handleScriptArgsClick}
                  size='small'
                  variant='text'
                  color='inherit'
                  startIcon={<PermDataSettingIcon />}
                >
                  脚本参数
                </Button>
              )}
              {item.scriptId && isNewUpdate && (
                <Button
                  disableFocusRipple
                  onClick={handleUpgradeClick}
                  size='small'
                  color="warning"
                  variant='text'
                  startIcon={<NewReleasesIcon />}
                >
                  有更新
                </Button>
              )}
            </div>
          )}
        </Typography>
      }
    />
  </>)


  const ActionStatus = () => <ItemStatus
    item={item}
    isHubTab={activeTab === TABS['HUB']}
    downloadedScript={downloadedIdDic[item.id]}
  />

  return (
    <ListItem
      disablePadding={activeTab === TABS['HUB']}
      alignItems='flex-start'
      secondaryAction={
        activeTab === TABS['HUB'] && <ActionStatus />
      }
    >
      {
        activeTab === TABS['HUB']
          ? (
            < ListItemButton alignItems='flex-start' onClick={handleItemClick}>
              <Item />
            </ListItemButton>
          ) : <Item />
      }
      {activeTab !== TABS['HUB'] && <ActionStatus />}
    </ListItem>
  );
}
