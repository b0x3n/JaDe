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
        let _outputBuffer = '';
        let _currentPath = '/';

        let _inputMask = false;
        let _isReset = false;


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
            _terminalCols = (Math.floor(_terminalSize.width / _cellWidth) - 2.6);
            _terminalPadTop = Math.floor((_terminalSize.height % _cellHeight) / 2);
            _terminalPadLeft = Math.floor((_terminalSize.width % _cellWidth) / 2);

            _terminalPadTop = 0;
            _terminalPadLeft = 0;

            $(`#window_${_wInstance.id}_content`).html(__getTerminalHtml());

            $(`#window_${_wInstance.id}_content`).css({
                'color': _fontColor,
                'background-color': _fontBackground
            });

            _cursorY = _cursorX = 0;
            if (_outputBuffer !== '') {
                const __buffer = _outputBuffer;
                _outputBuffer = '';
                __putString(__buffer);
            }
        
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
//  __disableCursor()                                    //
///////////////////////////////////////////////////////////
//
        const __disableCursor = () => {
            $(`#window_${_wInstance.id}_${_cursorY}_${_cursorX}`).css({
                'color': _cursorColor,
                'background-color': _cursorBackground
            });

            if (_cursorBlinkTimeoutID) {
                clearInterval(_cursorBlinkTimeoutID);
                _cursorBlinkTimeoutID = false;
            }
        };


///////////////////////////////////////////////////////////
//  __executeCommand()                                   //
///////////////////////////////////////////////////////////
//
        const __executeCommand = async () => {

            if (_inputBuffer !== '') {
//  We send the command string to the /command/ route
//  and await the response.
//
                $.ajaxSetup({'dataType': 'json'});
                
                if (_currentPath === '' || _currentPath === '/') _currentPath = 'root';
                const __commandOutput = await $.ajax(`/exec_command/${encodeURIComponent(_currentPath)}/${encodeURIComponent(_inputBuffer)}`);
                _inputBuffer = '';

                return __commandOutput;
            }

            return {};

        };


///////////////////////////////////////////////////////////
//  __addRow()                                           //
///////////////////////////////////////////////////////////
//
        const __addRow = () => {
            let _rowHtml = ''

            for (let col = 0; col < _terminalCols; col++) {
                _rowHtml += `
                    <div
                        id="window_${_wInstance.id}_${_terminalRows}_${col}"
                        class="terminal_cell"
                        style="
                            top: ${((_terminalRows * _cellHeight) + _terminalPadTop)}px;
                            left: ${((col * _cellWidth) + _terminalPadLeft)}px;
                            width: ${_cellWidth}px;
                            height: ${_cellHeight}px;
                        "
                    >
                        &nbsp;
                    </div>
                `;
            }

            _terminalRows++;
            
            $(`#window_${_wInstance.id}_content`).append(_rowHtml);

            let _el = document.getElementById(`window_${_wInstance.id}_content`);
            _el.scrollTop = _el.scrollHeight;

        };


///////////////////////////////////////////////////////////
//  __nextLine()                                         //
///////////////////////////////////////////////////////////
//
        const __nextLine = () => {

            __disableCursor();

            _cursorY++;

            if (_cursorY >= _terminalRows)
                __addRow();

            _cursorX = 0;
            
            __enableCursor();

        };


///////////////////////////////////////////////////////////
//  __putChar()                                          //
///////////////////////////////////////////////////////////
//
        const __putChar = outputChar => {

            _outputBuffer += outputChar;
            
            if (outputChar === '\n')
                return __nextLine();

            outputChar = (outputChar === ' ') ? '&nbsp;' : outputChar;
            outputChar = (outputChar === '<') ? '&lt;' : outputChar;
            outputChar = (outputChar === '>') ? '&gt;' : outputChar;
            outputChar = (outputChar === '"') ? '&quot;' : outputChar;
            outputChar = (outputChar === '\'') ? '&#39;' : outputChar;
            outputChar = (outputChar === '&') ? '&amp;' : outputChar;


            $(`#window_${_wInstance.id}_${_cursorY}_${_cursorX}`).html(outputChar);

            __disableCursor();

            _cursorX++;

            if (_cursorX >= _terminalCols)
                __nextLine();

            __enableCursor();

        };


///////////////////////////////////////////////////////////
//  __putString()                                        //
///////////////////////////////////////////////////////////
//
        const __putString = outputString => {

            for (let charNo = 0; charNo < outputString.length; charNo++)
                __putChar(outputString.substring(charNo, (charNo + 1)));

        };

    
///////////////////////////////////////////////////////////
//  __putPrompt()                                        //
///////////////////////////////////////////////////////////
//
        const __putPrompt = () => {

            if (_currentPath === 'root')
                _currentPath = '/';
            __putString(`[user@${_currentPath}] $ `);

        };


///////////////////////////////////////////////////////////
//  __getDirlistOutput()                                 //
///////////////////////////////////////////////////////////
//
        const __getDirlistOutput = objDirlist => {

            let _strDirlist = '';

            JSON.parse(objDirlist).forEach(objDir => {
                const __json = JSON.parse(objDir);

                if (_strDirlist !== '')
                    _strDirlist += '\n';

                _strDirlist += `${__json['filePath']}`;
            });

            return _strDirlist;

        };


///////////////////////////////////////////////////////////
//  __handleKeypress()                                   //
///////////////////////////////////////////////////////////
//
        const __handleKeypress = async (ev, keytype) => {

            let __output = '';


            if (keytype === 'keydown') {
                if (ev.code === 'Enter') {
                    console.log(`ENTER`)
                    if (_inputBuffer.trim() === 'clear') {
                        _inputBuffer = _outputBuffer = '';
                        _isReset = true;
                        __createTerminalDisplay();
                        _cursorY = _cursorX = 0;
                        __putPrompt();
                        return;
                    }
                    if (_inputBuffer.trim() === 'exit') {
                        $(`#window_${_wInstance.id}_close`).trigger('click');
                        return;
                    }
    
                    let __response = await __executeCommand();
                    _outputBuffer += '\n';
                    __nextLine();
                    if (! __response.hasOwnProperty('output'))
                        __output = __getDirlistOutput(__response);
                    else
                        __output = __response.output;
                    __putString(__output);
                    __nextLine();
                    _outputBuffer += '\n';
                    __putPrompt();
                }
                else if (ev.code === 'Backspace' || ev.code === 'NumpadDecimal')
                    console.log(`Delete key`);
            }
            else {
                const __key = String.fromCharCode(ev.keyCode);
                if (__key === '/') {
                    ev.preventDefault();
                }
                _inputBuffer += __key;
                __putChar(__key);
            }

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

            setTimeout(() => {
                __putPrompt();
                if (_isReset) {
                    _isReset = false;
                    return;
                }
                _currentPath = 'root';
                $(`#window_${wInstance.id}`).on('keypress', (ev) => {
                    __handleKeypress(ev, 'keypress');
                });
                $(`#window_${wInstance.id}`).on('keydown', (ev) => {
                    __handleKeypress(ev,'keydown');
                });
            }, 100);

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
            }
        });


        return {

            wInstance: _wInstance

        };

    };
