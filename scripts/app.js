var cStats = {};
var curRound = 1;
var curCost = 10;


// getting Cookie by parmeter name
function getCookie(cname) {
    var name = cname + '='
    var decodeCookie = decodeURIComponent(document.cookie);
    var ca = decodeCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length)
        }
    }
}

// setting Cookie 
function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ';' + expires + ';path=/;'
    // console.log('Cookie value ' + cname + ' setted to:', cvalue);
}


// creating playerDiv with plus/minus button, player name and player scores
function createPlayerRow(playerName, playerScores) {
    var playerlist = $('#playerList');
    var playerDiv = $('<div>').prop({ id: playerName }).addClass('playerDiv');
    minusButton = $('<div>').addClass('minusButton');
    minusButton.click(scoreMinus);
    playerNameDiv = $('<div>').addClass('playerName').text(playerName);
    playerScoresDiv = $('<div>').addClass('playerScores').text(playerScores);
    plusButton = $('<div>').addClass('plusButton');
    plusButton.click(scorePlus);
    playerlist.append(playerDiv);
    playerDiv.append(minusButton).append(playerNameDiv).append(playerScoresDiv).append(plusButton);
}


// clearing player list
function clearPlayerList() {
    var playerList = $('#playerList');
    playerList.empty();
}


// check if name already in game
function checkNames(playerName) {
    for (var player in cStats) {
        if (player == playerName) {
            return true;
        }
    }
    return false;
}


// adding Player to cStats-object and creating playerDiv
function addPlayer() {
    var playerName = prompt("Введите имя нового игрока");
    var playerScores = 0
    if (playerName && !checkNames(playerName)) {
        playerObj = {}
        playerObj[playerName] = { scores: playerScores }
        // console.log(playerObj);
        $.extend(cStats, playerObj);
        createPlayerRow(playerName, playerScores);
    }
    else {
        alert('Введенное имя некорректно');
        return false
    };
}


// clearing all results from cStats and writing it to Cookie
function clearResults() {
    if (confirm("Вы действительно хотите очистить результаты?")) clearPlayerList();
    cStats = {};
    curRound = 1;
    curCost = 10;
    setCookie('stats', JSON.stringify(cStats), 2);
    // setCookie('round', curRound + "", 2);
    // setCookie('cost', curCost + "", 2);
    updateRoundInfo();
}


// adding current question cost to current player results 
function scorePlus(e) {
    // console.log(cStats);
    // $('#' + e.target.parentNode.id + '_scores').text(cStats[e.target.parentNode.id].scores += curCost);
    $(e.target).prev().text(cStats[e.target.parentNode.id].scores += curCost);
    setCookie('stats', JSON.stringify(cStats), 2);
}


// adding current question cost to current player results 
function scoreMinus(e) {
    // console.log(cStats);
    // $('#' + e.target.parentNode.id + '_scores').text(cStats[e.target.parentNode.id].scores -= curCost);
    // $('#' + e.target.parentNode.id + '_scores').text(cStats[e.target.parentNode.id].scores -= curCost);

    $(e.target).nextAll('.playerScores').text(cStats[e.target.parentNode.id].scores -= curCost);
    setCookie('stats', JSON.stringify(cStats), 2);
}


// updateing text and setting in Cookie
function updateRoundInfo() {
    $('#statusRoundSpan').text(curRound);
    $('#statusCostSpan').text(curCost);
    setCookie('round', curRound + "", 2);
    setCookie('cost', curCost + "", 2);
}


// change cost and if cost 50 increment the round
function nextQuestion() {
    if (curCost != 50) curCost += 10;
    else {
        curCost = 10;
        curRound += 1;
    }
    updateRoundInfo();
}


window.onload = function () {
    // Getting last session info
    cStats = getCookie('stats');
    curRound = getCookie('round');
    curCost = getCookie('cost');

    // If not remember: start new game
    if (cStats == "" || !cStats) {
        cStats = {};
    }

    else if (curRound == "" || !curRound || curCost == "" || !curCost) {
        curRound = 1;
        curCost = 10;
    } 

    // Else render table with last stats
    else {
        cStats = JSON.parse(cStats);
        curRound = parseInt(curRound, 10);
        curCost = parseInt(curCost, 10);
        for (var player in cStats) {
            createPlayerRow(player, cStats[player].scores);
        }
    }

    // linking functions to buttons
    $('#addPlayer').click(addPlayer);
    $('#clearResults').click(clearResults);
    $('#nextQuestion').click(nextQuestion);
    updateRoundInfo();
}
