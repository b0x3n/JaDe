///////////////////////////////////////////////////////////
//  JaDe/config/RoutesConfig.js                          //
///////////////////////////////////////////////////////////
//
//  The RoutesConfig object defines all of the routes/
//  endpoints available on the server as well as the
//  handlers for those routes.
//

    import { JaDeFS } from './../src/JaDeFS.js';

    import { DefaultTheme } from './../defaults/DefaultTheme.js';

    import { DB } from './../src/DB.js';
    const __db = DB();

    import { Tokeniser } from './../src/Tokeniser.js';
    const __tokeniser = Tokeniser();


    import { lsCommand } from "./../system/bin/lsCommand.js";


    const __systemCommands = {
        'ls': lsCommand
    };

    
    function __dispatchCommand(path, tokens) {

        if (__systemCommands.hasOwnProperty(tokens[2]))
            return __systemCommands[tokens[2]](path, tokens);

        return JSON.stringify({'output': `'${tokens[2]}' is not a recognised command`});

    };


    export const RoutesConfig = {

        'get':
        {

///////////////////////////////////////////////////////////
//  Theme-related routes                                 //
///////////////////////////////////////////////////////////
//
//  Get the index.html.
//
            '/': (req, res) => {
                return res.sendFile('index');
            },

//  Get the default theme.
//
            '/default-theme': function(req, res) {
                let __theme = __db.model['Theme'].findOne({ 'name': 'Default' })
                    .then(theme => {
                        if (theme === null) {
                            console.log(`Creating theme Default`);
                            theme = DefaultTheme(__db);
                        }

                        return res.send(JSON.stringify(theme));
                    }).catch(err => {
                        console.log(`<<Error: ${err}`);
                    });
            },

/// Get specific theme by name.
//
            '/theme/:theme': (req, res) => {
                let __theme = __db.model['Theme'].findOne({ 'name': req.params.theme })
                    .then(theme => {
                        if (theme === null)
                            return res.send(JSON.stringify({ 'error': `Theme ${req.params.theme} doesn't exist` }));
                        return res.send(JSON.stringify(theme));
                    }).catch(err => {
                        console.log(`Error: ${err}`);
                    });
            },


///////////////////////////////////////////////////////////
//  fileSystem related routes                            //
///////////////////////////////////////////////////////////
//
//  /filesystem/ returns an object describing the contents
//  of the root filesystem directory - this is set in the
//  JaDe.js server file:
//
//      JaDe/JaDe.js
//
            '/filesystem/:path': (req, res) => {
                let __path = req.params.path;
                if (__path === 'root')
                    __path = '/';
                console.log(`Received fs lookup, path ${__path}`)
                return res.send(JSON.stringify(JaDeFS().list(__path)));
            },


///////////////////////////////////////////////////////////
//  Remote command execution.
//
            '/exec_command/:path/:command_string': async (req, res) => {
                let __path = decodeURIComponent(req.params.path).toString();
                let __commandString = decodeURIComponent(req.params.command_string).toString();

                const _objResponse = {
                    'output': 'Your output, m\'sieur!'
                };

                console.log(`Received command: ${__commandString}`);

//  The command needs to be tokenised.
//
                const __tokens = __tokeniser.parse_lines('stdin', __commandString);

                if (__tokens[0][2].trim() === 'exit' || __tokens[0][2].trim() === 'clear')
                    return;

                if (typeof __tokens === 'string')
                    return res.send(JSON.stringify(__tokens));
                else 
//  Now we pass the tokenised string to the command
//  dispatcher - it'll execute the appropriate command
//  and return the output.
//
                    return res.send(__dispatchCommand(__path, __tokens[0]));

                //return res.send(JSON.stringify(_objResponse));
            }

        },

    };

    