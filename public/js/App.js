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


    export const App = () => {

//  This will fetch the theme from the server.
//
        let __theme;
        let __clock;
        let __menu;
        

///////////////////////////////////////////////////////////
//  __initialise()                                       //
///////////////////////////////////////////////////////////
//
        const __initialise = () => {
  
            $(window).on('load', () => {
                __theme = Theme();
                __clock = Clock();
                __menu = Menu();
            });
  
        };


        __initialise();

    };
