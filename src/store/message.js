/***
* @description 弹窗信息功能
*/
export const createMessageStore = (set) => (
  {
    messageData: null,
    showMessage: (body, type = 'info') => set((state) => ({
      ...state,
      messageData: body === null ? null : {
        key: Date.now(),
        body,
        type
      }
    })),
    deleteData: null,
    updateDeleteAlert: (data) => set((state) => ({
      ...state,
      deleteData: data
    })),
    scriptArgsData: null,
    updateScriptArgs: (data) => set((state) => ({
      ...state,
      scriptArgsData: data
    }))
  }
)
