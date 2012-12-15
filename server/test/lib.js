Object.prototype.equals = function(x)
{
  var p;
  for(p in this) {
      if(typeof(x[p])=='undefined') {
        console.log("1. type(x[" + p + "]) = " + x['id']+ " and this[" + p + "]=" + this[p] + " and x = " + x);
        return false;
      }
  }

  for(p in this) {
      if (this[p]) {
          switch(typeof(this[p])) {
              case 'object':
                  if (!this[p].equals(x[p])) { 
                    console.log("2. x[ " + p + "] = " + x[p] + " and this[" + p + "] = " + this[p]);
                    return false; 
                  } 
                  break;
              case 'function':
                  if (typeof(x[p])=='undefined' ||
                      (p != 'equals' && this[p].toString() != x[p].toString()))
                  {
                    console.log("3. x[ " + p + "] = undefined or p!= 'equals' and this[" + p + "].toString() !=" + this[p].toString() + " and x[" + p + "].toString = " + x[p].toString());
                      return false;
                  }
                  break;
              default:
                  if (this[p] != x[p]) { 
                    console.log("4. x[ " + p + "] = " + x[p] + " and this[" + p + "] = " + this[p]);
                    return false; 
                  }
          }
      } else {
          if (x[p])
          {
              console.log("5. x[ " + p + "] = " + x[p]);
              return false;
          }
      }
  }

  for(p in x) {
      if(typeof(this[p])=='undefined') {
        console.log("6. type(this[+ " + p + "]) = is undefined");
        return false;
      }
  }

  return true;
}
