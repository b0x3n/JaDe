///////////////////////////////////////////////////////////
//  JaDe/public/js/core/Terminal.js                      //
///////////////////////////////////////////////////////////
//
//  Terminal.
//

    export const Terminal = function() {

        let _wInstance = false;

        let _terminalID = `window_%id%_content`;
        let _terminalSize;
        let _terminalRows;
        let _terminalCols;

        let _fontFamily = "'VT323', monospace";

        let _cellWidth = 0;
        let _cellHeight = 12;

        let _fontColor = '#FFF';
        let _fontBackground = '#000';

        let _cursorColor = '#FFF';
        let _cursorBackground = '#000';


///////////////////////////////////////////////////////////
//  __calculateCellWidth()                               //
///////////////////////////////////////////////////////////
//
//  Populate the terminal with a single character then
//  grab the width - the font needs to be monospace.
//
        const __calculateCellWidth = () => {

            $(`#${_terminalID}`).html(`
                <div
                    id="${_terminalID}_testwidth"
                    class="terminal_cell"
                    style="
                        font-family: ${_fontFamily};
                        font-size: ${_cellHeight}px;
                    "
                >
                    X
                </div>
            `);
            
            _cellWidth = parseInt($(`#${_terminalID}_testwidth`).css('width').replace('px', ''))
        
            $(`#${_terminalID}`).html('');

        };


///////////////////////////////////////////////////////////
//  __createTerminalDisplay()                            //
///////////////////////////////////////////////////////////
//
        const __createTerminalDisplay = () => {

            __calculateCellWidth();
            _terminalSize = document.getElementById(`window_${_wInstance.id}`).getBoundingClientRect();

            console.log(`Cell width: ${_cellWidth}`);

            _terminalRows = Math.floor(_terminalSize.height / _cellHeight);
            _terminalCols = Math.floor(_terminalSize.width / _cellWidth);
        
            $(`#${_terminalID}`).css({
                'color': _fontColor,
                'background-color': _fontBackground
            });
            
        };


///////////////////////////////////////////////////////////
//  __initialise()                                       //
///////////////////////////////////////////////////////////
//
//  The WindowManager will call this method after it
//  creates the new window.
//
        const __initialise = wInstance => {

            _wInstance = wInstance;
            _terminalID = _terminalID.replace('%id%', wInstance.id);

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
            
            __createTerminalDisplay();

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
