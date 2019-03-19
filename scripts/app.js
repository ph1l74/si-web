var cStats = {};
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

    const animation = new TimelineLite({ paused: true });

    animation.staggerFromTo(".blankTable *", 0.5, {
        opacity: 0,
        y: -10
    }, {
            opacity: 1,
            y: 0
        }, 0.1)

    animation.play();
}


// create scores div with plus or minus scores
function createScoresDiv(playerId, mode) {
    var scoresDivId = 'scoresDiv_' + playerId;
    var scoresDiv = $('<div>').prop({ id: scoresDivId }).addClass('scores-div');
    var scoresUl = $('<ul>').addClass('scores-list');
    var scores10 = $('<li>').data({ cost: '10' }).text(10);
    var scores20 = $('<li>').data({ cost: '20' }).text(20);
    var scores30 = $('<li>').data({ cost: '30' }).text(30);
    var scores40 = $('<li>').data({ cost: '40' }).text(40);
    var scores50 = $('<li>').data({ cost: '50' }).text(50);

    (mode === 'plus') ? scoresUl.addClass('plus') : scoresUl.addClass('minus');


    var scoresCosts = [scores10, scores20, scores30, scores40, scores50];

    scoresUl.append(scoresCosts);
    scoresDiv.append(scoresUl);


    const changeAnimation = new TimelineLite({
        paused: true,
        onComplete: function () {
            animation = this;
            $.each(scoresCosts, function (index, el) {
                el.on('click', function () {
                    (mode === 'plus') ? scorePlus(playerId, el.data('cost')) : scoreMinus(playerId, el.data('cost'));
                    $('#' + scoresDivId).fadeOut(150);        
                    animation.reverse();
                    $('#' + scoresDivId).remove();        
                });
            });
            $('#' + playerId).append(scoresDiv);
            $('#' + scoresDivId).fadeIn(150);
        
        }
    });

    changeAnimation.staggerTo($('#' + playerId).children(), 0.1, {
        opacity: 0,
        display: 'none'
    });

    changeAnimation.play();


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
    // minusButton.click(scoreMinus);
    // plusButton.click(scorePlus);
    minusButton.on('click', function () {
        createScoresDiv(playerName, 'minus')
    });
    plusButton.on('click', function () {
        createScoresDiv(playerName, 'plus')
    });
    playerlist.append(playerDiv);
    playerDiv.append([playerNameDiv, playerScoresDiv, minusButton, plusButton]);

    function animateCreation(playerId) {
        const animation = new TimelineLite({ paused: true });
        var id = '#' + playerId;
        console.log(id)
        animation.fromTo(
            id,
            0.5,
            {
                opacity: 0,
                y: -70
            }, {
                opacity: 1,
                y: 0
            }
        );
        animation.play();
    }

    animateCreation(playerName)

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
            return false;
        }
    }
    return true;
}


// adding Player to cStats-object and creating playerDiv
function addPlayer(name) {
    // var playerName = $('#modal-input').val();
    var playerName = name;
    var playerScores = 0
    if (playerName) {
        playerObj = {};
        playerObj[playerName] = { scores: playerScores };
        if (JSON.stringify(cStats) == '{}') {
            $('#playerList').empty();
        }
        $.extend(cStats, playerObj);
        createPlayerRow(playerName, playerScores);
        setCookie('stats', JSON.stringify(cStats), 2);
    }
}


// clearing all results from cStats and writing it to Cookie
function clearResults() {
    const t1 = new TimelineLite({
        paused: true,
        onComplete: function () {
            clearPlayerList();
            cStats = {};
            setCookie('stats', JSON.stringify(cStats), 2);
        }
    });
    t1.staggerFromTo(".playerDiv", 0.15,
        {
            opacity: 1,
            x: 0,
            ease: Power0
        },
        {
            opacity: 0,
            x: -300
        }, -0.1
    );
    t1.play();
}


// adding current question cost to current player results 
function scorePlus(playerId, cost) {
    cStats[playerId].scores += parseInt(cost);
    results = parseInt(cStats[playerId].scores);
    $('#' + playerId + ' .playerScores').first().text(results);
    setCookie('stats', JSON.stringify(cStats), 2);
}


// adding current question cost to current player results 
function scoreMinus(playerId, cost) {
    cStats[playerId].scores -= parseInt(cost);
    results = parseInt(cStats[playerId].scores);
    $('#' + playerId + ' .playerScores').first().text(results);
    setCookie('stats', JSON.stringify(cStats), 2);
}

// Show settings panel
function showSettings(e, timeline) {
    var settingsButton = $(e.target);
    var gearIcon = $('.button-icon.settings').first();

    if (!settingsButton.hasClass('active')) {
        settingsButton.addClass('active');
        gearIcon.children().first().addClass('spin');
        $('#settingsBar').show();
        timeline.play();
    }
    else {
        settingsButton.removeClass('active');
        gearIcon.children().first().removeClass('spin');
        timeline.reverse();
    }

}

// Create Modal with Input to input new player name
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

    modalText.text("Введите имя нового игрока");
    modalWindow.append([modalText, modalInput]);
    modalButtons.append([modalCancel, modalAccept]);
    modalBg.append([modalWindow, modalButtons]);
    modalDiv.append(modalBg);
    $('body').prepend(modalDiv);

    const t0 = new TimelineLite({ paused: true });
    t0.fromTo(".modal-accept", 0.15,
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

    const animateGoodBorder = new TimelineLite({ paused: true });
    animateGoodBorder.to('.modal-input', 0.15, {
        borderColor: 'rgba(68, 189, 50, 1.0)'
    });

    const animateAcceptedBorder = new TimelineLite({ paused: true });
    animateAcceptedBorder.to('.modal-input', 0.15, {
        borderColor: 'rgba(0, 168, 255, 1.0)'
    });

    modalInput.on('keyup', function (e, timeline) {
        var input = $(e.target);
        if (input.val().length > 0) {
            if (input.val().search(/[-!$%^&*()_+|~=`{}\[\]:";'<>?,.\/]/) < 0 && input.val().trim().length > 0) {
                if (!input.hasClass('good')) {
                    input.addClass('good');
                    t0.play();
                }
                animateGoodBorder.play();
            }
            else {
                if (input.hasClass('good')) {
                    input.removeClass('good');
                }
                t0.reverse();
                animateGoodBorder.reverse();
            }
        }
        else {
            if (input.hasClass('good')) {
                input.removeClass('good');
            }
            t0.reverse();
            animateGoodBorder.reverse();
        }

    });

    function animatedTextChange(text, classname, delay) {
        const animation = new TimelineLite({
            paused: true,
            onComplete: function () {
                $(classname).first().text(text);
                animation.reverse();
            }
        });
        animation.to(classname, delay, {
            opacity: 0
        })
        animation.play();
    }


    modalAccept.on('click', function (e) {
        var playerName = $('#modalInput').val().trim();
        if (checkNames(playerName)) {
            addPlayer(playerName);
            animatedTextChange("Игрок добавлен", '.modal-text', 0.15);
            animateAcceptedBorder.play();
            setTimeout(function () {
                animatedTextChange("Введите имя нового игрока", '.modal-text', 0.15);
                animateAcceptedBorder.reverse();
                animateGoodBorder.reverse();
            }, 1000);
            $('#modalInput').val('');
        }
        else {
            animatedTextChange("Такое имя игрока уже существует", '.modal-text', 0.15);
            animateGoodBorder.reverse();
            setTimeout(function () {
                animatedTextChange("Введите имя нового игрока", '.modal-text', 0.15);
                animateGoodBorder.play();
            }, 1500);
        }
    })

    const t1 = new TimelineLite({
        paused: true,
        onReverseComplete: function () {
            $('#modal').remove();
        }
    });
    t1.to(".main", 0, {
        webkitFilter: "blur(2px)",
    }).fromTo(".modal-bg", 0.15,
        {
            opacity: 0,
            ease: Power0
        },
        {
            opacity: 1,
        }
    ).fromTo(".modal-window", 0.15,
        {
            opacity: 0,
            y: -70,
            ease: Power0
        },
        {
            opacity: 1,
            y: 0
        }
    ).fromTo(".modal-cancel", 0.15,
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

    t2.to(".modal-accept", 0.15, {
        opacity: 0,
        x: 60,
        width: 60
    })

    t1.play();

    modalCancel.on('click', function () {
        if ($('#modalInput').hasClass('good')) {
            t2.play();
            t1.reverse();
        }
        else {
            t1.reverse();
        }
    })
}

function createConfirmModal() {
    var confirm = false;
    var modalDiv = $('<div>').addClass('modal').prop({ id: 'modal' });
    var modalBg = $('<div>').addClass('modal-bg');
    var modalWindow = $('<div>').addClass('modal-window');
    var modalButtons = $('<div>').addClass('modal-buttons');
    var modalText = $('<div>').addClass('modal-text');
    var modalAccept = $('<div>').addClass('modal-accept');
    var modalCancel = $('<div>').addClass('modal-cancel');

    modalCancel.text('Отмена');
    modalAccept.text('Очистить');

    modalText.text("Вы действительно хотите очистить таблицу результатов?");
    modalWindow.append([modalText]);
    modalButtons.append([modalCancel, modalAccept]);
    modalBg.append([modalWindow, modalButtons]);
    modalDiv.append(modalBg);
    $('body').prepend(modalDiv);

    const t1 = new TimelineLite({
        paused: true,
        onReverseComplete: function () {
            $('#modal').remove();
            if (confirm) clearResults();
        }
    });
    t1.to(".main", 0, {
        webkitFilter: "blur(2px)",
    }).fromTo(".modal-bg", 0.15,
        {
            opacity: 0,
            ease: Power0
        },
        {
            opacity: 1,
        }
    ).fromTo(".modal-window", 0.15,
        {
            opacity: 0,
            y: -70,
            ease: Power0
        },
        {
            opacity: 1,
            y: 0
        }
    ).fromTo(".modal-cancel", 0.15,
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
        }
    ).fromTo(".modal-accept", 0.15,
        {
            opacity: 0,
            x: 60,
            width: 60,
            ease: Power0
        },
        {
            opacity: 1,
            width: 120,
            x: 0
        }, '-=0.15');

    const t2 = new TimelineLite({ paused: true });

    t2.to(".modal-accept", 0.25, {
        opacity: 0,
        x: 60,
        width: 60
    })

    t1.play();

    modalCancel.on('click', function () {
        t1.reverse();
    })

    modalAccept.on('click', function () {
        confirm = true;
        t1.reverse();
    })
}

function makeScreenshot() {
    html2canvas($('#playerList')[0]).then(canvas => {
        var modalDiv = $('<div>').addClass('modal').prop({ id: 'modal' });
        var modalBg = $('<div>').addClass('modal-bg');
        var modalWindow = $('<div>').addClass('modal-window screenshot');
        var modalImage = $('<div>').addClass('modal-image');
        var modalButtons = $('<div>').addClass('modal-buttons');
        var modalText = $('<div>').addClass('modal-text');
        var modalAccept = $('<div>').addClass('modal-accept');

        modalAccept.text('Ок');

        modalText.text("Скриншот результатов:");
        modalImage.append(canvas);
        modalWindow.append([modalText, modalImage]);
        modalButtons.append(modalAccept);
        modalBg.append([modalWindow, modalButtons]);
        modalDiv.append(modalBg);
        $('body').prepend(modalDiv);

        const t1 = new TimelineLite({
            paused: true,
            onReverseComplete: function () {
                $('#modal').remove();
            }
        });
        t1.to(".main", 0, {
            webkitFilter: "blur(2px)",
        }).fromTo(".modal-bg", 0.15,
            {
                opacity: 0,
                ease: Power0
            },
            {
                opacity: 1,
            }
        ).fromTo(".modal-window", 0.15,
            {
                opacity: 0,
                y: -70,
                ease: Power0
            },
            {
                opacity: 1,
                y: 0
            }
        ).fromTo(".modal-accept", 0.15,
            {
                opacity: 0,
                x: 60,
                width: 60,
                ease: Power0
            },
            {
                opacity: 1,
                width: 120,
                x: 0
            }, '-=0.15');

        var $canvas = $(".modal-image canvas").first();
        $canvas.css('height', "auto");
        $canvas.width(554);
        // $canvas.height($parent.height());

        t1.play();

        modalAccept.on('click', function () {
            t1.reverse();
        })
    });
}

window.onload = function () {
    // Getting last session info
    cStats = getCookie('stats');

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

    // Animation
    const t1 = new TimelineLite({
        paused: true,
        onReverseComplete: function () {
            $('#settingsBar').hide();
        }
    });
    t1.staggerFromTo("#settingsBar .button", 0.15,
        {
            opacity: 0,
            x: -70,
        },
        {
            opacity: 1,
            x: 0
        }, 0.1
    ).to(".button-icon.nightmode", 0.15, {
        rotation: "-=45",
    }, '+=0.1');

    // linking functions to buttons
    $('#settingsButton').on('click', function () {
        showSettings(event, t1)
    });
    $('#addPlayer').click(createInputModal);
    $('#clearResults').click(createConfirmModal);
    $('#screenShot').click(makeScreenshot);
}
