///////////////////////////////////////////////////////////
//  JaDe/public/js/core/Terminal.js                      //
///////////////////////////////////////////////////////////
//
//  Terminal.
//

    export const Terminal = function() {

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

            const   __desktopWidth = parseInt($(`#desktop`).css('width').replace('px', ''));
            const   __desktopHeight = parseInt($(`#desktop`).css('height').replace('px', ''));

            let __width = (__desktopWidth - 80);
            let __height = (__desktopHeight - 80);

            if (__desktopWidth > 600)
                __width = 600;
            if (__desktopHeight > 400)
                __height = 400;

            $(`#window_${wInstance.id}_titlebar`).append(`(${wInstance.id - 199})`);
        
            $(`#window_${wInstance.id}`).css({
                'width': `${__width}px`,
                'height': `${__height}px`
            });

            $(`#window_${wInstance.id}_content`).css({
                'background-color': '#000',
                'color': '#FFF'
            });

        };


//  We need to request a new window from the window
//  manager...
//
        window.__windowManager.newWindow({
            'target': 'desktop',
            'elementType': 'div',
            'elementClass': 'window',
            'module': {
                'name': 'Terminal',
                'reference': Terminal
            },
            'options': {
                'showTitlebar': true,
                'titleText': 'Terminal',
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
