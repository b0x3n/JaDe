///////////////////////////////////////////////////////////
//  JaDe/config/RoutesConfig.js                          //
///////////////////////////////////////////////////////////
//
//  The RoutesConfig object defines all of the routes/
//  endpoints available on the server as well as the
//  handlers for those routes.
//

    import { DB } from './../src/DB.js';


    const __db = DB();


    export const RoutesConfig = {

        'get':
        {

//  Get the index.html.
//
            '/': (req, res) => {
                return res.sendFile('index');
            },

//  Get the default theme.
//
            '/default-theme': (req, res) => {
                let __theme = __db.model['Theme'].findOne({ 'name': 'Default' })
                    .then(theme => {
                        if (theme === null)
                            theme = __createDefaultTheme();

                        return res.send(JSON.stringify(theme));
                    }).catch(err => {
                        console.log(`Error: ${err}`);
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

        }

    };


///////////////////////////////////////////////////////////
//  __createDefaultTheme()                               //
///////////////////////////////////////////////////////////
//
    function __createDefaultTheme() {
        
        const   _defaultTheme = {
            'name': 'Default',
            'taskbar': {
                'start': {
                    'background-color': 'red',
                    'color': 'white'
                },
                'background-color': 'rgba(0, 0, 127, 0.5)'
            },
            'start_menu': {
                'background-color': 'rgba(0, 0, 0, 1)'
            },
            'desktop': {
                'background-color': '#0F30E0'
            }
        };

        const __theme = new __db.model['Theme'](_defaultTheme);
        __theme.save();

        return _defaultTheme;

    };
