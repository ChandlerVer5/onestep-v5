import React, { useState } from "react";
import Tabs from '@mui/material/Tabs';
import Tab from "@mui/material/Tab"
import DownloadDoneIcon from '@mui/icons-material/DownloadDone';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import HubIcon from '@mui/icons-material/Hub';


const API = "https://open.u-tools.cn";

const TabButtons = [
  { icon: <HubIcon />, label: "脚本分享中心" },
  { icon: <DownloadDoneIcon />, label: "已下载的脚本" },
  { icon: <ManageAccountsIcon />, label: "我创建的脚本" }
]

function OnestepTabs() {

  const [tabValue, setTabValue] = useState(0)


  const onTabChange = (_event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Tabs
      className='onestep-tabs'
      value={tabValue}
      onChange={onTabChange}
      scrollButtons="auto"
    >
      {TabButtons.map(({ icon, label }) => <Tab icon={icon} key={label} className="onestep-tab" iconPosition="start" label={label} />)}
    </Tabs>
  )
}

export default OnestepTabs
