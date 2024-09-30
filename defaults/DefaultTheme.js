///////////////////////////////////////////////////////////
//  Jade/defaults/DefaultTheme                           //
///////////////////////////////////////////////////////////
//

    export const DefaultTheme = db => {
        
        const   _defaultTheme = {
            'name': 'Default',
            'taskbar': {
                'start_menu': {
                    'background-color': 'rgba(0, 0, 0, 0.25)',
                    'color': 'white'
                },
                'clock': {
                    'background-color': 'none',
                    'color': '#1AFA6A'
                },
                'background-color': 'rgba(0, 0, 0, 0.5)'
            },
            'start_menu': {
                'background-color': 'rgba(0, 0, 0, 0.05)'
            },
            'desktop': {
                'background-image': 'url(/images/wallpapers/wallpaper1.jpeg)'
            }    
        };

        const __theme = new db.model['Theme'](_defaultTheme);
        __theme.save();

        return _defaultTheme;

    };
