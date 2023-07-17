import { TABS } from "../utils/constant";

const initialState = {
  editorData: null,
}

// 编辑文件后更新状态
function handleEditScript(featureDoc, getState) {
  const { customScripts, updateScriptsState } = getState()
  const index = customScripts.findIndex((doc) => featureDoc._id === doc._id)
  index >= 0 && (customScripts[index] = featureDoc)
  updateScriptsState({ customScripts })
}

// 新建文件后更新状态
function handleCreateScript(featureDoc, getState) {
  const { activeTab, setActiveTab, enabledFeatureCodes, showMessage, updateScriptsState, customScripts } = getState()
  customScripts.unshift(featureDoc)
  enabledFeatureCodes.unshift(featureDoc.feature.code)
  showMessage("创建成功，已启用", "success")
  TABS['CUSTOM'] === activeTab
    ? updateScriptsState({
      customScripts
    }) : setActiveTab('CUSTOM')
}

export const createEditorStore = (set, get) => (
  {
    ...initialState,
    updateEditorData: (scriptEditorData) => set((state) => {
      console.log(state)
      const readOnly = !!scriptEditorData.featureDoc.scriptId || !!scriptEditorData.featureDoc.id;
      const submitCallback = (featureDoc) => !readOnly ?
        scriptEditorData.created
          ? handleCreateScript(featureDoc, get)
          : handleEditScript(featureDoc, get) : () => { }

      return {
        ...state,
        editorData: {
          ...scriptEditorData,
          submitCallback,
          readOnly, // readOnly
          isEnabled: state['enabledFeatureCodes'].includes(scriptEditorData.featureDoc.feature.code)
        },
      }
    })
  })
