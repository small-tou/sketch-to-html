
class NSArchiveParser {
    parse(archive) {

    let result = {};

    let objects = archive[0].$objects;
    let root = archive[0].$top.root.UID;

    let getReferenceById = (id) => {
      let r = {};
      let o = objects[id];
      if (typeof o === 'string' || typeof o === 'number' || typeof o === 'boolean') {
        return o;
      }


      if (typeof o === 'object') {
        for (var i in o) {
          if (o[i].UID) {
            r[i] = getReferenceById(o[i].UID);
          } else if (Array.isArray(o[i]) && i !== 'NS.keys' && i !== 'NS.objects') {
            r[i] = [];
            o[i].forEach((ao) => {
              if (ao.UID) {
                r[i].push(getReferenceById(ao.UID));
              } else {
                r[i].push(ao);
              }
            });
          } else if (i !== 'NS.keys' && i !== 'NS.objects') {
            r[i] = o[i];
          }

        }
      }

      if (o['NS.keys']) {
        o['NS.keys'].forEach((keyObj, index) => {
          let key = getReferenceById(keyObj.UID);
          let obj = getReferenceById(o['NS.objects'][index].UID);
          r[key] = obj;
        });
      }
      return r;
    };


    let topObj = objects[root];
    for (var key in topObj) {
      if (topObj[key].UID) {
        result[key] = getReferenceById(topObj[key].UID);
      }
    }
    return result;
  }
}

module.exports = NSArchiveParser;