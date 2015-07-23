function checkPassword(opts, callback){
    if (!opts.keys.private || !opts.keys.public){
        return callback({
            correct: true,
            exists: false
        });
    }

    try {
        var message = 'Test message';
        var onError = function(err){
            return callback({correct: false, exists: true, errors: err});
        };
        encryptWithKey({
            key: opts.keys.public,
            message: message
        }, function(err, res){
            if (err){
                return onError(err)
            }

            decryptWithKey({
                message: res,
                key: opts.keys.private,
                passphrase: opts.password
            }, function(err, res){
                if (err){
                    return onError(err)
                }

                if (res == message){
                    return callback({correct: true, exists: true});
                }
                return callback({correct: false, exists: true});
            });
        });
    } catch (e){
        return callback({correct: false, exists: true});
    }
}