const getHelp = (success, fail) => {
  fetch('/api/help', {
      method: 'get',
      headers:{
          'Content-Type': 'application/json'
      }

  })
  .then(res => res.json())
  .then(response => {
      success(response);
  });
}

const isAuth = (error, callback) => {
    console.log(error);
    callback(error);
}

const isVerified = (success, fail) => {
fetch('/api/verify/', {
    method: 'get'
 })
 .then(response => {
    if (response.ok) {
      return response.json();
    } else {
      throw new Error('404');
    }
  })
.then(response => {
    success(response);
})
.catch(error => isAuth(error, fail));
}



const getListFromDirectory = (path, success, fail) => {
    if(!path)
        path = "\\";
    fetch('/api/filesystem/', {
        method: 'post',
        headers:{
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({path: path})
     })
     .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('404');
        }
      })
    .then(response => {
        success(response);
    })
    .catch(error => isAuth(error, fail));
  }
const getContentsOfFile = (path, fileName, success, fail) => {
    fetch('/api/files', {
        method: 'post',
        headers:{
            'Content-Type': 'application/json'
        },
        body : JSON.stringify({
            path: path,
            fileName: fileName
        })
    })
    .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('404');
        }
      })
    .then(response => {
        success(response);
    })
    .catch(error => fail(error));
}

const submitPathCode = (path, code, success, fail) => {
    fetch('/api/code', {
        method: 'post',
        headers:{
            'Content-Type': 'application/json'
        },
        body : JSON.stringify({
            path: path,
            code: code
        })
    })
    .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('404');
        }
      })
    .then(response => {
        success(response);
    })
    .catch(error => fail(error));
}


export { getHelp, getListFromDirectory, getContentsOfFile, submitPathCode, isVerified };