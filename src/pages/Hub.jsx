import React, { useState } from 'react';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ButtonGroup from '@mui/material/ButtonGroup';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import PublishIcon from '@mui/icons-material/Publish';

import { Waypoint } from 'react-waypoint';
import ScriptItem from '../components/ScriptItem';
import SearchBar from '../components/SearchBar';
import { request } from '../utils/fetch';
import './hub.style.scss';
import { useAllStore } from '../store';

export default function Hubs() {
  const showMessage = useAllStore((state) => state.showMessage);
  const [state, setState] = useState({
    searchKey: '',
    orderBy: 'downloads',
    scriptsList: [],
    isLoadMore: true
  });

  // const [orderBy, setOrderBy] = useState('downloads');
  // const [isLoadMore, setLoadMore] = useState(true);
  const { searchKey, orderBy, isLoadMore, scriptsList } = state

  const fetchScripts = async () => {
    const queryParams = {
      key: searchKey,
      platform: window.services.getPlatform(),
      page: Math.ceil(scriptsList.length / 10) + 1,
      order_by: orderBy,
    };

    try {
      const res = await request('/scripts', queryParams);
      scriptsList.push(...res)
      setState({
        ...state,
        scriptsList,
        // scriptsList: [...scriptsList, ...res],
        isLoadMore: 10 === res.length
      })
    } catch (error) {
      setState({
        ...state,
        isLoadMore: false
      })
      showMessage(error.message, "error")
    }
  };

  // 加载内容
  const handleLoadMore = () => {
    fetchScripts();
  };

  // 搜索内容
  const handleSearch = (searchKey) => {
    setState({
      ...state,
      searchKey,
      scriptsList: [],
      isLoadMore: true
    })
  };

  const handleChangeOrder = (by) => {
    by !== orderBy && setState({
      ...state,
      orderBy: by,
      scriptsList: [],
      isLoadMore: true
    })
  };

  return (
    <div className='onestep-hubs'>
      <div className='hubs-top'>
        <div>
          <SearchBar searchKey={searchKey || ""} onSearch={handleSearch} />
        </div>
        <div>
          <ButtonGroup
            disabled={scriptsList.length < 2}
            size='small'
            color='info'
            disableFocusRipple
          >
            <Button
              variant={'downloads' === orderBy ? 'contained' : 'outlined'}
              onClick={() => handleChangeOrder('downloads')}
              startIcon={<LocalFireDepartmentIcon />}
            >
              最受欢迎
            </Button>
            <Button
              variant={'updated_at' === orderBy ? 'contained' : 'outlined'}
              onClick={() => handleChangeOrder('updated_at')}
              startIcon={<PublishIcon />}
            >
              最新分享
            </Button>
          </ButtonGroup>
        </div>
      </div>
      <div className='hubs-content'>
        <List>
          {scriptsList.map((item) => (
            <ScriptItem
              key={item.id}
              item={item}
            />
          ))}
        </List>
        {isLoadMore && (
          <Waypoint onEnter={handleLoadMore}>
            <div className='hubs-loading'>
              <div>
                <div></div>
                <div></div>
                <div></div>
              </div>
            </div>
          </Waypoint>
        )}
        {!isLoadMore && 0 === scriptsList.length && (
          <div className='hubs-empty'>未搜索到相关脚本</div>
        )}
      </div>
    </div>
  );
}
