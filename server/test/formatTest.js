console.log('rrr......')
function formatToJSON(data) {
  let language = {}
  const keys = Object.keys(data);
  console.log('keys ', keys)
  for(let key of keys){
    const meta = data[key];
    console.log("meta", meta)
    if(meta.value){
      language[key] = meta.value
    } else {
      language[key] = formatToJSON(data[key])
    }
  }
  return language;
}

const data = {
  "toc": {
      "value": "Table of Content",
      "status": "in review",
      "addedDate": "Thu, 01 Oct 2020 06:23:43 GMT",
      "updatedDate": "Thu, 01 Oct 2020 06:23:43 GMT"
  },
  "navBar": {
      "search": {
          "value": "Search Books",
          "status": "in review",
          "addedDate": "Thu, 01 Oct 2020 06:23:43 GMT",
          "updatedDate": "Thu, 01 Oct 2020 06:23:43 GMT"
      }
  },
  "gridToggle": {
      "value": "List view English",
      "status": "in review",
      "addedDate": "Thu, 01 Oct 2020 11:18:08 GMT",
      "updatedDate": "Thu, 01 Oct 2020 11:18:08 GMT"
  }
}

const formattedData = formatToJSON(data);
console.log('------')
console.log(formattedData)