///////////////////////////////////////////////////////////
//  JaDe/public/js/core/FileManager.js                   //
///////////////////////////////////////////////////////////
//
//  Windowed application for managing files.
//

    export const FileManager = function() {

        let _wInstance = false;

///////////////////////////////////////////////////////////
//  The path is just a stack of entries that we join to
//  make an absolute path - makes it easier to implement
//  things like a back button.
//
        let _path = [];

///////////////////////////////////////////////////////////
//  We have a reverse _forward[] stack that acts contrary
//  to _path - when we click 'back' the top of _path is
//  popped into _forward[] - if we click 'forward'
//  then the first item is shifted back into the
//  _path[] stack...I, er - i-i-it's complicated!
//
        let _forward = [];


///////////////////////////////////////////////////////////
//  __buildPath()                                        //
///////////////////////////////////////////////////////////
//
        const   __buildPath = () => {

            let _pathString = '';

            _path.map(path => {
                if (_pathString !== '')
                    _pathString += '/';
                _pathString += path;
            });

            if (_pathString === '') _pathString = '/';

            // if (_pathString.substring(0, 1) !== '/')
            //     _pathString = `/${_pathString}`;

            return _pathString;

        };


///////////////////////////////////////////////////////////
//  ___getDirectoryLink()                                //
///////////////////////////////////////////////////////////
//
        const __getDirectoryLink = fileInfo => {
            return `
                <div
                    id="window_${_wInstance.id}_directory_${fileInfo['filePath'].replace('/', '_')}"
                    class="window_directory"
                    title="Open directory ${fileInfo['filePath']}"
                >
                    <p>${fileInfo['filePath']}</p>
                </div>
            `;
        };


///////////////////////////////////////////////////////////
//  ___getFileLink()                                     //
///////////////////////////////////////////////////////////
//
        const __getFileLink = fileInfo => {
            return `
                <div
                    id="window_${_wInstance.id}_file_${fileInfo['filePath']}"
                    class="window_file"
                    title="Open file ${fileInfo['filePath']}"
                >
                    <p>${fileInfo['filePath']}</p>
                </div>
            `;
        };


///////////////////////////////////////////////////////////
//  __handleBackButton()                                 //
///////////////////////////////////////////////////////////
//
        const __handleBackButton = windowID => {

            console.log(`Back on ${windowID}`)

//  We pop the last entry in the _path stack then
//  call the __populateFileManager() method.
//
//  Pop it to _forward()...put it in H and I'm sure
//  you'll agree - Zagreb ebnom zlotdik!
//
            if (_path.length)
                _forward.push(_path.pop());

//  If the _path stack is now empty we disable the
//  back button.
//
            if (! _path.length)
                $(`#window_${windowID}_back`).css({
                    'opacity': '0.50',
                    'cursor': 'default'
                });

            return __populateFileManager();

//
//  TODO: Need to cache previously viewed directories
//  instead of calling __populateFileManager each time.
//

        };


///////////////////////////////////////////////////////////
//  __handleForwardButton()                              //
///////////////////////////////////////////////////////////
//
        const __handleForwardButton = windowID => {

            if (! _forward.length)
                return __clearForward();

            if (_forward.length)
                _path.push(_forward.shift());

            if (! _forward.length)
                $(`#window_${windowID}_forward`).css({
                    'opacity': '0.50',
                    'cursor': 'default'
                });

            return __populateFileManager();

        };


///////////////////////////////////////////////////////////
//  __clearForward()                                     //
///////////////////////////////////////////////////////////
//
        const __clearForward = windowID => {
            _forward = [];
            $(`#window_${windowID}_forward`).css({
                'opacity': '0.50',
                'cursor': 'default'
            });
        };


///////////////////////////////////////////////////////////
//  __populateFileManager()                              //
///////////////////////////////////////////////////////////
//
        const __populateFileManager = async () => {

            let __pathString = __buildPath();
            let __htmlOutput = '';

            if (_path.length) {
                $(`#window_${_wInstance.id}_back`).css({
                    'opacity': '0.99',
                    'background-color': '#FFF',
                    'cursor': 'pointer'
                });
            }
            if (_forward.length) {
                $(`#window_${_wInstance.id}_forward`).css({
                    'opacity': '0.99',
                    'background-color': '#FFF',
                    'cursor': 'pointer'
                });
            }
console.log(`Updating path on ${_wInstance.id}, pathstring = ${__pathString}`)
            if (__pathString.substring(0, 1) !== '/')
                $(`#window_${_wInstance.id}_path`).html(`/${__pathString}`);
            else
                $(`#window_${_wInstance.id}_path`).html(__pathString);

            if (__pathString === '/')
                __pathString = 'root';

            $.ajaxSetup({'dataType': 'json'});
            let __fileInfo = await $.ajax(`/filesystem/${__pathString}`);

            __fileInfo = JSON.parse(__fileInfo);

           __fileInfo.forEach(fileInfo => {
                fileInfo = JSON.parse(fileInfo);
                console.log(fileInfo.fileType);
                if (fileInfo.fileType === 'directory')
                    __htmlOutput += __getDirectoryLink(fileInfo);
                else
                    __htmlOutput += __getFileLink(fileInfo);
            });

            $(`#window_${_wInstance.id}_content`).html(__htmlOutput);

            $(`.window_directory`).on('dblclick', function() {
                const __id = $(this).attr('id');
                _path.push($(`#${__id} p`).html());
                __clearForward(_wInstance.id);
                __populateFileManager();
            });

            $(`#window_${_wInstance.id}_forward`).on('click', function() {
                __handleForwardButton(_wInstance.id);
            });
            $(`#window_${_wInstance.id}_back`).on('click', function() {
                __handleBackButton(_wInstance.id);
            });

            $(`#window_${_wInstance.id}_content`).on('mousedown', function(ev) {
                ev.preventDefault();
                if (ev.button !== 2)
                    return;
            });

            $(`#window_${_wInstance.id}_content > .window_directory`).on('mousedown', function(ev) {
                ev.stopPropagation();
                ev.preventDefault();
                if (ev.button !== 2)
                    return;
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

            $(`#window_${wInstance.id}_titlebar`).append(`(${wInstance.id - 199})`);
        
            __populateFileManager();

        };


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
            'toolbar': `
                <div
                    id="window_%id%_toolbar"
                    class="window_toolbar"
                >
                    <div id="window_%id%_back" class="window_back">&nbsp;</div>
                    <div id="window_%id%_forward" class="window_forward">&nbsp;</div>
                    <div id="window_%id%_path" class="window_path">&nbsp;</div>    
                </div>
            `,
            'onload': wInstance => {
                __initialise(wInstance);
            }
        });


        return {

            wInstance: _wInstance

        };

    };
