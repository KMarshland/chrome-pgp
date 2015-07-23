$( document ).ready(function(){
    //debugging
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

        generatePGPKeypair({userId: 'me', passphrase: 'pass'}, function(err, res){
            KEYS = res;
            encryptWithKey({
                key: KEYS.public,
                message: 'Hi there'
            }, function(err, res){
                ENCRYPTED = res;
            });
        });

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

        window.test = function(callback){
            ENCRYPTION_UTILS.encrypt({
                key: KEYS.public,
                message: 'Hi there'
            }, function(err, encrypted){
                if (err){
                    callback(err);
                }

                ENCRYPTION_UTILS.decrypt({
                    key: KEYS.private,
                    message: encrypted,
                    passphrase: 'Test'
                }, puts)
            })
        };
    })(true);
});