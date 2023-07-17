
const initialState = {
  downloadedIdDic: null,     // TODO downloadedIdDic 其实是 已下载的脚本 id 对应 featureDoc
  downloadedScripts: null,    // 已下载的脚本
  customScripts: null,        // 创建的脚本
  enabledFeatureCodes: null,  // 所有激活的 code 码
}

export const createScriptsStore = (set, get) => (
  {
    ...initialState,
    updateScriptsState(payload) {
      set((state) => {
        const newState = {}
        Object.keys(initialState).forEach((key) => {
          if ('object' === typeof payload[key]) {
            payload[key] = Array.isArray(payload[key]) ? [...payload[key]] : { ...payload[key] }
          }
          newState[key] = payload[key] || state[key]
        })
        return newState
      })
    }
  }
)
