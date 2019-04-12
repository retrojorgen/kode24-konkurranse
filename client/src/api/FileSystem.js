let apiUrl = "";

if (process.env.NODE_ENV === "production") {
  apiUrl = "https://paaske2019.kode24.no";
}

const getFiles = async email => {
  const response = await tryWebCall(apiUrl + "/api/files", "post", {});
  return response;
};

const getHelp = async email => {
  const response = await tryWebCall(apiUrl + "/api/help", "get");
  return response;
};

const trollFiles = async () => {
  const response = await tryWebCall(apiUrl + "/api/troll", "get");
  return response;
};

const tryWebCall = async (url, method, data) => {
  try {
    let response = undefined;
    if (method === "post") {
      response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });
    } else {
      response = await fetch(url);
    }

    if (response.ok) {
      const json = await response.json();
      return json;
    } else {
      throw new Error("404");
    }
  } catch (error) {
    return false;
  }
};

export { getFiles, getHelp, trollFiles };
