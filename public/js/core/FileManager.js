///////////////////////////////////////////////////////////
//  JaDe/public/js/core/FileManager.js                   //
///////////////////////////////////////////////////////////
//
//  Windowed application for managing files.
//

    export const FileManager = function() {

        console.log('FileManager ready!');

        this.__aTest = 'This is just a test';

//  We need to request a new window from the window
//  manager...
//
        window.__windowManager.newWindow({
            'target': 'desktop',
            'elementType': 'div',
            'elementClass': 'window',
            'module': {
                'name': 'FileManager',
                'reference': FileManager
            },
            'options': {
                'showTitlebar': true,
                'titleText': 'File Manager',
                'canMaximise': true,
                'canMinimise': true,
                'canClose': true,
                'canResize': true,
                'isSingleton': false,
                'canTerminate': true
            },
            'onload': wInstance => {
                __initialise(wInstance);
            }
        });


        let _wInstance = false;


///////////////////////////////////////////////////////////
//  __initialise()                                       //
///////////////////////////////////////////////////////////
//
        const __initialise = wInstance => {

            _wInstance = wInstance;

            console.log('Window ready!');
            $(`#${wInstance.id}_content`).html(wInstance);

        };


        return {

            wInstance: _wInstance

        };

    };
