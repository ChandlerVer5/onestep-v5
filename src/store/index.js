
import { shallow } from 'zustand/shallow'
import { create } from 'zustand'
import { createEditorStore } from './editor'
import { createScriptsStore } from './scripts'
import { createMessageStore } from './message'
import { createTabsStore } from './tabs'
import { createScript, getFeatureDocs, downloadScript } from './share'


export const useAllStore = create((...a) => ({
  ...createEditorStore(...a),
  ...createScriptsStore(...a),
  ...createMessageStore(...a),
  ...createTabsStore(...a),
  // a[1]() <=> get()
  getFeatureDocs: (state = a[1]()) => getFeatureDocs(state),
  createScript: (args) => createScript(args, a[1]),
  downloadScript: (args) => downloadScript(args, a[1])
}))
export { shallow }
