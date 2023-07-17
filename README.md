# 简介
自动化脚本 - 让繁琐的步骤一步到位
> 试图从 官方的一步到位 插件源码中复刻出一个同样的插件。

# Why
1. 希望增加同步功能
2. 配合修改后的 utools ，实现更多功能

# 使用方法

## 脚本编程语言
语言 JavaScript，环境 Node.js

## 可使用的 uTools API

showNotification
redirect
getPath
copyFile
copyImage
copyText
getCopyedFiles
readCurrentFolderPath
readCurrentBrowserUrl
shellOpenPath
shellShowItemInFolder
shellOpenExternal
shellBeep
simulateKeyboardTap
simulateMouseClick
simulateMouseRightClick
simulateMouseDoubleClick
simulateMouseMove
getCursorScreenPoint
getPrimaryDisplay
getAllDisplays
getDisplayNearestPoint
getDisplayMatching
isMacOs
isWindows
isLinux
ubrowser

## 数据来源

ENTER 对象
ENTER.type 关键字类型
ENTER.payload 关键字对应数据

## 脚本参数

双引号 + 两个大括号 "{{参数名称}}"

## 内置函数
1. `runAppleScript()`   macOS 下执行 'apple script'
2. `sleep()`    中断执行多少毫秒


# TODO
- [] 优化列表渲染
- [] 编辑器的类型自定义优化，或者可动态根据配置生成？
