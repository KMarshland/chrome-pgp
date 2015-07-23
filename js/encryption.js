$( document ).ready(function(){
    ENCRYPTION_UTILS = (function(){
        function s2b(a){var f=1,b=[0],e=0,g=0,i=256;var d=a.length*8;for(var h=0;h<d;h++){if((i<<=1)>255){i=1;c=a.charCodeAt(g++)}if(f>bm){f=1;b[++e]=0}if(c&i){b[e]|=f}f<<=1}return b}
        function b2s(j){var e=1,i=0,a=[0],d=1,h=0;var k=j.length*bs;var f,g="";for(f=0;f<k;f++){if(j[i]&e){a[h]|=d}if((d<<=1)>255){d=1;a[++h]=0}if((e<<=1)>bm){e=1;i++}}while(h>=0&&a[h]==0){h--}for(f=0;f<=h;f++){g+=String.fromCharCode(a[f])}return g}
        function s2hex(d){var a="";for(var b=0;b<d.length;b++){c=d.charCodeAt(b);a+=((c<16)?"0":"")+c.toString(16)}return a}
        function hex2s(d){var b="";if(d.indexOf("0x")==0||d.indexOf("0X")==0){d=d.substr(2)}if(d.length%2){d+="0"}for(var a=0;a<d.length;a+=2){b+=String.fromCharCode(parseInt(d.slice(a,a+2),16))}return b};

        function generatePGPKeypair(opts, callback) {
            if (!opts){
                return callback("No options found");
            }
            opts.numBits = opts.numBits || 2048;
            opts.userId = opts.userId || 'me';

            if (!opts.userId){
                return callback("No userId specified");
            }

            if (!opts.passphrase){
                return callback("No passphrase specified");
            }

            openpgp.generateKeyPair(opts).then(function (keypair) {
                callback(null, {
                    private: keypair.privateKeyArmored,
                    public: keypair.publicKeyArmored
                });
            }).catch(function (error) {
                callback(error, null);
            });
        }

        function encryptWithKey(opts, callback){
            if (!opts.message){
                return callback("No message provided");
            }

            if (!opts.key){
                return callback("No message key");
            }

            var key = openpgp.key.readArmored(opts.key);

            openpgp.encryptMessage(key.keys, opts.message).then(function(pgpMessage) {
                callback(null, pgpMessage);
            }).catch(function(error) {
                callback(error);
            });
        }

        function decryptWithKey(opts, callback){
            if (!opts.message){
                return callback("No message provided");
            }

            if (!opts.key){
                return callback("No key");
            }

            if (!opts.passphrase){
                return callback("No passphrase");
            }

            var privateKey = openpgp.key.readArmored(opts.key).keys[0];
            privateKey.decrypt(opts.passphrase);

            var pgpMessage = openpgp.message.readArmored(opts.message);

            openpgp.decryptMessage(privateKey, pgpMessage).then(function(pgpMessage) {
                callback(null, pgpMessage);
            }).catch(function(error) {
                callback(error);
            });
        }

        function symmetricEncrypt(opts, callback){
            if (!opts.message){
                return callback("No message provided");
            }

            if (!opts.key){
                return callback("No message key");
            }

            callback(null, aesStringify(CryptoJS.AES.encrypt(opts.message, opts.key)));
        }

        function symmetricDecrypt(opts, callback){
            if (!opts.message){
                return callback("No message provided");
            }

            if (!opts.key){
                return callback("No message key");
            }

            callback(null, hex2s(CryptoJS.AES.decrypt(aesParse(opts.message), opts.key).toString()));
        }

        function aesStringify(en) {
            return CryptoJS.AES.encrypt('', '').formatter.stringify(en);
        }

        function aesParse(str) {
            return CryptoJS.AES.encrypt('', '').formatter.parse(str);
        }

        function secureRandom(num){
            num = num || 128;
            var r = window.crypto.getRandomValues(new Uint8Array(num + 8));
            return hex2s(Array.prototype.join.apply(r, [''])).substr(0,num);
        }

        function encrypt(opts, callback){
            if (!opts.message){
                return callback("No message provided");
            }

            if (!opts.key){
                return callback("No key");
            }

            //generate a key and symmetrically encrypt the corpus with that
            var symKey = secureRandom(256);
            symmetricEncrypt({
                key: symKey,
                message: opts.message
            }, function(err, encrypted){
                if (err){
                    return callback(err);
                }

                //asymmetrically encrypt the generated key
                encryptWithKey({
                    message: symKey,
                    key: opts.key
                }, function(err, messageKey){
                    if (err){
                        return callback(err);
                    }

                    callback(null, {
                        key: messageKey,
                        message: encrypted
                    });
                })
            })
        }

        function decrypt(opts, callback){
            if (!opts.message){
                return callback("No message provided");
            }
            if (!opts.key){
                return callback("No key");
            }
            if (!opts.passphrase){
                return callback("No passphrase");
            }

            if (!opts.message.key){
                return callback("No message.key provided");
            }
            if (!opts.message.message){
                return callback("No message.message provided");
            }

            decryptWithKey({
                key: opts.key,
                passphrase: opts.passphrase,
                message: opts.message.key
            }, function(err, key){
                if (err){
                    return callback(err);
                }

                symmetricDecrypt({
                    key: key,
                    message: opts.message.message
                }, function(err, message){
                    if (err){
                        return callback(err);
                    }

                    callback(null, message);
                });
            });
        }

        return {
            generatePGPKeypair: generatePGPKeypair,
            encryptWithKey: encryptWithKey,
            decryptWithKey: decryptWithKey,
            symmetricEncrypt: symmetricEncrypt,
            symmetricDecrypt: symmetricDecrypt,
            aesParse: aesParse,
            aesStringify: aesStringify,
            hex2s: hex2s,
            secureRandom: secureRandom,
            encrypt: encrypt,
            decrypt: decrypt
        };
    })();
});