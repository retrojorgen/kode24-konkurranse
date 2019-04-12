let apiUrl = "";

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

const recoverByEmail = async email => {
  const response = await tryWebCall(apiUrl + "/api/verify/recover", "post", {
    email: email
  });
  return response;
};

const verifyEmail = async email => {
  const response = await tryWebCall(apiUrl + "/api/verify/email", "post", {
    email: email
  });
  return response;
};

const verifyUsername = async username => {
  const response = await tryWebCall(apiUrl + "/api/verify/username", "post", {
    username: username
  });
  return response;
};

const loginFileSystemUser = async (username, password) => {
  const response = await tryWebCall(
    apiUrl + "/api/login/filesystemuser",
    "post",
    {
      username: username,
      password: password
    }
  );
  return response;
};

const createUser = async (email, username) => {
  const response = await tryWebCall(apiUrl + "/api/user/create", "post", {
    email: email,
    username: username
  });
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

export {
  isVerified,
  isVerifiedFileSystem,
  createUser,
  recoverByEmail,
  verifyUsername,
  verifyEmail,
  loginFileSystemUser
};
