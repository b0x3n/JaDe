///////////////////////////////////////////////////////////
//  JaDe/JaDe.js                                         //
///////////////////////////////////////////////////////////
//


    import path from 'path';
    import { fileURLToPath } from 'url';


    import { ServerConfig } from './config/ServerConfig.js';
    import { Server } from './src/Server.js';


///////////////////////////////////////////////////////////
//  Build the staticPath - this is where our html, css
//  and other files live.
//
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    ServerConfig.staticPath = `${__dirname}${path.sep}public`;


///////////////////////////////////////////////////////////
//  Initialise and run the server.
//
    const   __server = Server(ServerConfig);
    __server.runAll();
