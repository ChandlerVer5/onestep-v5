const API_ENDPOINT = "https://open.u-tools.cn";

export async function request(url, params, method = "GET") {
  const options = {
    method,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    }
  };

  if (method === "GET") {
    if (params && typeof params === "object") {
      let query = "";
      for (const key in params) {
        if (params[key] !== undefined && params[key] !== null) {
          query += (query ? "&" : "") + key + "=" + encodeURIComponent(params[key]);
        }
      }
      url += (url.includes("?") ? "&" : "?") + query;
    }
  } else {
    if (params && typeof params === "object") {
      options.body = JSON.stringify(params);
    }
  }

  let response;
  try {
    response = await window.fetch(API_ENDPOINT + url, options);
  } catch (error) {
    throw new Error('网络请求失败！请检查网络是否正常，全局代理是否开启，以及安全软件或防火墙是否拦截了 "u-tools.cn"。');
  }

  const data = await response.json();

  if (response.ok) {
    return data;
  }

  if (data.errors) {
    data.message = Object.values(data.errors).join("\n");
  }

  const error = new Error(data.message || "返回 " + response.status + " 错误");
  error.code = response.status;

  if (data.errors) {
    error.errors = data.errors;
  }

  throw error;
}
