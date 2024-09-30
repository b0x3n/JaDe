///////////////////////////////////////////////////////////
//  JaDe/config/DatabaseConfig.js                        //
///////////////////////////////////////////////////////////
//
//  Database configuration.
//

    import { ThemeSchema } from './../schema/ThemeSchema.js';

    
    export const DatabaseConfig = {

        'host': '127.0.0.1',
        'port': '27017',
        'name': 'JaDe_db',

//  All of the schemas used in this application are 
//  defined here.
//
//  See the DB.js file:
//
//      JaDe/src/DB.js
//
//  For more info.
//
        'schema': {

//  System theme.
//
            'themeSchema': {
                'model': 'Theme',
                'schema': ThemeSchema
            }

        }

    };
