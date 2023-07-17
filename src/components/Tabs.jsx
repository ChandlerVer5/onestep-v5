import React, { useEffect } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import DownloadDoneIcon from '@mui/icons-material/DownloadDone';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import HubIcon from '@mui/icons-material/Hub';
import { shallow, useAllStore } from '../store';
import { TABS } from '../utils/constant';

const TabButtons = [
  { icon: <HubIcon />, label: '脚本分享中心' },
  { icon: <DownloadDoneIcon />, label: '已下载的脚本' },
  { icon: <ManageAccountsIcon />, label: '我创建的脚本' }
];

function OnestepTabs() {
  const [activeTab, setActiveTab] = useAllStore((state) => [state.activeTab, state.setActiveTab], shallow);
  const onTabChange = (_event, tabIndex) => {
    setActiveTab(TABS[tabIndex]);
  };

  return (
    <Tabs
      className='onestep-tabs'
      value={activeTab}
      onChange={onTabChange}
      scrollButtons='auto'
    >
      {TabButtons.map(({ icon, label }) => (
        <Tab
          icon={icon}
          key={label}
          className='onestep-tab'
          iconPosition='start'
          label={label}
        />
      ))}
    </Tabs>
  );
}

export default OnestepTabs;
