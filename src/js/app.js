(function(ns) {
    'use strict';

    window.app = ns = ( ns || {} );
    ns.contribArr = [];

    window.addEventListener( 'load', function() {
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

    $('#search').on('submit', function findContributor(e) {
        console.log('start');
        e.preventDefault();

        ns.token = $('#api-key').val();
        ns.query = $('#query').val();

        console.log('token', ns.token);

        getRepos(ns.token, ns.query)
            .then(function(repos) {
                console.log(repos);
                var chosenRepo = getRandoRepo(repos);

                console.log(chosenRepo);
                return getCommits(chosenRepo);
            })
            .then(function(commits) {
                console.log(commits);

                var chosenCommit = getRandoCommit(commits);
                console.log(chosenCommit);

                dispAuthor(chosenCommit);

                var contribList = {name: ns.author, avatar: ns.avatar};
                ns.contribArr.push(contribList);
                // localStorage.setItem('contributors', JSON.stringify(contribList));
                localStorage.setItem('contributors', JSON.stringify(ns.contribArr));
            });

    });

    function getRepos(token, query) {
        return $.ajax({
            url: 'https://api.github.com/search/repositories?q=' + query,
            method: 'get',
            headers: {
                'Authorization': 'token ' + token
            },
            dataType: 'json'
        });
    }

    function getRandoRepo(data) {
        var repoArr = data.items;
        return repoArr[Math.floor(Math.random() * repoArr.length)];
    }

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

    function getRandoCommit(data) {
        var commitArr = data;
        return commitArr[Math.floor(Math.random() * commitArr.length)];
    }

    function dispAuthor(commitData) {
        ns.author = commitData.author.login;
        ns.avatar = commitData.author.avatar_url;

        $('#contributors ul')
            .append('<li class=' + ns.author + '>' + ns.author + '</li>\
                    <img src=' + ns.avatar + '>');
    }

})(window.app);
