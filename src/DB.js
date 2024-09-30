///////////////////////////////////////////////////////////
//  JaDe/src/DB.js                                       //
///////////////////////////////////////////////////////////
//
//  Pretty self-explanitory, manageds the database.
//

    import mongoose from 'mongoose';

    import { DatabaseConfig } from './../config/DatabaseConfig.js';


    export const DB = (
        databaseConfig = DatabaseConfig
    ) => {

        let __host = databaseConfig['host'];
        let __port = databaseConfig['port'];
        let __name = databaseConfig['name'];

        let __dbString = `mongodb://${__host}:${__port}/${__name}`;
        
        let _schema = [];
        let _model = {};

        let _db = false;


///////////////////////////////////////////////////////////
//  __createModels()                                     //
///////////////////////////////////////////////////////////
//
//  Initialises the schemas and models - see the
//  DatabaseConfig.js file for more info - the schemas
//  parameter is an object containing schema/model
//  definitions.
//
        const __createModels = schemas => {

//  The schemas object contains a bunch of other keyed
//  objects, each of which describes a schema and model.
//
            Object.keys(schemas).forEach(schemaName => {

                const   __schema = new mongoose.Schema(
                    schemas[schemaName].schema
                );

                const   __model = mongoose.model(schemas[schemaName].model, __schema);

                _schema.push(__schema);

//  We reveal the _model array - this allows us to
//  quickly create a new model, example, let's say
//  we have a schema definition like this:
//
//      'mySchema': {
//          model: 'Profile',
//          schema: {
//              name: String,
//              age: Number
//          }
//      }
//
//  What we'll get is the model stored as:
//
//      _model['Profile']
//
//  Which we can create new instances of and use as
//  normal:
//
//      let profile = new _model['Profile'];
//      let record = profile.findOne({'name': 'Jimmy'});
// 
                _model[schemas[schemaName].model] = __model;

            });

        };


///////////////////////////////////////////////////////////
//  __initialise()                                       //
///////////////////////////////////////////////////////////
//
        const __initialise = () => {

            _db = mongoose.connect(__dbString)
                .then(() => {
                    console.log(`Connected to ${__host}:${__port}/${__name}`);
                }).catch(err => {
                    console.log(`Error: ${err}`);
                });

            if (databaseConfig.hasOwnProperty('schema'))
                __createModels(databaseConfig['schema']);

        };


        __initialise();


        return {

            db: _db,
            schema: _schema,
            model: _model

        };

    };
