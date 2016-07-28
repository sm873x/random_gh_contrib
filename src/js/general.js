(function(ns) {
    'use strict';

    window.app = ns = ( ns || {} );

    ns.$alertArea = $('.alert-area');

    $('.clear').on('click', function clearData() {
        window.localStorage.removeItem('contributors');
        $('#contributors ul').empty();
        // ns.api.val('');
        // ns.query.val('');
        return;
    });

    ns.error = function handlePromiseFail(xhr) {
        if ( 400 <= xhr.status && xhr.status < 500 ) {
            ns.$alertArea.text('Check your token');
        } else if ( xhr.status >= 500){
            ns.$alertArea.text('Ruh roh, looks like we\'re having problems. Check back later please');
        }
    };
})(window.app);
