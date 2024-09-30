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
        let _path = [ 'a', 'b', 'c' ];


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

            if (_pathString.substring(0, 1) !== '/')
                _pathString = `/${_pathString}`;

            return _pathString;

        };


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
//  __populateFileManager()                              //
///////////////////////////////////////////////////////////
//
        const __populateFileManager = async () => {

            const __pathString = __buildPath();
            let __htmlOutput = '';

            $.ajaxSetup({'dataType': 'json'});
            let __fileInfo = await $.ajax('/filesystem');

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
            'onload': wInstance => {
                __initialise(wInstance);
            }
        });


        return {

            wInstance: _wInstance

        };

    };
