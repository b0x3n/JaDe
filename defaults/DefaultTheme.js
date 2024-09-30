///////////////////////////////////////////////////////////
//  Jade/defaults/DefaultTheme                           //
///////////////////////////////////////////////////////////
//

    export const DefaultTheme = () => {
        
        const   _defaultTheme = {
            'name': 'Default',
            'taskbar': {
                'start': {
                    'background-color': 'red',
                    'color': 'white'
                },
                'background-color': 'rgba(0, 0, 127, 0.5)'
            },
            'start_menu': {
                'background-color': 'rgba(0, 0, 0, 1)'
            },
            'desktop': {
                'background-color': '#0F30E0'
            }
        };

        const __theme = new __db.model['Theme'](_defaultTheme);
        __theme.save();

        return _defaultTheme;

    };
