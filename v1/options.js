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
    setTimeout(function () {
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
    for (var i = 0; i < otherKeys.length; i++) {
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

function exportKey() {
    /*var key = {
     pkey: localStorage['pkey'],
     p: /*JSON.parse*(localStorage['p']),
     q: /*JSON.parse*(localStorage['q']),
     d: /*JSON.parse*(localStorage['d']),
     u: /*JSON.parse*(localStorage['u'])
     };

     return '{' +
     'pkey: "' + key.pkey + '",' +
     'p: ' + key.p + ',' +
     'q: ' + key.q + ',' +
     'd: ' + key.d + ',' +
     'u: ' + key.u + '' +
     '}';*/

    var key = {
        pkey: localStorage['pkey'],
        p: JSON.parse(localStorage['p']),
        q: JSON.parse(localStorage['q']),
        d: JSON.parse(localStorage['d']),
        u: JSON.parse(localStorage['u'])
    };

    return JSON.stringify(key);
}

function middleOfStr(str) {
    return str.substr(1, str.length - 2);
}

function importKey(str) {
    var isAllowed = true;

    /*var key = eval(str);

     if (str.substr(0, 1) == '{' && str.substr(-1, 1) == '}') {
     str = middleOfStr(str);

     }*/
    var key = JSON.parse(str);

    if (isAllowed) {

        localStorage['pkey'] = key.pkey;
        localStorage['p'] = JSON.stringify(key.p);
        localStorage['q'] = JSON.stringify(key.q);
        localStorage['d'] = JSON.stringify(key.d);
        localStorage['u'] = JSON.stringify(key.u);
    }

}

function showGenerateDiv() {
    document.getElementById('generateDiv').style.display = 'block';
}

function hideGenerateDiv() {
    document.getElementById('generateDiv').style.display = 'none';
}

document.addEventListener('DOMContentLoaded', restore_options);
document.querySelector('#save').addEventListener('click', save_options);

document.querySelector('#generate').addEventListener('click', function () {
    if (confirm('This will change the keys used to encrypt your messages. ' +
            'You will be unable to see your past messages and unable to decrypt new messages until they have your new public key.' +
            '\n\nIf you aren\'t sure, then don\'t do it.' +
            '\n\nThere is no going back.'
        )) {
        showGenerateDiv();
    }
});

document.querySelector('#exportKey').addEventListener('click', function () {
    if (confirm('Never send your private key to anybody. This will allow them to decrypt messages meant for you. ' +
            '\n\nIf you just want to send someone encrypted messages, all you need to give them is your public key.'
        )) {
        //alert("Your key: " + exportKey());
        document.getElementById('private-key').innerHTML = exportKey();
    }
});

document.querySelector('#importKey').addEventListener('click', function () {
    if (confirm('Don\'t do this unless you actually know what you\'re doing. Seriously. ' +
            ''
        )) {
        //alert("Your key: " + exportKey());
        document.getElementById('private-key').innerHTML = '<textarea id="keyToImport"></textarea><button id="actuallyImport">Save</button>';
        document.querySelector('#actuallyImport').addEventListener('click', function () {
            importKey(document.getElementById('keyToImport').value);
            document.getElementById('private-key').innerHTML = '';
        });
        restore_options();
    }
});

document.querySelector('#generateYes').addEventListener('click', function () {
    generate_keys();
    hideGenerateDiv();
});
document.querySelector('#generateNo').addEventListener('click', hideGenerateDiv);
