///////////////////////////////////////////////////////////
//  src/Server.js                                        //
///////////////////////////////////////////////////////////
//

    import express from 'express';

    import { ServerConfig } from './../config/ServerConfig.js';
    import { RoutesConfig } from './../config/RoutesConfig.js';


    export const Server = (
        serverConfig = false
    ) => {
    
        const _app = express();


///////////////////////////////////////////////////////////
//  __initialise()                                       //
///////////////////////////////////////////////////////////
//
        const __initialise = () => {

            if (! serverConfig)
                serverConfig = ServerConfig;

            if (serverConfig.hasOwnProperty('staticPath'))
                _app.use(express.static(serverConfig.staticPath));
    
            _app.use(express.urlencoded({ extended: true }));
            _app.use(express.json());

        };


///////////////////////////////////////////////////////////
//  _applyRoutes()                                       //
///////////////////////////////////////////////////////////
//
        const _applyRoutes = (
            routesConfig = RoutesConfig
        ) => {

            const   __applyRoutes = (routeMethod, routes) => {
                Object.keys(routes).forEach(route => {
                    console.log(`Adding route ${routeMethod}(${route})`);
                    if (routeMethod === 'get')
                        _app.get(route, routes[route]);
                    if (routeMethod === 'post')
                        _app.post(route, routes[route]);
                });
            };

            if (routesConfig.hasOwnProperty('get'))
                __applyRoutes('get', routesConfig['get']);
            if (routesConfig.hasOwnProperty('post'))
                __applyRoutes('post', routesConfig['post']);

        };


///////////////////////////////////////////////////////////
//  _startServer()                                       //
///////////////////////////////////////////////////////////
//
        const _startServer = (
            callback = false
        ) => {

            if (! serverConfig.hasOwnProperty('port'))
                serverConfig.port = 3412;

            _app.listen(serverConfig.port, () => {
                if (callback)
                    callback(_app);
                else
                    console.log(`Server running on port ${serverConfig.port}, static path ${serverConfig.staticPath}`);
            });

        };


///////////////////////////////////////////////////////////
//  _runAll()                                            //
///////////////////////////////////////////////////////////
//
        const _runAll = (
            serverConfig = false
        ) => {

            _applyRoutes();
            _startServer();

        };


        __initialise();


        return {

            applyRoutes: _applyRoutes,
            startServer: _startServer,
            runAll: _runAll,

            app: _app

        };

    };
