///////////////////////////////////////////////////////////
//  JaDe/public/js/core/Theme.js                         //
///////////////////////////////////////////////////////////
//
//  We can request a theme using the following routes:
//
//      /default-theme      - Always returns the Default
//                            theme.
//
//      /theme/:name        - Where 'name' refers to a
//                            specific theme.
//

    export const Theme = () => {

//  Assume we'll be using the Default theme.
//
        let __currentTheme = "Default";
        let __theme = false;


///////////////////////////////////////////////////////////
//  __hasLocalStorage()                                  //
///////////////////////////////////////////////////////////
//
        const __hasLocalStorage = () => {

            localStorage.setItem('__TEST_ITEM__', 'value');
            
            if (localStorage.getItem('__TEST_ITEM__') === null)
                return false;

            return true;

        };


///////////////////////////////////////////////////////////
//  __applyTheme()                                       //
///////////////////////////////////////////////////////////
//
//  We're building a little tree, here.
//
//  This works recursively - we will cycle through all
//  of the keys in objTheme, each key identifies an
//  html element by ID or a CSS property.
//
//  So, example we can do:
//
//      'taskbar': {
//          'clock': {
//              'color': 'green'
//          }
//          'background-color': 'white'
//      }
//
//  Any time we find a key that's an object there's a
//  recursive call with the new object as the parameter,
//  if it's a string then it's a CSS property.
//
//  Since the clock is inside the taskbar the actual ID
//  of the clock element is taskbar_clock, hence the
//  nesting of objects - these ID's are build and passed
//  on in each successive call.
//
        const __applyTheme = (
            objTheme,
            name
        ) => {

            const __keys = Object.keys(objTheme);

//  Don't apply the styles one property at a time, we will
//  compile an object with all of the style properties
//  for this element them apply them all together at
//  the end.
//
            const __style = {};
            
            for (let __key = 0; __key < __keys.length; __key++) {
                if (__keys[__key].substring(0, 1) === '_')
                    continue;

                if (typeof objTheme[__keys[__key]] !== 'string') {
                    if (name !== '')
                        __applyTheme(objTheme[__keys[__key]], `${name}_${__keys[__key]}`);
                    else
                        __applyTheme(objTheme[__keys[__key]], `${__keys[__key]}`);
                }
                else 
                    __style[__keys[__key]] = objTheme[__keys[__key]];
            }

            $(`#${name}`).css(__style);

        };


///////////////////////////////////////////////////////////
//  __initialise()                                       //
///////////////////////////////////////////////////////////
//
        const __initialise = async () => {

            __currentTheme = 'Default';

//  If this isn't a new user they may have saved a
//  theme in localStorage().
//
            if (__hasLocalStorage()) {
                if (localStorage.getItem('__currentTheme') !== null)
                    __currentTheme = localStorage.getItem('__currentTheme');
                else
                    localStorage.setItem('__currentTheme', __currentTheme);
            }

//  Fetch that theme, we'll get some JSON.
//
            $.ajaxSetup({ 'dataType': 'json' });
            __theme = await $.ajax(`/default-theme`);

//  In the unusual event that a non-existant theme
//  is requested...
//
            if (__theme.hasOwnProperty('error'))
                throw new Error(__theme.error);

            delete __theme['name'];

            Object.keys(__theme).forEach(key => {
                if (key.substring(0, 1) === '_')
                    return;
                __applyTheme(__theme[key], key);
            });

        };


        __initialise();


    };
