
/**
* @description 多处使用，且需要处理相关 state 的方法
*/
import { request } from '../utils/fetch';
import { formatArgs } from '../utils';
import { TABS } from '../utils/constant';

// 自动获取 当前 tab 的 script 列表
export const getFeatureDocs = (state) => {
  return state.activeTab === TABS['CUSTOM'] ? ['customScripts', state.customScripts] : ['downloadedScripts', state.downloadedScripts]
}

/**
* @description 下载脚本
*/
export const downloadScript = async (script, getAllState) => {
  if (!script.id) return;
  const nativeId = window.utools.getNativeId()
    , timestamp = Date.now().toString();
  const { downloadedScripts, enabledFeatureCodes, showMessage, updateScriptsState, downloadedIdDic } = getAllState();

  try {
    const tempAuth = {
      pmid: nativeId,
      timestamp,
      sign: window.services.strSha256(nativeId + timestamp)
    };

    const downloadedDoc = await request("/scripts/download/" + script.id, tempAuth);
    if (!downloadedDoc.id || !downloadedDoc.feature || !downloadedDoc.updated_at)
      throw new Error("数据错误!");
    if (script.audit) {
      downloadedDoc.feature = script.audit.feature
      downloadedDoc.script = script.audit.script
    }

    const feature = JSON.parse(downloadedDoc.feature);
    feature.code = String(downloadedDoc.id)
    if (feature.icon) {
      const icon = await window.fetch(feature.icon), iconBlob = await icon.blob();
      feature.icon = await function(ib) {
        return new Promise((resolve, reject) => {
          const fileReader = new window.FileReader;
          fileReader.onerror = reject;
          fileReader.onload = () => {
            resolve(fileReader.result)
          }
          fileReader.readAsDataURL(ib)
        })
      }(iconBlob)
    }

    let localScript = window.utools.db.get("scripts/" + downloadedDoc.id);
    const isLocalScript = !!localScript;
    if (isLocalScript) {
      localScript.feature = feature
      localScript.script = downloadedDoc.script
      localScript.updateAt = Date.now()
      localScript.scriptId = downloadedDoc.id
      localScript.versionAt = downloadedDoc.updated_at
    } else {
      localScript = {
        _id: "scripts/" + downloadedDoc.id,
        feature,
        script: downloadedDoc.script,
        updateAt: Date.now(),
        scriptId: downloadedDoc.id,
        versionAt: downloadedDoc.updated_at
      }
      formatArgs(localScript, downloadedDoc.script)
    }

    const dbResult = window.utools.db.put(localScript);
    if (dbResult.error) throw new Error("脚本保存失败!");
    localScript._rev = dbResult.rev;

    let updateIndex = -1
    // 本地已存在，需要更新
    if (isLocalScript) {
      enabledFeatureCodes.includes(feature.code) && window.utools.setFeature(feature);
      downloadedScripts.findIndex((e => e._id === localScript._id));
      updateIndex >= 0 && downloadedScripts.splice(updateIndex, 1, localScript)
      showMessage("成功下载更新!", "success")
    } else {
      window.utools.setFeature(feature)
      downloadedScripts.unshift(localScript)
      enabledFeatureCodes.unshift(feature.code)
      showMessage("下载成功，已开启使用!", "success");
    }
    downloadedIdDic[localScript.scriptId] = localScript
    updateScriptsState({
      downloadedIdDic,
      downloadedScripts,
      enabledFeatureCodes
    })
    return true
  } catch (error) {
    showMessage(error.message, "error")
  }
}

/**
* @description 新建脚本
*/
export const createScript = (args = [], getAllState) => {
  let [feature, code] = args
  const timestamp = Date.now().toString();
  feature ? feature.code = timestamp : feature = {
    code: timestamp,
    explain: "",
    cmds: [""]
  }
  getAllState().updateEditorData({
    featureDoc: {
      _id: "scripts/" + timestamp,
      feature,
      script: code || ""
    },
    created: true // 标记新建脚本
  })
}
