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

const getListFromDirectory = (path, success, fail) => {
    if(!path)
        path = "\\";
    fetch(('/api/filesystem/'), {
        method: 'post',
        headers:{
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({path: path})
     })
    .then(res => res.json())
    .then(response => {
        success(response);
    });
  }
const getContentsOfFile = (path, file, success, fail) => {
    fetch(('/api/filesystem/' + path + "?command=print&file=" + file).toLowerCase(), {
        method: 'get',
        headers:{
            'Content-Type': 'application/json'
        }
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

const webStart  = (password, success, fail) => {
    fetch(('/api/webstart/?command=' + password.toLowerCase()), {
        method: 'get',
        headers:{
            'Content-Type': 'application/json'
        }
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


export { getHelp, getListFromDirectory, getContentsOfFile, webStart };