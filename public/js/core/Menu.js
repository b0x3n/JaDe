///////////////////////////////////////////////////////////
//  JaDe/public/js/core/Menu.js                          //
///////////////////////////////////////////////////////////
//

    import { MenuConfig } from './../config/MenuConfig.js';


    const MENU_STATE_DISABLED = 0;
    const MENU_STATE_BUSY = 1;
    const MENU_STATE_ENABLED = 2;


    export const Menu = (
        menuConfig = MenuConfig
    ) => {

        let __menuState = MENU_STATE_DISABLED;


///////////////////////////////////////////////////////////
//  __buildMenuLinks()                                   //
///////////////////////////////////////////////////////////
//
        const __buildMenuLinks = () => {

            let __html = '';

            menuConfig.forEach(menuOption => {
                $('#start_menu').append(`
                    <div
                        id="${menuOption.id}"
                        class="menu_option"
                        title="${menuOption.title}"
                    >
                        ${menuOption.content}
                    </div>
                `);

                $(`#${menuOption.id}`).on('click', () => {
                    if (__menuState === MENU_STATE_BUSY)
                        return;
                    __hideMenu();
                    menuOption.callback();
                });
            });

        };


///////////////////////////////////////////////////////////
//  __showMenu()                                         //
///////////////////////////////////////////////////////////
//
        const __showMenu = () => {

            __menuState = MENU_STATE_BUSY;

            $('#start_menu').css({
                'bottom': '-100%',
                'display': 'flex',
                'opacity': '0.01'
            });

            $('#start_menu').animate({
                'bottom': '40px',
                'opacity': '0.99'
            }, 100, "linear", function() {
                __menuState = MENU_STATE_ENABLED;
            });

        };


///////////////////////////////////////////////////////////
//  __hideMenu()                                         //
///////////////////////////////////////////////////////////
//
        const __hideMenu = () => {

            __menuState = MENU_STATE_BUSY;

            $('#start_menu').animate({
                'bottom': '-100%',
                'opacity': '0.01'
            }, 100, "linear", function() {
                $('#start_menu').css('display', 'none');
                __menuState = MENU_STATE_DISABLED;
            });

        };


///////////////////////////////////////////////////////////
//  __initialiseMouseEvents()                            //
///////////////////////////////////////////////////////////
//
        const __initialiseMouseEvents = () => {

            $('#taskbar_start').on('click', () => {

                if (__menuState === MENU_STATE_BUSY)
                    return;
                
                if (__menuState === MENU_STATE_ENABLED)
                    __hideMenu();
                else
                    __showMenu();

            });

        };


///////////////////////////////////////////////////////////
//  __initialise()                                       //
///////////////////////////////////////////////////////////
//
        const __initialise = () => {

            __buildMenuLinks();
            __initialiseMouseEvents();

            $('body:not(._start)').on('click', () => {
                if (__menuState !== MENU_STATE_ENABLED)
                    return;
                __hideMenu();
            })

        };


        __initialise();

    };
