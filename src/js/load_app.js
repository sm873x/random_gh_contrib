(function(ns) {
    'use strict';

    window.app = ns = ( ns || {} );
    
    ns.contribArr = [];

    window.addEventListener( 'load', function loadPrevContrib() {
        console.log('load');

        if (!(JSON.parse(localStorage.getItem('contributors')))) {
            return;
        }

        ns.contribArr = JSON.parse(localStorage.getItem('contributors'));
        console.log(ns.contribArr);

        ns.contribArr.forEach(function getContributors(author) {
            $('#contributors ul')
                .append('<li class=' + author.name + '>' + author.name + '</li>\
                        <img src=' + author.avatar + '>');
        });

    });

})(window.app);
