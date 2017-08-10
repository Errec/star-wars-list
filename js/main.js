function requestSWInfo(url, methodType){
  var promiseObj = new Promise(function(resolve, reject){
    var xhr = new XMLHttpRequest();
    xhr.open(methodType, url, true);
    xhr.send();
    xhr.onreadystatechange = function(){
      if(xhr.readyState === 4){
         if(xhr.status === 200){
          var resp = xhr.responseText;
            var respJson = JSON.parse(resp);
            resolve(respJson);
         } else{
            reject(xhr.status);
            console.log("xhr failed"); // TODO: append 'cant find' msg
           }
      } else{
         console.log("xhr processing going on"); // TODO: add loading animation
         }
    };
  });
  return promiseObj;
}

function errorHandler(statusCode){
  console.log("failed with status", status);
}
