/**
  function ms({cmds: t}) {
  return t.map(((t,i)=>e.createElement(ls, {
    key: i,
    size: "small",
    color: "primary",
    icon: t.type ? ps[t.type] : null,
    label: t.label || t,
    variant: t.type ? "outlined" : "default",
    className: "common-feature-chip"
  })))
}

*/

import React, { useEffect } from 'react';
import Chip from '@mui/material/Chip';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import GpsFixedIcon from '@mui/icons-material/GpsFixed';
import WebAssetIcon from '@mui/icons-material/WebAsset';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import AllInclusiveIcon from '@mui/icons-material/AllInclusive';

import './CMD.style.scss';

const Icons = {
  over: <AllInclusiveIcon />,
  regex: <GpsFixedIcon />,
  img: <ImageOutlinedIcon />,
  files: <AttachFileIcon />,
  window: <WebAssetIcon />
};

export default function Cmds({ cmds }) {
  return cmds.map((cmd, i) => (
    <Chip
      key={i}
      size='small'
      color='primary'
      icon={cmd.type ? Icons[cmd.type] : null}
      label={cmd.label || cmd}
      variant={cmd.type ? 'outlined' : 'default'}
      className='common-feature-chip'
    />
  ));
}
