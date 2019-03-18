var cStats = {};
var curRound = 1;
var curCost = 10;


// getting Cookie by parameter name
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
    // console.log("set", cname, cvalue);
}


// placeholder info
function createBlankTable() {
    var playerlist = $('#playerList');
    blankTable = $('<div>').addClass('blankTable');
    blankTableTitle = $('<div>').addClass('blankTableTitle').text('Таблица пуста');
    blankTableDesc = $('<div>').addClass('blankTableDesc').text('Добавьте игрока, чтобы начать подсчет очков');
    blankTable.append(blankTableTitle).append(blankTableDesc);
    playerlist.append(blankTable);
}


// creating playerDiv with plus/minus button, player name and player scores
function createPlayerRow(playerName, playerScores) {
    var playerlist = $('#playerList');
    var playerDiv = $('<div>').prop({ id: playerName }).addClass('playerDiv');
    var minusButton = $('<div>').addClass('minusButton');
    var minusIcon = $('<div class="button-icon minus"><svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><path d="M7 11v2h10v-2H7zm5-9C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/></svg></div>');
    var playerNameDiv = $('<div>').addClass('playerName').text(playerName);
    var playerScoresDiv = $('<div>').addClass('playerScores').text(playerScores);
    var plusButton = $('<div>').addClass('plusButton');
    var plusIcon = $('<div class="button-icon plus"><svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><path d="M13 7h-2v4H7v2h4v4h2v-4h4v-2h-4V7zm-1-5C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/></svg></div>');

    plusButton.append(plusIcon);
    minusButton.append(minusIcon);
    minusButton.click(scoreMinus);
    plusButton.click(scorePlus);
    playerlist.append(playerDiv);
    playerDiv.append(minusButton).append(playerNameDiv).append(playerScoresDiv).append(plusButton);
}


// clearing player list
function clearPlayerList() {
    var playerList = $('#playerList');
    playerList.empty();
    createBlankTable();
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
function addPlayer(name) {
    // var playerName = $('#modal-input').val();
    var playerName = name;
    var playerScores = 0
    if (playerName && !checkNames(playerName)) {
        playerObj = {};
        playerObj[playerName] = { scores: playerScores };
        if (JSON.stringify(cStats) == '{}') {
            $('#playerList').empty();
        }
        $.extend(cStats, playerObj);
        createPlayerRow(playerName, playerScores);
        setCookie('stats', JSON.stringify(cStats), 2);
    }
    else {
        alert('Введенное имя некорректно');
        return false
    };
}


// clearing all results from cStats and writing it to Cookie
function clearResults() {
    if (confirm("Вы действительно хотите очистить результаты?")) {
        clearPlayerList();
        cStats = {};
        curRound = 1;
        setCost(10);
        setCookie('stats', JSON.stringify(cStats), 2);
        updateRoundInfo();
    }
}


// adding current question cost to current player results 
function scorePlus(e) {
    cStats[e.target.parentNode.id].scores += parseInt(curCost);
    results = parseInt(cStats[e.target.parentNode.id].scores);
    $(e.target).prev().text(results);
    setCookie('stats', JSON.stringify(cStats), 2);
}


// adding current question cost to current player results 
function scoreMinus(e) {
    cStats[e.target.parentNode.id].scores -= parseInt(curCost);
    results = parseInt(cStats[e.target.parentNode.id].scores);
    $(e.target).nextAll('.playerScores').text(results);
    setCookie('stats', JSON.stringify(cStats), 2);
}


// updateing text and setting in Cookie
function updateRoundInfo() {
    $('#statusRoundSpan').text(curRound);
    $('#statusCostSpan').text(curCost);
    setCookie('round', curRound, 2);
    setCookie('cost', curCost, 2);
}


// change cost and if cost 50 increment the round
function nextQuestion() {
    if (curCost < 50) setCost(parseInt(curCost, 10) + 10);
    else {
        setCost(10);
        curRound += 1;
    }
    updateRoundInfo();
}

function showSettings(e, timeline) {
    var settingsButton = $(e.target).parent();
    var gearIcon = $('.button-icon.settings').first();

    if (!settingsButton.hasClass('active')) {
        settingsButton.addClass('active');
        gearIcon.children().first().addClass('spin');
        timeline.play();
    }
    else {
        settingsButton.removeClass('active');
        gearIcon.children().first().removeClass('spin');
        timeline.reverse();
    }

}

function setCost(cost) {
    curCost = cost;
    $('.cost-selector').each(function (index, el) {
        $(el).removeClass('active');

    });
    $('li[cost="' + cost + '"]').addClass('active');
    $('#statusCostSpan').text(cost);
    setCookie('cost', cost, 2);
}

function createInputModal(text) {
    var modalDiv = $('<div>').addClass('modal').prop({ id: 'modal' });
    var modalBg = $('<div>').addClass('modal-bg');
    var modalWindow = $('<div>').addClass('modal-window');
    var modalButtons = $('<div>').addClass('modal-buttons');
    var modalText = $('<div>').addClass('modal-text');
    var modalInput = $('<input>').addClass('modal-input').prop({ id: 'modalInput' });
    var modalAccept = $('<div>').addClass('modal-accept');
    var modalCancel = $('<div>').addClass('modal-cancel');

    modalCancel.text('Отмена');
    modalAccept.text('Добавить');

    modalText.text(text);
    modalWindow.append([modalText, modalInput]);
    modalButtons.append([modalCancel, modalAccept]);
    modalBg.append([modalWindow, modalButtons]);
    modalDiv.append(modalBg);
    $('body').prepend(modalDiv);

    const t0 = new TimelineLite({ paused: true });
    t0.fromTo(".modal-accept", 0.25,
        {
            opacity: 0,
            x: 60,
            width: 60,
            ease: Power0
        },
        {
            opacity: 1,
            x: 0,
            width: 120
            // ease: Power0
        });

    modalInput.on('keyup', function (e, timeline) {
        var input = $(e.target);
        if (input.val().length >= 3 && !input.hasClass('good')) {
            input.addClass('good');
            t0.play();
        }
        else if (input.val().length < 3 && input.hasClass('good')) {
            console.log('hide');
            input.removeClass('good');
            t0.reverse();
        }

    });

    modalAccept.on('click', function(e) {
        console.log($('#modalInput').val());
        addPlayer($('#modalInput').val());
    })

    const t1 = new TimelineLite({
        paused: true,
        onReverseComplete: function () {
            $('#modal').remove();
        }
    });
    t1.to(".main", 0, {
        webkitFilter: "blur(2px)",
    }).fromTo(".modal-bg", 0.25,
            {
                opacity: 0,
                ease: Power0
            },
            {
                opacity: 1,
            }
        ).fromTo(".modal-window", 0.25,
            {
                opacity: 0,
                y: -70,
                ease: Power0
            },
            {
                opacity: 1,
                y: 0
            }
        ).fromTo(".modal-cancel", 0.25,
            {
                opacity: 0,
                x: -60,
                width: 60,
                ease: Power0
            },
            {
                opacity: 1,
                width: 120,
                x: 0
            });

    const t2 = new TimelineLite({ paused: true });

    t2.to(".modal-accept", 0.25, {
        opacity: 0,
        x: 60,
        width: 60
    })

    t1.play();

    modalCancel.on('click', function () {
        if ($('#modalInput').hasClass('good')) {
            t2.play();
            TweenLite.delayedCall(0.25, function () {
                t1.reverse();
            })
        }
        else {
            t1.reverse();
        }
        // t1;
    })
}

function createConfirmModal() {
    var modalDiv = $('<div>').addClass('modal');
    var modalBg = $('<div>').addClass('modal-bg');
    var modalWindow = $('<div>').addClass('modal-window');
    var modalButtons = $('<div>').addClass('modal-buttons');
    var modalText = $('<div>').addClass('modal-text');
    var modalInput = $('<input>').addClass('modal-input');
    var modalCancel = $('<div>').addClass('modal-cancel');
    var modalAccept = $('<div>').addClass('modal-accept');

    // modalButtons.append(modal)


    // $('body').prepend()
}


window.onload = function () {
    // Getting last session info
    cStats = getCookie('stats');
    curRound = getCookie('round');
    setCost(getCookie('cost'));

    // If not remember: start new game
    if (cStats == "" || cStats == "{}" || !cStats) {
        cStats = {};
        createBlankTable();
    }

    // Else render table with last stats
    else {
        cStats = JSON.parse(cStats);
        for (var player in cStats) {
            createPlayerRow(player, cStats[player].scores);
        }
    }

    if (curRound == "" || !curRound || curCost == "" || !curCost) {
        curRound = 1;
        setCost(10);

    }

    else {
        curRound = parseInt(curRound, 10);
        setCost(parseInt(curCost, 10));
    }

    // Animation
    const t1 = new TimelineLite({ paused: true });
    t1.fromTo("#settingsBar .button:nth-child(1)", 0.1,
        {
            opacity: 0,
            x: -70,
            ease: Power0
        },
        {
            opacity: 1,
            x: 0
        }
    ).fromTo("#settingsBar .button:nth-child(2)", 0.1,
        {
            opacity: 0,
            x: -70,
            ease: Power0
        },
        {
            opacity: 1,
            x: 0
        }
    ).fromTo("#settingsBar .button:nth-child(3)", 0.1,
        {
            opacity: 0,
            x: -70,
            ease: Power0
        },
        {
            opacity: 1,
            x: 0
        });

    // linking functions to buttons
    $('#settingsButton').on('click', function () {
        showSettings(event, t1)
    });
    $('#addPlayer').on('click', function(){
        createInputModal('Введите имя игрока');
    });
    $('#clearResults').click(clearResults);
    $('#nextQuestion').click(nextQuestion);
    $('.cost-selector').each(function (index, el) {
        $(el).click(function () {
            setCost($(el).attr('cost'));
        });
    });
    updateRoundInfo();
}
