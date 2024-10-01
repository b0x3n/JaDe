///////////////////////////////////////////////////////////
//  JaDe/public/js/App.js                                //
///////////////////////////////////////////////////////////
//
//  Main application controller.
//
//  Here, we bring in and initialise the core modules.
//
    import { Theme } from './core/Theme.js';
    import { Clock } from './core/Clock.js';
    import { Menu } from './core/Menu.js';


    import { WindowManager } from './core/WindowManager.js';


    export const App = () => {

//  This will fetch the theme from the server.
//
        let __theme;
        let __clock;
        let __menu;

        let __terminal = {};

        __terminal.fontFamily = '"VT323", monospace';
        __terminal.fontSize = 20;

        window.__windowManager = WindowManager.initialise();
        

///////////////////////////////////////////////////////////
//  __initialise()                                       //
///////////////////////////////////////////////////////////
//
        const __initialise = () => {
  
            $(window).on('load', () => {
                __theme = Theme();
                __clock = Clock();
                __menu = Menu();

                $('.desktop_icon_wrapper').draggable();

                $(`.desktop_icon`).on('dblclick', function() {
                    let __id = $(this).attr('id').replace('icon_', '');
                    $(`#menu_option_${__id}`).trigger('click');
                });

                // $(`#cell_testwidth`).css({
                //     'font-family': `${__terminal.fontFamily}`,
                //     'font-size': `${__terminal.fontSize}px`,
                //     'line-height': `${__terminal.fontSize - 2}px`
                // });
            });
  
        };


        __initialise();

    };
