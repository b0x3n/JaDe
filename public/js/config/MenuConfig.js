///////////////////////////////////////////////////////////
//  JaDe/public/js/config/MenuConfig.js                  //
///////////////////////////////////////////////////////////
//

    import { FileManager } from './../core/FileManager.js';
    import { FileEditor } from './../core/FileEditor.js';
    import { Terminal } from './../core/Terminal.js';


    export const MenuConfig = [

        {
            'id': 'menu_option_filemanager',
            'title': 'Manage your files with the FileManager',
            'content': 'File Manager',
            'callback': function() {
                new FileManager();
            }
        },
        {
            'id': 'menu_option_fileeditor',
            'title': 'Create and edit files',
            'content': 'File Editor',
            'callback': () => {
                new FileEditor();
            }
        },
        {
            'id': 'menu_option_terminal',
            'title': 'Open a new terminal',
            'content': 'Terminal',
            'callback': () => {
                new Terminal();
            }
        }

    ];
