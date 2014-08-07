
function buildEncryptButtons() {
  otherKeys = localStorage['otherKeys'];
  if (otherKeys == null || otherKeys == "") {
    otherKeys = [];
    localStorage['otherKeys'] = [];
  } else {
    otherKeys = JSON.parse(otherKeys);
  }
  
  var ninner = "<table>";
  for (var i = 0; i < otherKeys.length; i++){
    ninner += "<tr>";
    
    ninner += "<td>";
      ninner += "<button class='encryptButton' value=\"";
      ninner += otherKeys[i].pkey + "\">";
        ninner += "Encrypt for ";
        ninner += otherKeys[i].name;
      ninner += "</button>";
    ninner += "</td>";
    
    ninner += "</tr>";
  }
  ninner += "</table>"
  
  document.getElementById('encryptForOthersWrapper').innerHTML = ninner;
  
  document.getElementById('encryptForMe').value = localStorage['pkey'];
  
  var bts = document.getElementsByClassName('encryptButton');
  for (var i = 0; i < bts.length; i++){
    bts[i].addEventListener('click', function(){
      console.log(this);
      encryptPending(this.value);
    });
  }
}

function aesStringify(en){
  return JSON.stringify({str: CryptoJS.AES.encrypt('', '').formatter.stringify(en)});
}

function aesParse(str){
  str = str.str;
  return CryptoJS.AES.encrypt('', '').formatter.parse(str);
}

function loadClipboard(callback, resultAsArgument, args) {
  chrome.storage.local.get('Clipboard', function(info) {
    if (info.Clipboard != null) {
      if (resultAsArgument) {
        callback(info.Clipboard, args);
      }
    }
    callback(args);
  });
}

function saveClipboard(val, callback, args){  
  chrome.storage.local.set({'Clipboard': val}, function() {
    callback(args);
  });
}

function safeEncrypt(str, pkey) {
  pkey = pkey || (localStorage['pkey']);
  return JSON.stringify(_encrypt(str, pkey));
}

function safeDecrypt(jsonCipherStr) {
  var key = {
    p: JSON.parse(localStorage['p']),
    q: JSON.parse(localStorage['q']),
    d: JSON.parse(localStorage['d']),
    u: JSON.parse(localStorage['u'])
  };
  return _decrypt(jsonCipherStr, key.p, key.q, key.d, key.u);
}

function injectScript(cod, callback) {
  chrome.tabs.executeScript(
    {
      code: cod
    }, function(results){
      callback(results[0]);
    }
  );
}

function encryptMessage(message, theirPKey) {
  theirPKey = theirPKey || localStorage['pkey'];
  
  var rKey = randomString();
  var rEnc = CryptoJS.AES.encrypt(message, rKey);
  //save the encryped version
  var enc = '[' +
    safeEncrypt(rKey) + ',' +
    safeEncrypt(rKey, theirPKey) + ',' +
    aesStringify(rEnc) + '' +
  ']';
  
  return enc;
}

function decryptMessage(message) {
  //var unwrapped = message.substr(1, message.length - 2);
      
  var parsed = JSON.parse(message);
  var theirsP = parsed[0];
  var mineP = parsed[1];
  
  var rMessage = (parsed[2]);
  
  var dec = safeDecrypt(JSON.stringify(mineP));
  //console.log(dec);
  
  var decStrs = [];
  
  var decStr = "Error: could not decrypt.";
  if (dec.status == 'success') {
    rKey = dec.plaintext;
    rDec = hex2s(CryptoJS.AES.decrypt(aesParse(rMessage), rKey).toString());
    decStrs.push(rDec);
  }
  
  dec = safeDecrypt(JSON.stringify(theirsP));
  console.log(dec);
  
  rKey = "Error: could not decrypt.";
  if (dec.status == 'success') {
    rKey = dec.plaintext;
    rDec = hex2s(CryptoJS.AES.decrypt(aesParse(rMessage), rKey).toString());
    decStrs.push(rDec);
  }
  
  if (decStrs[0].trim() == '') {
    decStr = decStrs[1];
  } else if (decStrs[1].trim() == '') {
    decStr = decStrs[0];
  } else {
    decStr = decStrs[0] + '<br>-------------<br>' + decStrs[1];
  }
  
  
  return decStr.replace(/\n/g, '\\n');
}

function encryptPending(theirPKey) {
  theirPKey = theirPKey || localStorage['pkey'];
  injectScript(loadDependencies() + 'var res = {isEnc: checkEncrypted(), message: messageText()}; res;', function(res){
    var isEnc = res.isEnc;
    var message = res.message;
    //console.log(res);
    if (isEnc) {//you need to decrypt it
      var decStr = decryptMessage(message);
      
      //console.log(decStr);
      
      injectScript(loadDependencies() + 'setMessageText(\'' + decStr + '\');true;', function(res){
        
      });
    } else {//you need to encrypt it
      var enc = encryptMessage(message, theirPKey);
      injectScript(loadDependencies() + 'setMessageText(\'' + enc + '\');true;', function(res){
        
      });
    }
  });
}

function inject() {
  
  injectScript(loadDependencies() + 'getPreviousMessages();', function(messages){
    //console.log(messages);
    
    for (var i = 0; i < messages.length; i++){
      try {
        var rm = messages[i];
        if (rm.substr(0, 3) == '<p>') {
          rm = rm.substr(3);
        }
        if (rm.substr(-4, 4) == '</p>') {
          rm = rm.substr(0, rm.length - 4);
        }
        
        rm = rm.replace(/<span[^>]*>/g, '').replace(/<\/span>/g, '');
        
        if (checkEncrypted(rm)){
          messages[i] = '<p>' + decryptMessage(rm).replace(/\\n/g, '</p><p>') + '</p>';
          console.log(messages[i]);
        }
      } catch (e){
        
      }
    }
    
    //console.log(messages);
    
    injectScript(loadDependencies() + 'setPreviousMessages(' + JSON.stringify(messages) + ');true;', function(res){
        
    });
  });
}

function loadDependencies() {
  return '' + tryJSONParse + loadClipboard + saveClipboard + setPreviousMessages +
    checkEncrypted + messageText + setMessageText + getPreviousMessages;
}

function tryJSONParse(str) {
  try {
    return JSON.parse(str);
  } catch (e){
    return false;
  }
}

function messageText() {
  return document.getElementsByName('message_body')[0].value;
}

function setMessageText(val) {
  document.getElementsByName('message_body')[0].value = val;
}

function getPreviousMessages() {
  var els = document.getElementsByClassName('_38');
  var txts = []; 
  for (var i = 0; i < els.length; i++){
    txts.push(els[i].children.length == 0 ? '' : els[i].children[0].innerHTML);//.replace(/<p>/g, '').replace(/<\/p>/g, '\n'));
  }
  return txts;
}

function setPreviousMessages(txts) {
  var els = document.getElementsByClassName('_38');
  for (var i = 0; i < els.length; i++){
    els[i].children[0].innerHTML = txts[i];
  }
}

function checkEncrypted(existing) {
  
  existing = existing || document.getElementsByName('message_body')[0].value;
  var isEncrypted = false;
  
  if (existing.length > 2) {
    var parsed = tryJSONParse(existing);
    isEncrypted = !!parsed;
  }
  
  return isEncrypted;
}

document.addEventListener('DOMContentLoaded', function () {
  buildEncryptButtons();
  inject();
});

