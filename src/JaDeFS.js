///////////////////////////////////////////////////////////
//  JaDe/src/JaDeFS.js                                   //
///////////////////////////////////////////////////////////
//
//  This module manages the filesystem.
//

    import path from 'path';
    import fs from 'fs';


    export const JaDeFS = () => {

        const __root = global.__serverConfig['fileSystem'];


///////////////////////////////////////////////////////////
//  _list()                                              //
///////////////////////////////////////////////////////////
//
        const _list = filePath => {

            if (filePath === '/')
                filePath = __root;
            else
                filePath = `${__root}${path.sep}${filePath}`;

            // console.log(`JaDeFS returning path: ${filePath}`);
            
//  Make sure filePath exists, if it's a file then
//  the file data is returned, if it's a directory
//  then the contents of the directory are returned.
//
            if(! fs.existsSync(filePath)) {
                return JSON.stringify({
                    'error': `${filePath}: No such file or directory`
                });
            }

            if (fs.lstatSync(filePath).isFile()) {
                console.log(`filePath ${filePath} is a file`)
                return JSON.stringify({
                    'fileType': 'file',
                    'filePath': filePath,
                    'fileData': fs.readFileSync(filePath)
                });
            }

            const _dirList = fs.readdirSync(filePath).map(fileName => {
                let fileType = 'directory';
                if (fs.lstatSync(`${filePath}${path.sep}${fileName}`).isFile())
                    fileType = 'file';
                return JSON.stringify({
                    'fileType': fileType,
                    'filePath': fileName,
                    'fileData': '' 
                });
            });

            return JSON.stringify(_dirList);

        };


        return {

            list: _list

        };

    };
