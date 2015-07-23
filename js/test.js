$( document ).ready(function(){
    (function(debugging){
    if (!debugging){
        return;
    }

    function puts(err, result){
        if (err){
            console.log(err);
        } else {
            console.log(result);
        }
    }
    window.puts = puts;
    for (var i in ENCRYPTION_UTILS){
        window[i] = ENCRYPTION_UTILS[i];
    }

    window.benchmark = function(opts, callback){
        var start = new Date().valueOf();
        var whenEnded = function(){
            var totalTime = new Date().valueOf() - start;
            callback({
                totalTime: (totalTime/1000).toFixed(1) + 's',
                averageTime: (totalTime/opts.trials).toFixed(3) + 'ms'
            })
        };

        if (opts.async){
            var trialNum = 0;
            var next = function() {
                trialNum ++;
                if (trialNum > opts.trials){
                    return whenEnded();
                }
                opts.f(function () {
                    next();
                });
            };
            next();
        } else {
            for (var i = 0; i < opts.trials; i++){
                opts.f();
            }
            whenEnded();
        }


    };

    TEST = {
        withKey: function(callback){
            callback = callback || puts;

            var message = 'Hi there';
            var passphrase = ENCRYPTION_UTILS.secureRandom(100);

            ENCRYPTION_UTILS.generatePGPKeypair({
                passphrase: passphrase
            }, function (err, keys){
                if (err){
                    return callback(err);
                }
                ENCRYPTION_UTILS.encryptWithKey({
                    key: keys.public,
                    message: message
                }, function(err, res){
                    if (err){
                        return callback(err);
                    }

                    ENCRYPTION_UTILS.decryptWithKey({
                        message: res,
                        key: keys.private,
                        passphrase: passphrase
                    }, function(err, res){
                        if (err){
                            return callback(err);
                        }

                        callback(err, {
                            success: res === message,
                            expected: message,
                            received: message
                        });
                    });
                });
            });
        },
        full: function(callback){
            callback = callback || puts;

            var message = 'Hi there';
            var passphrase = ENCRYPTION_UTILS.secureRandom(100);

            ENCRYPTION_UTILS.generatePGPKeypair({
                passphrase: passphrase
            }, function (err, keys){
                if (err){
                    return callback(err);
                }
                ENCRYPTION_UTILS.encrypt({
                    key: keys.public,
                    message: message
                }, function(err, res){
                    if (err){
                        return callback(err);
                    }

                    ENCRYPTION_UTILS.decrypt({
                        message: res,
                        key: keys.private,
                        passphrase: passphrase
                    }, function(err, res){
                        if (err){
                            return callback(err);
                        }

                        callback(err, {
                            success: res === message,
                            expected: message,
                            received: message
                        });
                    });
                });
            });
        }
    };
})(true);
});