const getHelp = (success, fail) => {
  fetch("/api/help", {
    method: "get",
    headers: {
      "Content-Type": "application/json"
    }
  })
    .then(res => res.json())
    .then(response => {
      success(response);
    });
};

const isVerified = (success, fail) => {
  fetch("/api/verify/", {
    method: "get"
  })
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("401");
      }
    })
    .then(response => {
      success(response);
    })
    .catch(error => fail(error));
};

const recoverByEmail = (email, success, fail) => {
  fetch("/api/verify/recover", {
    method: "post",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ email: email })
  })
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("404");
      }
    })
    .then(response => {
      success(response);
    })
    .catch(error => fail(error));
};

const verifyEmail = (email, success, fail) => {
  fetch("/api/verify/email", {
    method: "post",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ email: email })
  })
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("404");
      }
    })
    .then(response => {
      success(response);
    })
    .catch(error => fail(error));
};

const verifyUsername = (username, success, fail) => {
  fetch("/api/verify/username", {
    method: "post",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ username: username })
  })
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("404");
      }
    })
    .then(response => {
      success(response);
    })
    .catch(error => fail(error));
};

const getListFromDirectory = (path, success, fail) => {
  if (!path) path = "\\";
  fetch("/api/filesystem/", {
    method: "post",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ path: path })
  })
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("404");
      }
    })
    .then(response => {
      success(response);
    })
    .catch(error => fail(error));
};

const createUser = (email, username, success, fail) => {
  fetch("/api/user/create", {
    method: "post",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ email: email, username: username })
  })
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("404");
      }
    })
    .then(response => {
      success(response);
    })
    .catch(error => fail(error));
};

const getContentsOfFile = (path, fileName, success, fail) => {
  fetch("/api/files", {
    method: "post",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      path: path,
      fileName: fileName
    })
  })
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("404");
      }
    })
    .then(response => {
      success(response);
    })
    .catch(error => fail(error));
};

const submitPathCode = (path, code, success, fail) => {
  fetch("/api/code", {
    method: "post",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      path: path,
      code: code
    })
  })
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("404");
      }
    })
    .then(response => {
      success(response);
    })
    .catch(error => fail(error));
};

export {
  getHelp,
  getListFromDirectory,
  getContentsOfFile,
  submitPathCode,
  isVerified,
  createUser,
  recoverByEmail,
  verifyUsername,
  verifyEmail
};
