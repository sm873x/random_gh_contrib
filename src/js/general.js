(function(ns) {
    'use strict';

    window.app = ns = ( ns || {} );

    ns.$alertArea = $('.alert-area');

    $('.clear').on('click', function clearData() {
        window.localStorage.removeItem('contributors');
        $('#contributors ul').empty();
        return;
    });

    ns.error = function handleAjaxFail(xhr) {
        ns.statCode = xhr.status;
        if ( 400 <= ns.statCode && ns.statCode < 500 ) {
            ns.$alertArea.text('Check your token');
        } else if ( ns.statCode >= 500){
            ns.$alertArea.text('Ruh roh, looks like we\'re having problems. Check back later please');
        }
    };
})(window.app);
