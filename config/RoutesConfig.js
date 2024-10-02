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
            '/exec_command/:command_string': (req, res) => {
                const __commandString = req.params.command_string;

                const _objResponse = {
                    'output': 'Your output, m\'sieur!'
                };

                console.log(`Received command: ${__commandString}`);

                return res.send(JSON.stringify(_objResponse));
            }

        },

    };

    