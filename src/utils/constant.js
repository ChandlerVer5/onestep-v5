
import React from 'react'
import KeyboardCommandKeyIcon from "@mui/icons-material/KeyboardCommandKey"
import GpsFixedIcon from "@mui/icons-material/GpsFixed"
import WebAssetIcon from "@mui/icons-material/WebAsset"
import AllInclusiveIcon from "@mui/icons-material/AllInclusive"
import AttachFileIcon from "@mui/icons-material/AttachFile"
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined"
import { createTheme } from '@mui/material/styles'

export const platforms = [["Windows", "win32"], ["macOS", "darwin"], ["Linux", "linux"]]
export const TABS = (function() {
  let tabs = {};
  tabs[tabs["HUB"] = 0] = "HUB";
  tabs[tabs["DOWNLOADED"] = 1] = "DOWNLOADED";
  tabs[tabs["CUSTOM"] = 2] = "CUSTOM";
  return tabs
})();

export const FeatureTypeComps = {
  text: <div className="feature-form-type-lable">
    <KeyboardCommandKeyIcon fontSize="small" />
    <span>常规</span>
  </div>,
  regex: <div className="feature-form-type-lable">
    <GpsFixedIcon fontSize="small" />
    <span>文本匹配</span>
  </div>,
  over: <div className="feature-form-type-lable">
    <AllInclusiveIcon fontSize="small" />
    <span>任意文本</span>
  </div>,
  files: <div className="feature-form-type-lable">
    <AttachFileIcon fontSize="small" />
    <span>文件或文件夹</span>
  </div>,
  img: <div className="feature-form-type-lable">
    <ImageOutlinedIcon fontSize="small" />
    <span>图片</span>
  </div>,
  window: <div className="feature-form-type-lable">
    <WebAssetIcon fontSize="small" />
    <span>应用窗口</span>
  </div>
};

export const ThemeDic = {
  light: createTheme({
    palette: {
      mode: "light",
      primary: {
        main: "#3f51b5"
      },
      secondary: {
        main: "#f50057"
      }
    },
    components: {
      MuiButton: {
        defaultProps: {
          disableFocusRipple: true
        }
      },
      MuiTooltip: {
        defaultProps: {
          disableFocusListener: true
        }
      }
    }
  }),
  dark: createTheme({
    palette: {
      mode: "dark",
      primary: {
        main: "#90caf9"
      },
      secondary: {
        main: "#f48fb1"
      }
    },
    components: {
      MuiButton: {
        defaultProps: {
          disableFocusRipple: true
        }
      },
      MuiTooltip: {
        defaultProps: {
          disableFocusListener: true
        }
      }
    }
  })
}
