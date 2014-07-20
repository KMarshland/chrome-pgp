var otherKeys = [];

function save_options() {
  
  var newKey = {
    name: document.getElementById('newname').value,
    pkey: document.getElementById('newpublickey').value
  };
  if (newKey.name != "" && newKey.pkey != "") {
    otherKeys.push(newKey);
    document.getElementById('newname').value = "";
    document.getElementById('newpublickey').value = "";
  }
  
  
  localStorage['otherKeys'] = JSON.stringify(otherKeys);

  // Update status to let user know options were saved.
  restore_options();
  
  var status = document.getElementById("status");
  status.innerHTML = "Options Saved.";
  setTimeout(function() {
    status.innerHTML = "";
  }, 750);
}

// Restores select box state to saved value from localStorage.
function restore_options() {
  var public_key = localStorage['pkey'];
  
  if (public_key == null) {
    generate_keys();
    public_key = localStorage['pkey'];
  }
  
  document.getElementById('public-key').innerText = public_key;
  
  otherKeys = localStorage['otherKeys'];
  if (otherKeys == null || otherKeys == "") {
    otherKeys = [];
    localStorage['otherKeys'] = [];
  } else {
    otherKeys = JSON.parse(otherKeys);
  }
  
  var ninner = "";
  for (var i = 0; i < otherKeys.length; i++){
    ninner += "<tr>";
    
    ninner += "<td>";
    ninner += otherKeys[i].name;
    ninner += "</td>";
    
    ninner += "<td>";
    ninner += otherKeys[i].pkey;
    ninner += "</td>";
    
    ninner += "</tr>";
  }
  
  document.getElementById('otherKeysBody').innerHTML = ninner;
}

function generate_keys() {
  var key = genkey();
  
  localStorage['pkey'] = key.pkey;
  localStorage['p'] = JSON.stringify(key.p);
  localStorage['q'] = JSON.stringify(key.q);
  localStorage['d'] = JSON.stringify(key.d);
  localStorage['u'] = JSON.stringify(key.u);
}

function showGenerateDiv() {
  document.getElementById('generateDiv').style.display = 'block';
}

function hideGenerateDiv() {
  document.getElementById('generateDiv').style.display = 'none';
}

document.addEventListener('DOMContentLoaded', restore_options);
document.querySelector('#save').addEventListener('click', save_options);

document.querySelector('#generate').addEventListener('click', showGenerateDiv);
document.querySelector('#generateYes').addEventListener('click', function(){generate_keys();hideGenerateDiv();});
document.querySelector('#generateNo').addEventListener('click', hideGenerateDiv);
