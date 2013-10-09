function Node(parent, key, value)
{
    this.parent=parent;
    this.key=key;
    this.value=value;
}

function dynamicSort(property) {
    var sortOrder = 1;
    if(property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1, property.length - 1);
    }
    return function (a,b) {
        var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
        return result * sortOrder;
    };
}

function dynamicSortMultiple() {
    /*
     * save the arguments object as it will be overwritten
     * note that arguments object is an array-like object
     * consisting of the names of the properties to sort by
     */
    var props = arguments;
    return function (obj1, obj2) {
        var i = 0, result = 0, numberOfProperties = props.length;
        /* try getting a different result from 0 (equal)
         * as long as we have extra properties to compare
         */
        while(result === 0 && i < numberOfProperties) {
            result = dynamicSort(props[i])(obj1, obj2);
            i++;
        }
        return result;
    };
}

var app = {
    
    processJS: function(js, nodes, keys, callback) {
        var a;
        var b;
        var c;
        var d;
        var l=0;
        var chr='';
        var myNode;
        var text='';
        var comment='';
        app.replaceLinebreaks(js, function(jsnew) {
            if (js.indexOf('i18n.t(') >= 0) {
                a = jsnew.split("i18n.t(");
                l = a.length;
                for (var i=1;i<l;i++) {
                    chr=a[i].charAt(0); 
                    b = a[i].split(chr);
                    key = b[1];
                    app.getParent(key, function(retParent, retKey) {
                          parent = retParent;
                          key = retKey;
                          text = "TODO";
                          if (a[i].indexOf('//') >= 0) {
                              c = a[i].split("//");
                              comment = c[1].trim();
                              console.log("comment:" + comment);
                              if (comment.length >= 1) {
                                  chr=comment.charAt(0);
                                  if (chr === "'" || chr === '"') {
                                      d = comment.split(chr);
                                      if (d.length >= 2) {
                                          text = d[1];
                                      }
                                  }
                              }
                          }
                          myNode = new Node(parent, key, text); 
                          console.log(parent + "." + key);
                          console.log(keys);
                          console.log(keys.indexOf(parent + "." + key));
                          if (keys.indexOf(parent + "." + key)===-1) {
                            nodes.push(myNode);
                            keys.push(parent + "." + key);
                          }
                    });
                    if (i === (l-1)) {
                        callback(nodes, keys);   
                    }
                }   
            } else {
                callback(nodes, keys);
            }
        });
        
    },
    
    processHTML: function(html, nodes, keys, callback) {
        var a;
        var b;
        var l;
        var attr='';
        var key='';
        var parent='';
        var attrVal='';
        var target='';
        var text=''; 
        
        app.replaceLinebreaks(html, function(htmlnew) {
            a = htmlnew.split('<');
            l = a.length;
            for (var i=0;i<l;i++) {
                attr='data-i18n';
                if (a[i].indexOf(attr) >= 0) {
                    tag = '<' + a[i];
                    app.getAttr(tag, attr, function(ret) {
                       key = ret;  
                       app.getTarget(key, function(retTarget, retKey) {
                           target = retTarget;
                           key = retKey;
                           app.getParent(key, function(retParent, retKey) {
                              parent = retParent;
                              key = retKey;
                              if (target === '' || target==='html') {
                                app.getText(tag, function(ret) {
                                  text = ret;
                                  if (text==='') {
                                      text='TODO';
                                  }
                                  myNode = new Node(parent, key, text); 
                                  console.log(parent + "." + key);
                                  console.log(keys);
                                  console.log(keys.indexOf(parent + "." + key));
                                  if (keys.indexOf(parent + "." + key)===-1) {
                                    nodes.push(myNode);
                                    keys.push(parent + "." + key);
                                  }
                                });    
                              } else {
                                app.getAttr(tag, target, function(ret) {
                                    text = ret;
                                    myNode = new Node(parent, key, text); 
                                    if (keys.indexOf(parent + "." + key)===-1) {
                                        nodes.push(myNode);
                                        keys.push(parent + "." + key);
                                  }
                                }); 
                              }
                           });
                       });                    
                    });
                }
                if (i === (l-1)) {
                    callback(nodes, keys);
                }
            } 
        });
    },
    
    getParent: function(key, callback) {
        var a;
        if (key.indexOf(".") >= 0) {
            a = key.split(".");
            callback(a[0], a[1]);
        } else {
            callback('', key);
        }
    },
    
    getTarget: function(text, callback) {
        var a;
        var target='';
        if (text.indexOf("[") === 0) {
            if (text.indexOf("]") > 0) {
                a = text.split("]");
                callback(a[0].substring(1, a[0].length), a[1]);
            } else {
                callback('', text);   
            }
        } else {
            callback('', text);
        }
    },
    
    makeJSON: function(nodes, callback) {
        var json='{\n';
        var l=nodes.length;
        var prevParent;
        var spacing='    ';
        
        nodes.sort(dynamicSortMultiple("parent", "key"));

        for (var i=0;i<l;i++) {
            if (nodes[i].parent !== prevParent) {
                if (nodes[i].parent !== '') {
                    spacing = '      ';
                    if (prevParent !== '' && prevParent !== undefined) {
                        json += "\n    },\n";
                    }
                    json += '    "' + nodes[i].parent + '": {\n';
                } else {
                    spacing = '    ';
                    json += '    ,\n'
                }
            } else {
                json += ",\n";
            }
            json += spacing + '"' + nodes[i].key + '": "' + nodes[i].value + '"';
            prevParent = nodes[i].parent;
        }
        json +="\n    }\n}";
        callback(json);
    },
    
    replaceLinebreaks: function(text, callback) {
      text = text.replace(/(\r\n|\n|\r)/gm,"");
      callback(text);  
    },
    
    getAttr: function(tag, attr, callback) {
      var val='';
      var a;
      var b;
      var chr;
      if (tag.indexOf(attr + '=') >= 0) {
          a = tag.split(attr + '=');
          if (a[1].length > 0) {
            chr=a[1].charAt(0);
            switch (chr) {
                case "'":
                    b = a[1].split("'");
                    val=b[1];
                    break;
                case '"':
                    b = a[1].split('"');
                    val = b[1];
                    break;
                default:
                    b = a[1].split(' ');
                    val=b[0];
                    break;
            }
            callback(val);  
          }
      }
    },
    
    getText: function(tag, callback) {
        var text='';
        var a;
        var b;
        if (tag.indexOf('<') >= 0) {
            a = tag.split('<');
            for (var i=0;i<a.length;i++) {
                if (a[i].indexOf('>') >= 0) {
                    b = a[i].split('>');
                    text += b[1];
                } else {
                    text += a[i];
                }
            }
            text = text.trim();
            callback(text);   
        }
    },
    
    initialize: function() {
                
        $('#btnGen').on('click', function(e) {
           var $elHtmlIn = $('#inputHTML');
           var $elJsIn = $('#inputJS');
           var $elOut = $('#outputJSON');
           var html = $elHtmlIn.val();
           var js = $elJsIn.val();
           var nodes=[];
           var keys=[];
           app.processHTML(html, nodes, keys, function(nodes, keys) {
               app.processJS(js, nodes, keys, function(nodes, keys) {
                  app.makeJSON(nodes, function(json) {
                        $elOut.val(json); 
                  }); 
               }); 
           });
        });
    },
};

app.initialize();
