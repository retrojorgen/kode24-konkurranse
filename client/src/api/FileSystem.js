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
    console.log('fisen min', error);
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
        console.log(response);
        throw new Error('401');
    }
  })
.then(response => {
    success(response);
})
.catch(error => isAuth(error, fail));
}


const authByEmail = (email, success, fail) => {
    fetch('/api/verify/recover', {
        method: 'post',
        headers:{
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({email: email})
        })
        .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            return fail();
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

const createUser = (email, username, success, fail) => {
    fetch('/api/user/create', {
        method: 'post',
        headers:{
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({email: email, username: username})
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
            console.log('respåns', response);
          throw new Error('404');
        }
      })
    .then(response => {
        success(response);
    })
    .catch(error => fail(error));
}


export { getHelp, getListFromDirectory, getContentsOfFile, submitPathCode, isVerified, createUser, authByEmail };