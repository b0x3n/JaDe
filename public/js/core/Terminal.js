///////////////////////////////////////////////////////////
//  JaDe/public/js/core/Terminal.js                      //
///////////////////////////////////////////////////////////
//
//  Terminal.
//

    export const Terminal = function() {

        let _wInstance = false;
        
        let __terminalTimeoutID = false;

        let _terminalID = `window_%id%_content`;
        let _terminalSize;
        let _terminalRows;
        let _terminalCols;
        let _terminalPadTop;
        let _terminalPadLeft;

        let _fontFamily = $(`#cell_testwidth`).css('font-family');

        let _cellWidth = 0;
        let _cellHeight = parseInt($(`#cell_testwidth`).css('font-size').replace('px', ''));

        let _fontColor = $(`#cell_testwidth`).css('color');
        let _fontBackground = $(`#cell_testwidth`).css('background-color');

        let _cursorBlink = 1000;
        let _cursorColor = '#FFF';
        let _cursorBackground = '#000';

        let _cursorBlinkTimeoutID = false;

        let _cursorY = 0;
        let _cursorX = 0;

        let _inputBuffer = '';


///////////////////////////////////////////////////////////
//  __getTerminalHtml()                                  //
///////////////////////////////////////////////////////////
//
        const __getTerminalHtml = () => {

            let _terminalHtml = ``;

            for (let row = 0; row < _terminalRows; row++) {
                for (let col = 0; col < _terminalCols; col++) {
                    _terminalHtml += `
                        <div
                            id="window_${_wInstance.id}_${row}_${col}"
                            class="terminal_cell"
                            style="
                                top: ${((row * _cellHeight) + _terminalPadTop)}px;
                                left: ${((col * _cellWidth) + _terminalPadLeft)}px;
                                width: ${_cellWidth}px;
                                height: ${_cellHeight}px;
                            "
                        >
                            &nbsp;
                        </div>
                    `;
                }
            }

            return _terminalHtml;

        };


///////////////////////////////////////////////////////////
//  __createTerminalDisplay()                            //
///////////////////////////////////////////////////////////
//
        const __createTerminalDisplay = () => {

            _cellWidth = parseInt($(`#cell_testwidth`).css('width').replace('px', ''));

            _terminalSize = document.getElementById(`window_${_wInstance.id}_content`).getBoundingClientRect();

            _terminalRows = Math.floor(_terminalSize.height / _cellHeight);
            _terminalCols = Math.floor(_terminalSize.width / _cellWidth);
            _terminalPadTop = Math.floor((_terminalSize.height % _cellHeight) / 2);
            _terminalPadLeft = Math.floor((_terminalSize.width % _cellWidth) / 2);

            $(`#${_terminalID}`).css({
                'color': _fontColor,
                'background-color': _fontBackground
            });

            $(`#window_${_wInstance.id}_content`).html(__getTerminalHtml());
        
        };


///////////////////////////////////////////////////////////
//  __blinkCursor()                                      //
///////////////////////////////////////////////////////////
//
        const __blinkCursor = () => {

            const _cursorFG = $(`#window_${_wInstance.id}_${_cursorY}_${_cursorX}`).css('color');
            const _cursorBG = $(`#window_${_wInstance.id}_${_cursorY}_${_cursorX}`).css('background-color');

            $(`#window_${_wInstance.id}_${_cursorY}_${_cursorX}`).css({
                'color': _cursorBG,
                'background-color': _cursorFG
            });

        };


///////////////////////////////////////////////////////////
//  __enableCursor()                                     //
///////////////////////////////////////////////////////////
//
        const __enableCursor = () => {

            $(`#window_${_wInstance.id}_${_cursorY}_${_cursorX}`).css({
                'color': _cursorColor,
                'background-color': _cursorBackground
            });

            if (_cursorBlinkTimeoutID) {
                clearInterval(_cursorBlinkTimeoutID);
                _cursorBlinkTimeoutID = false;
            }

            _cursorBlinkTimeoutID = setInterval(() => {
                __blinkCursor();
            }, _cursorBlink);

            __blinkCursor();

        };


///////////////////////////////////////////////////////////
//  __enableKeyboardEvents()                             //
///////////////////////////////////////////////////////////
//
        const __enableKeyboardEvents = () => {

            $(`*`).on('keypress', function(ev) {

                const _key = ev.code;

                if ($(this).hasFocus())
                    console.log(`Keypress ${_key}`);

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
            __enableCursor();
            //__enableKeyboardEvents();
            
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
            },
            'resize': (id) => {
                if (__terminalTimeoutID) {
                    clearTimeout(__terminalTimeoutID);
                    __terminalTimeoutID = false;
                }

                __terminalTimeoutID = setTimeout(() => {
                    __createTerminalDisplay();
                    __terminalTimeoutID = false;
                }, 50)
            },
            'keypress': (id, ev) => {
                console.log(`Terminal ${id} got key ${ev.code}`);
            }
        });


        return {

            wInstance: _wInstance

        };

    };
