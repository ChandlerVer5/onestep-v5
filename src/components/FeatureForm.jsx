import React, { useState, forwardRef, useImperativeHandle } from 'react';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import AddIcon from '@mui/icons-material/Add';

import './FeatureForm.style.scss';
import { FeatureTypeComps, platforms } from '../utils/constant';
import FeatureCmd from './FeatureCmd';
import { useAllStore } from '../store';
import { isRegex } from '../utils';

const platform = ["win32", "darwin", "linux"]

export default forwardRef((props, featureFromRef) => {
  const showMessage = useAllStore((state) => state.showMessage)
  const [matchMenu, setMatchMenu] = useState(null);
  const { disabled } = props;
  const [data, setData] = useState(() => {
    const t = JSON.parse(JSON.stringify(props.data));
    t.platform || (t.platform = platform);
    return t;
  });

  useImperativeHandle(featureFromRef, () => ({
    resetData: resetData,
    getData: getData
  }), [data]);

  const resetData = (data) => {
    const feature = JSON.parse(data);
    feature.platform || (feature.platform = platform);
    setData(feature);
  };

  const getData = () => {
    const feature = JSON.parse(JSON.stringify(data));
    if (!feature.explain.trim()) {
      showMessage("未配置功能说明", "error");
      return;
    }
    if (feature.platform.length === 0) {
      showMessage("未配置运行平台", "error");
      return;
    }
    if (feature.platform.length === 3)
      delete feature.platform;
    if (feature.cmds.length === 0) {
      showMessage("未配置运行平台", "error");
      return;
    }

    for (const cmd of feature.cmds) {
      if ("string" === typeof cmd) {
        if (!cmd.trim()) {
          showMessage("未配置文本关键字", "error");
          return;
        }
      } else {
        if (!cmd.label.trim()) {
          showMessage("未配置关键字名称", "error");
          return;
        }
        if (cmd.label.length > 60) {
          showMessage("关键字名称字符太长, 不能超过60位", "error");
          return;
        }
        if ("regex" === cmd.type) {
          if (!isRegex(cmd.match)) {
            showMessage('"文本匹配" 正则错误', "error");
            return;
          }
        } else if ("over" === cmd.type) {
          if (cmd.exclude && !isRegex(cmd.exclude)) {
            showMessage('"任意文本" 排除正则错误', "error");
            return;
          }
        } else if ("files" === cmd.type) {
          if (cmd.match && !isRegex(cmd.match)) {
            showMessage('"文件或文件夹" 名称匹配正则错误', "error");
            return;
          }
          if ("" === cmd.fileType) {
            delete cmd.fileType;
          }
        } else if ("window" === cmd.type) {
          if (cmd.match?.app) {
            if (cmd.match.title && !isRegex(cmd.match.title)) {
              showMessage('"应用窗口" 标题匹配正则错误', "error");
              return;
            }
            if ("string" === typeof cmd.match.app) {
              cmd.match.app = cmd.match.app.trim().split(",");
            }
          }
          if (cmd.match?.class && typeof cmd.match.class === "string") {
            cmd.match.class = cmd.match.class.trim().split(",");
          }
          if (cmd.match && Object.values(cmd.match).join("").trim() === "") {
            delete cmd.match;
          }
        }
      }
    }
    return feature;
  };

  // 选择图标
  const selectIcon = () => {
    try {
      const e = window.services.showSelectIconDialog();
      if (!e) return;
      data.icon = e;
      setData({ ...data });
    } catch (error) {
      showMessage(error.message, 'error');
    }
  };

  const checkPlatform = (e, p) => {
    const platform = data.platform
    if (e.target.checked) {
      if (!platform.includes(p))
        platform.push(p);
    } else {
      platform.splice(platform.indexOf(p), 1);
    }
    setData({ ...data });
  };


  const newCmd = (type) => {
    if (type === "text") data.cmds.push('');
    else {
      data.cmds.push({
        type,
        label: ''
      });
    }
    setMatchMenu(null); // setData({ matchMenu: null });
  };

  const delCmd = (index) => {
    data.cmds.splice(index, 1);
    setData({
      ...data
    });
  };

  const handleTextChange = (index, type) => (e) => {
    const value = e.target.value;
    const cmds = data.cmds;
    // ==== 更能说明 ====
    if (index === 'explain') {
      data[index] = value
    }
    // ==== 常规项 ===
    else if (type === 'keyword') {
      cmds[index] = value
    }
    // ==== label ===
    else {
      cmds[index][type] = value
    }

    setData({
      ...data
    });
  };

  const handleNumberInputChange = (index, lable) => (e) => {
    const value = e.target.value;
    const cmds = data.cmds
    if (value) {
      if (!/^\d+$/.test(value)) return;
      cmds[index][lable] = parseInt(value);
    } else {
      delete cmds[index][lable];
    }
    setData({ ...data });
  };

  const handleWindowMatchChange = (index, lable) => (e) => {
    const _cmd = data.cmds[index]
    _cmd.match || (_cmd.match = {});
    _cmd.match[lable] = e.target.value;
    setData({ ...data });
  };

  return (
    <div className='feature-form' ref={featureFromRef}>
      <div className='feature-form-icon'>
        <img className='feature-icon' src={data.icon || "logo.png"} />
        <Button
          disabled={disabled}
          size='small'
          color='info'
          onClick={selectIcon}
          variant='outlined'
        >
          选择图标
        </Button>
      </div>
      <div>
        <TextField
          fullWidth
          disabled={disabled}
          id='filled-basic'
          label='功能说明'
          value={data.explain}
          variant='filled'
          onChange={handleTextChange('explain')}
        />
      </div>
      <div>
        <FormControl disabled={disabled}>
          <FormLabel component='legend'>可运行平台</FormLabel>
          <FormGroup className='feature-platform-checkbox' row>
            {platforms.map(([os, platform]) => (
              <FormControlLabel
                key={os}
                value={platform}
                onChange={(e) => checkPlatform(e, platform)}
                checked={data.platform.includes(platform)}
                control={
                  <Checkbox color='primary' size='small' />
                }
                label={os}
              />
            ))}
          </FormGroup>
        </FormControl>
      </div>
      <div>
        {data.cmds.map((cmd, i) => (
          <FeatureCmd
            index={i}
            cmd={cmd}
            key={i}
            delCmd={delCmd}
            disabled={disabled}
            handleTextChange={handleTextChange}
            handleNumberInputChange={handleNumberInputChange}
            handleWindowMatchChange={handleWindowMatchChange}
          />
        ))}
        {/* ===== 新增关键字 === */}
        {!disabled && <div>
          <Button
            onClick={(e) => {
              setMatchMenu(e.currentTarget);
            }}
            startIcon={<AddIcon />}
          >
            新增关键字
          </Button>
          <Menu
            onClose={() => {
              setMatchMenu(null);
            }}
            anchorEl={matchMenu}
            open={!!matchMenu}
            keepMounted
          >
            {Object.keys(FeatureTypeComps)
              .filter((type) => !data.cmds?.find((cmd) => cmd.type === type))
              .map((type) => (
                <MenuItem key={type} onClick={() => newCmd(type)}>
                  {FeatureTypeComps[type]}
                </MenuItem>
              ))}
          </Menu>
        </div>
        }
      </div>
    </div>
  );
})
