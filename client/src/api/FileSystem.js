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
    fetch(('/api/filesystem/' + path + "?command=list").toLowerCase(), {
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

const checkPath = (path, success, fail) => {
    fetch(('/api/filesystem/' + path).toLowerCase(), {
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

export { getHelp, getListFromDirectory, checkPath, getContentsOfFile };