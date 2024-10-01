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
        },
        {
            'id': 'start_menu_option_4',
            'title': 'Select menu Option 4',
            'content': 'Menu Option 4',
            'callback': () => {
                console.log(`You clicked Option 4`);
            }
        },
        {
            'id': 'start_menu_option_5',
            'title': 'Select menu Option 5',
            'content': 'Menu Option 5',
            'callback': () => {
                console.log(`You clicked Option 5`);
            }
        },
        {
            'id': 'start_menu_option_6',
            'title': 'Select menu Option 6',
            'content': 'Menu Option 6',
            'callback': () => {
                console.log(`You clicked Option 6`);
            }
        }

    ];
