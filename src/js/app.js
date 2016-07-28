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
