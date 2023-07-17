import { platforms } from "./constant";


export function openUrlFromEditor(e) {
  switch (typeof e) {
    case 'string':
      utools.shellOpenExternal(e);
      break;
    default:
      if (e.target.tagName === 'A') {
        const { href } = e.target.dataset;
        href.startsWith('http') && utools.shellOpenExternal(href);
      }
      break;
  }
}

export function getPlatForm(os) {
  return "win32" === os ? platforms[0][0] : "darwin" === os ? platforms[1][0] : "linux" === os ? platforms[2][0] : os
}

// TODO 这可能只是做个兼容老版本 scriptArgs 的修正方法，可考虑修正数据结构h}后删除
export function formatArgs(featureDoc, content) {
  if (/"{{.+}}"/.test(content)) {
    const args = featureDoc.scriptArgs || {};
    featureDoc.scriptArgs = {};
    content.match(/"{{.+}}"/g).forEach((str) => {
      const n = str.substring(3, str.length - 3);
      featureDoc.scriptArgs[n] = args[n] || '';
    });
  } else delete featureDoc.scriptArgs;
}

export const isRegex = (e) => {
  return /^\/.+\/[gimuy]*$/.test(e);
};

export const isMatchAnyRegex = (e) => {
  return /^\/(?:\.|\\S|\[.*\\S.*\]|\[\^.+\])(?:\*|\+|\?\??|\{\d+,\d+\})?\/[gimuy]*$/.test(e);
};
