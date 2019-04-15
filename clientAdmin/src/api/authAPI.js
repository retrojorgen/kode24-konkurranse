let apiUrl = "http://localhost:5000";

if (process.env.NODE_ENV === "production") {
  apiUrl = "https://paaske2019.kode24.no";
}

const isVerified = async () => {
  const response = await tryWebCall(apiUrl + "/api/verify", "get", {});
  return response;
};

const isVerifiedFileSystem = async () => {
  const response = await tryWebCall(
    apiUrl + "/api/verify/filesystem",
    "get",
    {}
  );
  return response;
};

const getAnswers = async cookie => {
  const response = await tryWebCall(
    apiUrl + "/api/admin/answers/" + cookie,
    "get",
    {}
  );
  return response;
};

const getEvents = async cookie => {
  const response = await tryWebCall(
    apiUrl + "/api/admin/events/" + cookie,
    "get",
    {}
  );
  return response;
};

const getUsers = async cookie => {
  const response = await tryWebCall(
    apiUrl + "/api/admin/events/" + cookie,
    "get",
    {}
  );
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

export { getAnswers, getEvents, getUsers };
