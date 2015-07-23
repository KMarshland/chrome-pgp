$( document ).ready(function() {
    chrome.storage.sync.get('keys', function(r){
        KEYS = r.keys;
        afterKeysReceived(r.keys);
    });
});

function saveKeys(keys, callback){
    console.log('Saving', keys);
    chrome.storage.sync.set({'keys': keys}, callback);
}
function afterKeysReceived(keys){

    console.log(keys);

    function populateKeyFields(){
        $('.publicKey').val(keys.public);
    }

    $('.unlock').find('form').on('submit', function(e){
        //check the password
        checkPassword({
            keys: keys,
            password: $('[name="passphrase"]').val()
        }, function(r){
            if (r.correct){
                if (r.exists){
                    populateKeyFields();
                } else {
                    $('.publicKey').val("Generating key...");
                    ENCRYPTION_UTILS.generatePGPKeypair({
                        passphrase: $('[name="passphrase"]').val()
                    }, function(err, res){
                        if (err){
                            return console.log("Error: ", err);
                        }
                        keys = res;
                        saveKeys(keys, function(){
                            populateKeyFields();
                        });
                    })
                }

                $('.unlock').fadeOut();
                $('.unlocked').fadeIn();
            } else {
                $('.incorrectPassword').slideDown();
            }
        });

        e.preventDefault();
        return false;
    });

    $('[name="passphrase"]').on('keyup', function(){
        $('.incorrectPassword').slideUp();
    });
}