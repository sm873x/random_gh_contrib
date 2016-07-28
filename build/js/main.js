(function(ns) {
    'use strict';

    window.app = ns = ( ns || {} );
    ns.contribArr = [];

    $('#search').on('submit', function findContributor(e) {
        console.log('start');
        e.preventDefault();

        ns.token = $('#api-key').val();
        ns.query = $('#query').val();

        console.log('token', ns.token);

        getRepos(ns.token, ns.query)
            .then(function retrieveRepos(repos) {
                console.log(repos);
                var chosenRepo = getRandoRepo(repos);

                console.log(chosenRepo);
                return getCommits(chosenRepo);
            })
            .then(function retrieveCommits(commits) {
                console.log(commits);

                var chosenCommit = getRandoCommit(commits);
                console.log(chosenCommit);

                dispAuthor(chosenCommit);

                var contribList = {name: ns.author, avatar: ns.avatar};
                ns.contribArr.push(contribList);
                localStorage.setItem('contributors', JSON.stringify(ns.contribArr));
            })
            .catch(function handleErrors(xhr) {
                ns.error(xhr);
            });
    });

    /**
     * Get repos from github with specific query
     * @param  {String} token Personal access token
     * @param  {String} query Search term
     * @return {Promise} JQuery XHR Object that implements promise methods
     */
    function getRepos(token, query) {
        return $.ajax({
            url: 'https://api.github.com/search/repositories?q=' + query + '&=desc',
            method: 'get',
            headers: {
                'Authorization': 'token ' + token
            },
            dataType: 'json'
        });
    }

    /**
     * Select random repo
     * @param  {Object} data Array-like object of repos
     * @return {Object}     Selected repo
     */
    function getRandoRepo(data) {
        if (!data.items) {
            throw new Error ('There is no repo data');
        }
        var repoArr = data.items;
        return repoArr[Math.floor(Math.random() * repoArr.length)];
    }

    /**
     * Get all commits from repo
     * @param  {Object} repo Selected repo
     * @return {Promise} JQuery XHR Object that implements promise methods
     */
    function getCommits(repo) {
        return $.ajax({
            url: 'https://api.github.com/repos/' + repo.owner.login + '/' + repo.name + '/commits',
            method: 'get',
            headers: {
                'Authorization': 'token ' + ns.token
            },
            dataType: 'json'
        });
    }

    /**
     * Select random commit
     * @param  {Array} data Array of commits
     * @return {Object}     Selected commit
     */
    function getRandoCommit(data) {
        if (!data) {
            throw new Error ('There is no commit data');
        }
        var commitArr = data;
        return commitArr[Math.floor(Math.random() * commitArr.length)];
    }

    /**
     * Display commit author username and avatar img
     * @param  {Object} commitData Selected commit
     * @return {void}
     */
    function dispAuthor(commitData) {
        if (!commitData.author) {
            return;
        }

        ns.author = commitData.author.login;
        ns.avatar = commitData.author.avatar_url;

        $('#contributors ul')
            .append('<li class=' + ns.author + '>' + ns.author + '</li>\
                    <img src=' + ns.avatar + '>');
    }

})(window.app);

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

//# sourceMappingURL=main.js.map