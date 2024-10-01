///////////////////////////////////////////////////////////
//  JaDe/public/js/core/FileEditor.js                    //
///////////////////////////////////////////////////////////
//
//  Windowed application for editing files.
//

    export const FileEditor = function() {

        let _wInstance = false;


///////////////////////////////////////////////////////////
//  __initialise()                                       //
///////////////////////////////////////////////////////////
//
//  The WindowManager will call this method after it
//  creates the new window.
//
        const __initialise = wInstance => {

            _wInstance = wInstance;

            $(`#window_${wInstance.id}_titlebar`).append(`(${wInstance.id - 199})`);
        
        };


//  We need to request a new window from the window
//  manager...
//
        window.__windowManager.newWindow({
            'target': 'desktop',
            'elementType': 'div',
            'elementClass': 'window',
            'module': {
                'name': 'FileEditor',
                'reference': FileEditor
            },
            'options': {
                'showTitlebar': true,
                'titleText': 'File Editor',
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


        return {

            wInstance: _wInstance

        };

    };
