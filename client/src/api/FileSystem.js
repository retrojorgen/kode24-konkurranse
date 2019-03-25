const getFiles = async email => {
  const response = await tryWebCall("/api/files", "post", {});
  return response;
};

const getHelp = async email => {
  const response = await tryWebCall("/api/help", "get");
  return response;
};

const submitCode = async email => {
  const response = await tryWebCall("/api/files/code", "get");
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
    console.log(error);
    return false;
  }
};

export { getFiles, getHelp, submitCode };
