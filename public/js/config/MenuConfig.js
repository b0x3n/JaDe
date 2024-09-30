///////////////////////////////////////////////////////////
//  JaDe/public/js/config/MenuConfig.js                  //
///////////////////////////////////////////////////////////
//

    import { FileManager } from './../core/FileManager.js';


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
            'id': 'start_menu_option_2',
            'title': 'Select menu Option 2',
            'content': 'Menu Option 2',
            'callback': () => {
                console.log(`You clicked Option 2`);
            }
        },
        {
            'id': 'start_menu_option_3',
            'title': 'Select menu Option 3',
            'content': 'Menu Option 3',
            'callback': () => {
                console.log(`You clicked Option 3`);
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
