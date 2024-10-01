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

//  First, we need to get the task icon for this window in
//  the taskbar - we need its location.
//
        const __taskIcon = document.getElementById(`task_${windowID}`);
        const __taskIconLeft = __taskIcon.getBoundingClientRect().left;
        
//  This will prevent the resize/drag events from changing
//  the current window position/dimensions.
//
        this.windows[`window_${windowID}`]['state'] = 'minimised';

        $(`#window_${windowID}`).animate({
            'left': `${__taskIconLeft}px`,
            'top': '100%',
            'height': '0px',
            'width': '0px',
            'opacity': '0.01'
        }, 100, "swing", () => {
            $(this).css('display', 'none');
        });

        return true;

    };


///////////////////////////////////////////////////////////
//  MaximiseWindow()                                     //
///////////////////////////////////////////////////////////
//
    function MaximiseWindow(windowID) {

        const __self = this;
        const __height = (document.getElementById('desktop').getBoundingClientRect().height - 32);

        if (__self.windows[`window_${windowID}`]['state'] !== 'maximised') {
            __self.windows[`window_${windowID}`]['state'] = 'maximised';

            $(`#window_${windowID}`).stop().animate({
                'top': '0px',
                'left': '0px',
                'width': '100%',
                'height': `${__height}px`,
                'opacity': '0.99'
            }, 100, "swing");
        }
        else {
            __self.windows[`window_${windowID}`]['state'] = 'minimised';
            __self.restoreWindow(windowID);
        }
    };


///////////////////////////////////////////////////////////
//  MaximiseWindow()                                     //
///////////////////////////////////////////////////////////
//
    function RestoreWindow(windowID) {

        const __self = this;

        if (this.windows[`window_${windowID}`]['state'] !== 'minimised')
            return false;

        console.log('Yeah')

        const __rect = this.windows[`window_${windowID}`]['position'];

        $(`#window_${windowID}`).css('display', 'block');

        $(`#window_${windowID}`).stop().animate({
            'top': `${__rect.top}px`,
            'left': `${__rect.left}px`,
            'width': `${__rect.width}px`,
            'height': `${__rect.height}px`,
            'opacity': '0.99'
        }, 100, "swing", function() {
            __self.windows[`window_${windowID}`]['state'] = 'default';
        });

        return true;

    };


///////////////////////////////////////////////////////////
//  NewWindow()                                          //
///////////////////////////////////////////////////////////
//
    function NewWindow(windowConfig) {

        const __self = this;
        const __id = this.processes;

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

//  Create the window and add it to the taskbar
//
        $(`#${windowConfig['target']}`).append(__windowHtml);

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

//  Each window has its own object that stores some
//  basic information about the current state.
//
//  We also must remember the size and position of
//  the window for minimisation/restoration.
//
//  Need to watch the window for resize - update the
//  position/size.
//
        let __observeResize = new ResizeObserver(() => {
            if (! $(`#window_${__id}`).length)
                return;
            if (__self.windows[`window_${__id}`]['state'] !== 'default')
                return;
            __self.windows[`window_${__id}`] = {
                'position': document.getElementById(`window_${__id}`).getBoundingClientRect()
            }
            console.log(`Set new window position`);
            console.log(__self.windows[`window_${__id}`]['position'])
        });

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
            if (__self.windows[`window_${__id}`]['state'] === 'minimised')
                return;
            __self.windows[`window_${__id}`]['position'] = document.getElementById(`window_${__id}`).getBoundingClientRect()
            console.log(`Set new window position`);
            console.log(__self.windows[`window_${__id}`]['position'])
        });

        $(`#window_${this.processes}_minimise`).on('click', function() {
            const __id = $(this).attr('id').replace('window_', '').replace('_minimise', '');
            __self.minimiseWindow(__id);
        });

        $(`#window_${this.processes}_maximise`).on('click', function() {
            const __id = $(this).attr('id').replace('window_', '').replace('_maximise', '');
            __self.maximiseWindow(__id);
        });

        $(`#task_${this.processes}`).on('click', function() {
            if (__self.windows[`window_${__id}`]['state'] !== 'minimised')
                __self.minimiseWindow(__id);
            else
                __self.restoreWindow(__id);
        });

///////////////////////////////////////////////////////////
//  All windowed apps should have an onload event in
//  the config, this is called to pass the window ID to
//  the application module.
//
        if (! windowConfig.hasOwnProperty('onload'))
            throw new Error(`Error creating window - the windowConfig requires an 'onload' property`);
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
        this.maximiseWindow = MaximiseWindow.bind(this);
        this.restoreWindow = RestoreWindow.bind(this);

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
