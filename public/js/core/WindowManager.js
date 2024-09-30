///////////////////////////////////////////////////////////
//  JaDe/public/js/core/WindowManager.js                 //
///////////////////////////////////////////////////////////
//
//  Create and manage windowed applications.
//
//  The WindowManager is a singleton that will manage
//  all running windowed applications.
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


    function NewWindow(windowConfig) {

        let __canResize = '';

        if (windowConfig['options']['canResize'])
            __canResize = `resize: both; overflow: auto;`;

        let __windowHtml = `
            <${windowConfig['elementType']}
                id="window_${this.processes}"
                class="window"
                style="z-index: ${this.processes}; ${__canResize}"
            >
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

        $(`#window_${this.processes}`).draggable({
            'handle': `#window_${this.processes}_titlebar`
        });

        $(`#window_${this.processes}_close`).on('click', function() {
            const __id = $(this).attr('id').replace('window_', '').replace('_close', '');
            $(`#window_${__id}`).remove();
            delete this.windows[`window_${this.processes}`];
        });

        this.windows[`window_${this.processes}`] = {
            'name': windowConfig['module']['name'],
            'reference': windowConfig['module']['reference'],
            'id': this.processes,
            'state': 'default'
        };

        this.processes++;

    };


    function WindowedApps() {

        this.windows = {};
        this.processes = 200;

        this.newWindow = NewWindow.bind(this);;

    };


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
