const vm = require("vm")
const fs = require("fs")
const crypto = require("crypto")
const path = require("path")

const context = {
  Buffer,
  require,
  process,
  TextDecoder,
  TextEncoder,
  URL,
  URLSearchParams,
  utools: {
    get ubrowser() {
      return window.utools.ubrowser
    },
    showNotification: o => {
      window.utools.showNotification(o)
    }
    ,
    redirect: (keyword, payload) => {
      window.utools.redirect(keyword, payload);
      const t = new Error("");
      throw t.name = "redirect",
      t
    }
    ,
    screenColorPick: o => {
      if (parseFloat(window.utools.getAppVersion()) < 3)
        return window.utools.showNotification('uTools 3.0 及以上版本才支持 API "utools.screenColorPick"');
      window.utools.screenColorPick(o)
    }
    ,
    screenCapture: o => {
      if (parseFloat(window.utools.getAppVersion()) < 3)
        return window.utools.showNotification('uTools 3.0 及以上版本才支持 API "utools.screenCapture"');
      window.utools.screenCapture(o)
    }
    ,
    getPath: window.utools.getPath,
    copyFile: window.utools.copyFile,
    copyImage: window.utools.copyImage,
    copyText: window.utools.copyText,
    readCurrentFolderPath: window.utools.readCurrentFolderPath,
    readCurrentBrowserUrl: window.utools.readCurrentBrowserUrl,
    shellOpenPath: window.utools.shellOpenPath,
    shellShowItemInFolder: window.utools.shellShowItemInFolder,
    shellOpenExternal: window.utools.shellOpenExternal,
    shellBeep: window.utools.shellBeep,
    simulateKeyboardTap: window.utools.simulateKeyboardTap,
    simulateMouseClick: window.utools.simulateMouseClick,
    simulateMouseRightClick: window.utools.simulateMouseRightClick,
    simulateMouseDoubleClick: window.utools.simulateMouseDoubleClick,
    simulateMouseMove: window.utools.simulateMouseMove,
    hideMainWindowTypeString: o => {
      if (parseFloat(window.utools.getAppVersion()) < 3)
        return window.utools.showNotification('uTools 3.0 及以上版本才支持 API "utools.hideMainWindowTypeString"');
      window.utools.hideMainWindowTypeString(o)
    }
    ,
    getCursorScreenPoint: window.utools.getCursorScreenPoint,
    getPrimaryDisplay: window.utools.getPrimaryDisplay,
    getAllDisplays: window.utools.getAllDisplays,
    getDisplayNearestPoint: window.utools.getDisplayNearestPoint,
    getDisplayMatching: window.utools.getDisplayMatching,
    isMacOs: window.utools.isMacOs,
    isMacOS: window.utools.isMacOS,
    isWindows: window.utools.isWindows,
    isLinux: window.utools.isLinux
  },
  runAppleScript: o => new Promise(((resolve, t) => {
    let s = ""; let i = "";
    const cmd = require("child_process").spawn("osascript", ["-ss"], {
      detached: !0
    });

    cmd.on("close", (o => {
      if (0 === o)
        return resolve(i.trim());
      s = s.trim().replace(/^\d+:\d+: execution error:/, "").replace(/\(-?(\d+)\)\s*$/, "");
      const r = new Error(s);
      r.code = parseInt(RegExp.$1 || o),
        t(r)
    }
    ));

    cmd.stderr.on("data", (o => {
      s += o
    }
    ));

    cmd.stdout.on("data", (o => {
      i += o
    }));
    cmd.stdin.write(o)
    cmd.stdin.end()
  })),
  sleep: timeout => {
    const e = Date.now() + Number(timeout);
    for (; Date.now() < e;)
      ;
  }
};

for (const o in window.utools)
  if (!o.startsWith("_") && !(o in context.utools))
    if ("db" !== o)
      if ("dbStorage" !== o)
        context.utools[o] = () => {
          throw new Error("utools." + o + " 禁用")
        }
          ;
      else {
        context.utools.dbStorage = {};
        const o = () => {
          throw new Error("utools.dbStorage 禁用")
        }
          ;
        for (const e in window.utools.dbStorage)
          context.utools.dbStorage[e] = o
      }
    else {
      context.utools.db = {};
      const o = () => {
        throw new Error("utools.db 禁用")
      }
        ;
      for (const e in window.utools.db)
        context.utools.db[e] = o;
      if (window.utools.db.promises) {
        context.utools.db.promises = {};
        for (const e in window.utools.db.promises)
          context.utools.db.promises[e] = o
      }
    }

vm.createContext(context);

window.services = {
  getPlatform: () => process.platform,
  showSelectIconDialog: () => {
    const files = window.utools.showOpenDialog({
      filters: [{
        name: "选择图标",
        extensions: ["png", "jpg", "jpeg"]
      }],
      properties: ["openFile"]
    });
    if (!files)
      return;
    let e = require("electron").nativeImage.createFromPath(files[0]);
    if (e.isEmpty())
      return;
    const t = e.getSize();
    if (t.width < 20 || t.height < 20)
      throw new Error("图标太小");

    (t.width > 72 || t.height > 72) && (e = t.height > t.width ? e.resize({
      height: 72
    }) : e.resize({
      width: 72
    }))
    return e.toDataURL()
  },
  vmRunScript: (script, enterPay) => {
    if (script.trim()) {
      context.ENTER = Object.freeze(enterPay)
      window.utools.hideMainWindow()
      setTimeout(() => {
        try {
          vm.runInContext(`(()=>{ ${script} })()`, context)
          window.utools.outPlugin()
        } catch (error) {
          error.message ?
            (window.utools.showNotification("运行错误：" + error.message),
              window.utools.outPlugin())
            : "redirect" === error.name && window.utools.showMainWindow()
        }
      })
    }
  },
  saveFileToDownloadFolder: (filename, content) => {
    const savePath = path.join(window.utools.getPath("downloads"), filename)
    fs.writeFileSync(savePath, content, "utf-8")
    window.utools.shellShowItemInFolder(savePath)
  }
  ,
  readAutoScriptContent: filename => {
    const filepath = path.join(__dirname, "autojs", filename);
    return fs.existsSync(filepath) ? fs.readFileSync(filepath).toString() : null
  }
  ,
  strSha256: o => crypto.createHash("sha256").update(o).digest("hex")
};
