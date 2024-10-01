///////////////////////////////////////////////////////////
//  JaDe/public/js/core/WindowManager.js                 //
///////////////////////////////////////////////////////////
//
//  Create and manage windowed applications.
//
//  The WindowManager is a singleton that will manage
//  all running windowed applications.
//


///////////////////////////////////////////////////////////
//  GetTitlebarHTML()                                    //
///////////////////////////////////////////////////////////
//
    function GetTitlebarHTML(windowConfig) {
        return `
            <${windowConfig['elementType']}
                id="window_${this.processes}_titlebar"
                class="window_titlebar"
            >
                ${windowConfig['options']['titleText']}
            </${windowConfig['elementType']}>
        `;
    };


///////////////////////////////////////////////////////////
//  GetMaximiseIconHTML()                                //
///////////////////////////////////////////////////////////
//
    function GetMaximiseIconHTML(windowConfig) {
        return `
            <${windowConfig['elementType']}
                id="window_${this.processes}_maximise"
                class="window_maximise"
                title="Maximise the window"
            >
                &nbsp;
            </${windowConfig['elementType']}>
        `;
    };


///////////////////////////////////////////////////////////
//  GetMinimiseIconHTML()                                //
///////////////////////////////////////////////////////////
//
    function GetMinimiseIconHTML(windowConfig) {
        return `
            <${windowConfig['elementType']}
                id="window_${this.processes}_minimise"
                class="window_minimise"
                title="Minimise the window"
            >
                &nbsp;
            </${windowConfig['elementType']}>
        `;
    };


///////////////////////////////////////////////////////////
//  GetCloseIconHTML()                                   //
///////////////////////////////////////////////////////////
//
    function GetCloseIconHTML(windowConfig) {
        return `
            <${windowConfig['elementType']}
                id="window_${this.processes}_close"
                class="window_close"
                title="Close the window"
            >
                X
            </${windowConfig['elementType']}>
        `;
    };


///////////////////////////////////////////////////////////
//  MinimiseWindow()                                     //
///////////////////////////////////////////////////////////
//
    function MinimiseWindow(windowID) {

        console.log(`Minimising window ${windowID}`);

//  First, we need to get the task icon for this window in
//  the taskbar - we need its location.
//
        const __taskIcon = document.getElementById(`task_${windowID}`);

        if (! __taskIcon.length)
            return false;

        const __taskIconLeft = __taskIcon.getBoundingClientRect().left;
        
        $(`#window_${windowID}`).animate({
            'left': `${__left}px`,
            'top': '100vw',
            'opacity': '0.01'
        }, 100, "linear", function() {
            $(this).css('display', 'none');
        });

        return true;

    };


///////////////////////////////////////////////////////////
//  NewWindow()                                          //
///////////////////////////////////////////////////////////
//
    function NewWindow(windowConfig) {

        let __canResize = '';

        if (windowConfig['options']['canResize'])
            __canResize = `resize: both;`;

        let __windowHtml = `
            <${windowConfig['elementType']}
                id="window_${this.processes}"
                class="window"
                style="z-index: ${this.processes}; ${__canResize}"
            >
                <div
                    id="window_${this.processes}_toolbar"
                    class="window_toolbar"
                >
                    <div id="window_${this.processes}_back" class="window_back">&nbsp;</div>
                    <div id="window_${this.processes}_forward" class="window_forward">&nbsp;</div>
                    <div id="window_${this.processes}_path" class="window_path">&nbsp;</div>    
                </div>
                %titlebar%
                %close%
                %maximise%
                %minimise%
                <div id="window_${this.processes}_content" class="window_content">
                    &nbsp;
                </div>
            </${windowConfig['elementType']}>
        `;

        let __titleBar = '';
        let __maximiseIcon = '';
        let __minimiseIcon = '';
        let __closeIcon = '';

        this.getTitlebarHTML = GetTitlebarHTML.bind(this);
        this.getMaximiseIcon = GetMaximiseIconHTML.bind(this);
        this.getMinimiseIcon = GetMinimiseIconHTML.bind(this);
        this.getCloseIcon = GetCloseIconHTML.bind(this);

        if (windowConfig['options']['showTitlebar'])
            __titleBar = this.getTitlebarHTML(windowConfig);
        if (windowConfig['options']['canMaximise'])
            __maximiseIcon = this.getMaximiseIcon(windowConfig);
        if (windowConfig['options']['canMinimise'])
            __minimiseIcon = this.getMinimiseIcon(windowConfig);
        if (windowConfig['options']['canClose'])
            __closeIcon = this.getCloseIcon(windowConfig);

        __windowHtml = __windowHtml
            .replace('%titlebar%', __titleBar)
            .replace('%maximise%', __maximiseIcon)
            .replace('%minimise%', __minimiseIcon)
            .replace('%close%', __closeIcon);

        $(`#${windowConfig['target']}`).append(__windowHtml);

//  Each window has its own object that stores some
//  basic information about the current state.
//
//  We also must remember the size and position of
//  the window for minimisation/restoration.
//

        const __self = this;
        const __id = this.processes;

//  Need to watch the window for resize - update the
//  position/size.
//
        let __observeResize = new ResizeObserver(() => {
            if (! $(`#window_${__id}`).length)
                return;
            __self.windows[`window_${__id}`] = {
                'position': document.getElementById(`window_${__id}`).getBoundingClientRect()
            }
            console.log(`Set new window position`);
            console.log(__self.windows[`window_${__id}`]['position'])
        });

        // $(`#window_${this.processes}`).on('change', function() {
        //     __self.windows[`window_${this.processes}`]['position'] = this.getBoundingClientRect();
        //     console.log(`Updated position of ${__self.processes}`);
        //     console.log(__self.windows[`window_${__self.processes}`]);
        // });

        __observeResize.observe(document.getElementById(`window_${this.processes}`));

        $(`#window_${this.processes}_close`).on('click', function() {
            const __id = $(this).attr('id').replace('window_', '').replace('_close', '');
            $(`#window_${__id}`).remove();
            $(`#task_${__id}`).remove();
            delete __self.windows[`window_${__id}`];
        });

        $(`#window_${this.processes}`).draggable({
            'handle': `#window_${this.processes}_titlebar`
        });

        $(`#window_${this.processes}`).on('drag', function() {
            __self.windows[`window_${__id}`]['position'] = document.getElementById(`window_${__id}`).getBoundingClientRect()
            console.log(`Set new window position`);
            console.log(__self.windows[`window_${__id}`]['position'])
        });

        $(`#window_${this.processes}_minimise`).on('click', function() {
            const __id = $(this).attr('id').replace('window_', '').replace('_minimise', '');
            MinimiseWindow(__id);
        });

        $(`#taskbar_tasks`).append(`
            <div id="task_${this.processes}" class="task">
                ${windowConfig['module']['name']}
            </div>
        `);

        this.windows[`window_${this.processes}`] = {
            'name': windowConfig['module']['name'],
            'reference': windowConfig['module']['reference'],
            'id': this.processes,
            'state': 'default',
            'position': document.getElementById(`window_${__id}`).getBoundingClientRect()
        };

        windowConfig['onload'](this.windows[`window_${this.processes}`]);

        this.processes++;

    };


///////////////////////////////////////////////////////////
//  WindowedApps()                                       //
///////////////////////////////////////////////////////////
//
//  Manages all windowed processes.
//
    function WindowedApps() {

        this.windows = {};
        this.processes = 200;

        this.newWindow = NewWindow.bind(this);
        this.minimiseWindow = MinimiseWindow.bind(this);

    };


///////////////////////////////////////////////////////////
//  WindowManager()                                      //
///////////////////////////////////////////////////////////
//
//  Will return a single instance of WindowedApps().
//
    export const WindowManager = (function() {

        let wInstance = null;

        function _initialise() {
            if (wInstance === null)
                wInstance = new WindowedApps();
            return wInstance;
        };

        return {
            'initialise': function() {
                return _initialise()
            }
        };

    })();
