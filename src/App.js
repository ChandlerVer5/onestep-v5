import React from 'react';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import OneStepTabs from './components/Tabs'
import './index.scss';

export default function App() {

  // // 进入插件
  // window.utools.onPluginEnter(({ code, type, payload }) => {
  //   this.setState({ code })
  // })
  // // 退出插件
  // window.utools.onPluginOut(() => {
  //   this.setState({ code: '' })
  // })
  // 主题切换事件
  // window
  //   .matchMedia('(prefers-color-scheme: dark)')
  //   .addEventListener('change', e => {
  //     this.setState({ theme: e.matches ? 'dark' : 'light' });
  //   });
  const onTabChange = () => {

  }


  const gotoCreatePage = () => {

  }

  return (
    <div className='onestep-body'>
      <Button className='onestep-create-btn' variant='contained' onClick={gotoCreatePage} size='small' startIcon={<AddIcon />}>
        创建自动化脚本
      </Button>
      <OneStepTabs />
      <div className='onestep-page'>
      </div>
    </div>)
}
