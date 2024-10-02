///////////////////////////////////////////////////////////
//  JaDe/system/bin/lsCommand.js                         //
///////////////////////////////////////////////////////////
//

    import { JaDeFS } from './../../src/JaDeFS.js';

    export function lsCommand(path, tokens) {
        let _result;

        console.log(`ls from ${path}`);
        if (path === 'root' || path === '')
            path = '/';

        if (tokens.length === 4)
            _result = JaDeFS().list(tokens[3]);
        else if (tokens.length > 4)
            _result = { 'output': 'Excess tokens following command' };
        else
            _result = JaDeFS().list(path);

        if (! _result.hasOwnProperty('output'))
            return JSON.stringify(_result);
        else
            return _result;
    }