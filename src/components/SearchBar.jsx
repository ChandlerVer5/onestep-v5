import React, { useEffect, useState } from "react";
import { IconButton, InputBase } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import './searchbar.style.scss';

export default function SearchBar(props) {
  const [value, setValue] = useState('');

  useEffect(() => {
    if (
      // prevProps.searchKey !== props.searchKey &&
      props.searchKey !== value
    ) {
      setValue(props.searchKey);
    }
  }, [props.searchKey])

  const handleChange = (e) => {
    setValue(e.target.value);
  };

  const handleKeydown = (e) => {
    if (e.key === "Enter" || e.key === "NumpadEnter") {
      handleOk();
    }
  };

  const handleOk = () => {
    props.onSearch(value);
  };

  const handleBlur = () => {
    setTimeout(() => {
      if (value !== props.searchKey) {
        setValue(props.searchKey);
      }
    }, 50);
  };

  return (
    <div className="scriptshub-search">
      <InputBase
        value={value}
        placeholder="搜索自动化脚本"
        onKeyDown={handleKeydown}
        onChange={handleChange}
        onBlur={handleBlur}
      />
      <IconButton
        disableFocusRipple
        tabIndex={-1}
        onMouseDown={handleOk}
        size="small"
      >
        <SearchIcon />
      </IconButton>
    </div>
  );

}
