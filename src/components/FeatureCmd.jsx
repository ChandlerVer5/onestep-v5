import React, { useState } from 'react';
import Paper from '@mui/material/Paper';
import Tooltip from '@mui/material/Tooltip';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';

import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { FeatureTypeComps } from '../utils/constant';

export default function(props) {
  const { cmd, index, disabled, delCmd, handleTextChange, handleNumberInputChange, handleWindowMatchChange } = props;

  return (
    <Paper className='feature-cmd'>
      <div className='feature-type'>
        {FeatureTypeComps['string' == typeof cmd ? 'text' : cmd.type]}
      </div>
      {!disabled &&
        <Tooltip title='移除' placement='left' disableFocusListener>
          <HighlightOffIcon
            className='feature-cmd-remove'
            onClick={() => delCmd(index)}
          />
        </Tooltip>
      }
      {/* ===== 常规 === */}
      {'string' == typeof cmd && (
        <TextField
          disabled={disabled}
          value={cmd}
          label='关键字名称'
          variant='filled'
          size="small"
          fullWidth
          onChange={handleTextChange(index, 'keyword')}
        />
      )}
      {/* ===== 图片 === */}
      {'img' === cmd.type && (
        <div className='feature-cmd-match'>
          <TextField
            disabled={disabled}
            label='关键字名称'
            value={cmd.label}
            variant='filled'
            fullWidth
            size='small'
            onChange={handleTextChange(index, 'label')}
          />
        </div>
      )}
      {/* ===== 文本匹配 === */}
      {'regex' === cmd.type && (
        <div className='feature-cmd-match'>
          <div>
            <TextField
              disabled={disabled}
              label='关键字名称'
              value={cmd.label}
              variant='filled'
              fullWidth
              size='small'
              onChange={handleTextChange(index, 'label')}
            />
          </div>
          <div>
            <TextField
              disabled={disabled}
              label='正则'
              value={cmd.match || ''}
              variant='standard'
              fullWidth
              size='small'
              onChange={handleTextChange(index, 'match')}
            />
          </div>
          {(!disabled || cmd.minLength) &&
            <div>
              <TextField
                disabled={disabled}
                label="最少字符数"
                type="number"
                value={cmd.minLength || ''}
                variant="standard"
                fullWidth
                size='small'
                onChange={handleNumberInputChange(index, 'minLength')}
              />
            </div>
          }
          {(!disabled || cmd.maxLength) &&
            <div>
              <TextField
                disabled={disabled}
                label="最多字符数"
                type="number"
                value={cmd.maxLength || ''}
                variant="standard"
                fullWidth
                size='small'
                onChange={handleNumberInputChange(index, 'maxLength')}
              />
            </div>
          }
        </div>
      )}
      {/* ===== 文件或文件夹 === */}
      {'files' === cmd.type && (
        <div className='feature-cmd-match'>
          <div>
            <TextField
              fullWidth
              disabled={disabled}
              label='关键字名称'
              value={cmd.label}
              variant='filled'
              size='small'
              onChange={handleTextChange(index, 'label')}
            />
          </div>
          {(!disabled || cmd.fileType) &&
            <div>
              <FormControl
                fullWidth
                disabled={disabled}
                variant='standard'
                size='small'
              >
                <InputLabel id='feature-cmd-files-type'>类型</InputLabel>
                <Select
                  onChange={handleTextChange(index, 'fileType')}
                  value={cmd.fileType || ''}
                  labelId='feature-cmd-files-type'
                >
                  <MenuItem value=''>无</MenuItem>
                  <MenuItem value='file'>文件</MenuItem>
                  <MenuItem value='directory'>文件夹</MenuItem>
                </Select>
              </FormControl>
            </div>
          }
          {
            (!disabled || cmd.match) &&
            <div>
              <TextField
                fullWidth
                disabled={disabled}
                label='名称匹配正则'
                value={cmd.match}
                variant='standard'
                size='small'
                onChange={handleTextChange(index, 'match')}
              />
            </div>
          }
          {
            (!disabled || cmd.minLength) &&
            <div>
              <TextField
                fullWidth
                disabled={disabled}
                label='最少文件数'
                type='number'
                value={cmd.minLength || ''}
                variant='standard'
                size='small'
                onChange={handleNumberInputChange(index, 'minLength')}
              />
            </div>
          }
          {
            (!disabled || cmd.maxLength) && (
              <div>
                <TextField
                  fullWidth
                  disabled={disabled}
                  label='最多文件数'
                  type='number'
                  value={cmd.maxLength || ''}
                  variant='standard'
                  size='small'
                  onChange={handleNumberInputChange(index, 'maxLength')}
                />
              </div>
            )
          }
        </div>
      )}
      {/* ===== 任意文本 === */}
      {
        'over' === cmd.type && (
          <div className='feature-cmd-match'>
            <div>
              <TextField
                disabled={disabled}
                fullWidth
                label='关键字名称'
                value={cmd.label}
                variant='filled'
                size='small'
                onChange={handleTextChange(index, 'label')}
              />
            </div>
            {(!disabled || cmd.exclude) &&
              <div>
                <TextField
                  fullWidth
                  disabled={disabled}
                  label='排除正则'
                  value={cmd.exclude || ''}
                  variant='standard'
                  size='small'
                  onChange={handleTextChange(index, 'exclude')}
                />
              </div>
            }
            {(!disabled || cmd.minLength) &&
              <div>
                <TextField
                  fullWidth
                  disabled={disabled}
                  label='最少字符数'
                  type='number'
                  value={cmd.minLength || ''}
                  variant='standard'
                  size='small'
                  onChange={handleNumberInputChange(index, 'minLength')}
                />
              </div>
            }
            {(!disabled || cmd.maxLength) &&
              <div>
                <TextField
                  fullWidth
                  disabled={disabled}
                  label='最多字符数'
                  type='number'
                  value={cmd.maxLength || ''}
                  variant='standard'
                  size='small'
                  onChange={handleNumberInputChange(index, 'maxLength')}
                />
              </div>
            }
          </div>
        )
      }
      {/* ===== 应用窗口 === */}
      {
        'window' === cmd.type && (
          <div className='feature-cmd-match'>
            <div>
              <TextField
                disabled={disabled}
                fullWidth
                label='关键字名称'
                value={cmd.label}
                variant='filled'
                size='small'
                onChange={handleTextChange(index, 'label')}
              />
            </div>
            {(!disabled || cmd.match?.app) &&
              <div>
                <TextField
                  fullWidth
                  disabled={disabled}
                  label='应用名称 (多个","隔开)'
                  value={cmd.match?.app || ''}
                  variant='standard'
                  size='small'
                  onChange={handleWindowMatchChange(index, 'app')}
                />
              </div>
            }
            {(!disabled || cmd.match?.title) &&
              <div>
                <TextField
                  fullWidth
                  disabled={disabled}
                  size='small'
                  label='标题匹配正则'
                  value={cmd.match?.title || ''}
                  variant='standard'
                  onChange={handleWindowMatchChange(index, 'title')}
                />
              </div>
            }
            {(!disabled || cmd.match?.class) &&
              <div>
                <TextField
                  fullWidth
                  disabled={disabled}
                  label='窗口类 (Windows专有)'
                  value={cmd.match?.class || ''}
                  variant='standard'
                  size='small'
                  onChange={handleWindowMatchChange(index, 'class')}
                />
              </div>
            }
          </div>
        )
      }
    </Paper >
  );
}
