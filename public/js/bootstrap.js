///////////////////////////////////////////////////////////
//  JaDe/public/js/bootstrap.js                          //
///////////////////////////////////////////////////////////
//
//  Nout much goin' on in 'ere!
//
//  All's what we'd doin' is importing the App module,
//  this is essentially the main controller.
//
//  Then we've got a little IIFE that kickstarts the
//  whole thing.
//

    import { App } from "./App.js";
    import { WindowManager } from './core/WindowManager.js';
    
    (() => {
        App();
    })();
