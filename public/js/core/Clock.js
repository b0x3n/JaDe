///////////////////////////////////////////////////////////
//  JaDe/public/js/core/Clock.js                         //
///////////////////////////////////////////////////////////
//

    const CLOCK_TIMESLICE = 250;


    export const Clock = () => {

        let __clockEnabled = false;

        let __hours;
        let __minutes;
        let __seconds;

        let __blinks = 0;


///////////////////////////////////////////////////////////
//  __updateClock()                                      //
///////////////////////////////////////////////////////////
//s
        const __updateClock = () => {
            
            const   __date = new Date();

            __hours = __date.getHours();
            __minutes = __date.getMinutes();
            __seconds = __date.getSeconds();

            __hours = (__hours < 10) ? `0${__hours}` : __hours.toString();
            __minutes = (__minutes < 10) ? `0${__minutes}` : __minutes.toString();
            __seconds = (__seconds < 10) ? `0${__seconds}` : __seconds.toString();

            $('#taskbar_clock_hours').html(__hours);
            $('#taskbar_clock_minutes').html(__minutes);
            $('#taskbar_clock_seconds').html(__seconds);

            if (__blinks === 4) {
                if ($('.clock_separator').html() === ':')
                    $('.clock_separator').html('&nbsp;');
                else
                    $('.clock_separator').html(':');
                __blinks = 0;
            }
            else
                __blinks++;

        };


        __clockEnabled = setInterval(() => {
            __updateClock();
        }, CLOCK_TIMESLICE);

    };
