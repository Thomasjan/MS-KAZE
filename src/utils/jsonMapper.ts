

//function to replace the values of a json object with the values of a given object
function jsonMapper(json: Object, fields: Object): Object {
    if (typeof json === 'object') {
      if (Array.isArray(json)) {
        json.forEach((item, index) => {
          json[index] = jsonMapper(item, fields);
        });
      } else {
        for (const key in json) {
          if (json.hasOwnProperty(key)) {
            json[key] = jsonMapper(json[key], fields);
  
            // Check if the current key corresponds to a field
            if (fields.hasOwnProperty(json[key])) {
              json[key] = fields[json[key]];
            }
          }
        }
      }
    }
    return json;
}

export default jsonMapper;