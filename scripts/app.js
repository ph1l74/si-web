var cStats = {};

function getCookie(cname){
    var name = cname + '='
    var decodeCookie = decodeURIComponent(document.cookie);
    var ca = decodeCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' '){
            c = c.substring(1);
        }
        if (c.indexOf(name)==0){
            return c.substring(name.length, c.length)
        }
    }
}

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ';' + expires + ';path=/;'
    console.log('Cookie value ' + cname + ' setted to:', cvalue);
}

function createPlayerRow(playerName, playerScores) {
    var playerlist = $('#playerList');
    var playerDiv = $('<div>').prop({id:playerName}).addClass('playerDiv');
    minusButton = $('<div>').addClass('minusButton');
    minusButton.click(minusButton);
    playerNameDiv = $('<div>').addClass('playerName').text(playerName);
    playerScoresDiv = $('<div>').prop({id: playerName + '_scores'}).addClass('playerScores').text(playerScores);
    plusButton = $('<div>').addClass('plusButton');
    plusButton.click(scorePlus);
    playerlist.append(playerDiv);
    playerDiv.append(minusButton).append(playerNameDiv).append(playerScoresDiv).append(plusButton);
}

// function createModalWarning() {
// 
// }

function clearPlayerList() {
    var playerList = $('#playerList');
    playerList.empty();
}

function addPlayer() {
    var playerName = prompt("Введите имя нового игрока");
    var playerScores = 0
    if (playerName) {
        playerObj = {}
        playerObj[playerName] = {scores: playerScores}
        // console.log(playerObj);
        $.extend(cStats, playerObj);
        createPlayerRow(playerName, playerScores);
    }
    else return false;
}

function clearResults() {
    if(confirm("Вы действительно хотите очистить результаты?")) clearPlayerList();   
    setCookie('stats', JSON.stringify(''), 2);
}

function scorePlus(e) {
    console.log(cStats);
    $('#' + e.target.parentNode.id + '_scores').text(cStats[e.target.parentNode.id].scores += 10);
    setCookie('stats', JSON.stringify(cStats), 2);
}

function scoreMinus(e) {
    console.log(cStats);
    $('#' + e.target.parentNode.id + '_scores').text(cStats[e.target.parentNode.id].scores -= 10);
    setCookie('stats', JSON.stringify(cStats), 2);
}


window.onload = function () {
    cStats = getCookie('stats');
    if (cStats == "" || !cStats) {
        console.log('No previous game. Creating new player list...')
        cStats = {}
    }
    else {
        cStats = JSON.parse(cStats);
    }

    $('#addPlayer').click(addPlayer);
    $('#clearResults').click(clearResults);
    
    
}
