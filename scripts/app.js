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

    const t1 = new TimelineLite({ paused: true });

    t1.staggerFromTo(".blankTable *", 0.5, {
        opacity: 0,
        y: -10
    }, {
            opacity: 1,
            y: 0
        }, 0.1)

    t1.play();
}

function createScoresDiv(playerId, mode) {
    console.log('!')
    var scoresDiv = $('<div>').prop({ id: 'scoresDiv' }).addClass('scores-div');
    var scoresUl = $('<ul>').addClass('scores-list');
    var scores10 = $('<li>').prop({ cost: '10' }).text(10);
    var scores20 = $('<li>').prop({ cost: '20' }).text(20);
    var scores30 = $('<li>').prop({ cost: '30' }).text(30);
    var scores40 = $('<li>').prop({ cost: '40' }).text(40);
    var scores50 = $('<li>').prop({ cost: '50' }).text(50);

    (mode === 'plus') ? scoresUl.addClass('plus') : scoresUl.addClass('minus');

    scoresUl.append([scores10, scores20, scores30, scores40, scores50]);
    scoresDiv.append(scoresUl);


    const flipAnimation = new TimelineLite({
        paused: true, onComplete: function () {

        }
    });

    const flipAnimationSecond = new TimelineLite({
    });
    flipAnimationSecond.fromTo("#scoresDiv", 0.5, {
        x: -300,
        opacity: 0
    }, {
            x: 0,
            opacity: 1
        }, 0.5)
    flipAnimationSecond.play();



    flipAnimation.to("#" + playerId, 0.25, {
        x: 300,
        opacity: 0,
        display: 'none'
    })



    flipAnimation.play();
    $('#' + playerId).before(scoresDiv);
    flipAnimationSecond.play();




    // if ($('#scoresDiv').length > 0) {
    //     var animation = new TimelineLite({paused: true});
    //     animation.fromTo("#scoresDiv", 0.15, {
    //         height: 60,
    //         y: 0,
    //         opacity: 1
    //     },{
    //         height: 0,
    //         y: -70,
    //         opacity: 0
    //     });
    //     animation.play();
    //     $('#scoresDiv').remove();
    // }

    // $('#'+playerId).after(scoresDiv);
    // var animation = new TimelineLite({paused: true});        
    // animation.fromTo("#scoresDiv", 0.15, {
    //     height: 0,
    //     y: -70,
    //     opacity: 0
    // },{
    //     height: 60,
    //     y: 0,
    //     opacity: 1
    // });

    // console.log('scoresDiv', );
    // animation.play();

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
            curRound = 1;
            setCost(10);
            setCookie('stats', JSON.stringify(cStats), 2);
            updateRoundInfo();
        }
    });
    t1.staggerFromTo(".playerDiv", 0.5,
        {
            opacity: 1,
            x: 0,
            ease: Power0
        },
        {
            opacity: 0,
            x: -70
        }, -0.1
    );

    t1.play();
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
                    animateGoodBorder.play();
                }
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


        // if (input.val().length > 0) {
        //     if (input.val().search(/[-!$%^&*()_+|~=`{}\[\]:";'<>?,.\/]/) < 0 && !input.hasClass('good')) {
        //         input.addClass('good');
        //         t0.play();
        //         animateGoodBorder.play();
        //     }
        //     else {
        //         input.removeClass('good');
        //         t0.reverse();
        //         animateGoodBorder.reverse();
        //     }
        // }

        // if (input.val().search(/[-!$%^&*()_+|~=`{}\[\]:";'<>?,.\/]/)) {

        // }
        // else if (input.val().length > 0 && ) {

        // }
        // else if (input.val().length < 1 && input.hasClass('good')) {

        // }

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
            setTimeout(function () {
                animatedTextChange("Введите имя нового игрока", '.modal-text', 0.15);
            }, 2000);
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
    $('#nextQuestion').click(nextQuestion);
    $('.cost-selector').each(function (index, el) {
        $(el).click(function () {
            setCost($(el).attr('cost'));
        });
    });
    updateRoundInfo();
}
