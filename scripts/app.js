var cStats = {};
var curCost = 10;
var settingsActive = false;
var nightMode = true;


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

    animation.staggerFromTo(".blankTable *", 0.15, {
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
function createPlayerRow(playerId, playerName, playerScores) {
    var playerlist = $('#playerList');
    var playerDiv = $('<div>').prop({ id: playerId }).addClass('playerDiv');
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
        createScoresDiv(playerId, 'minus')
    });
    plusButton.on('click', function () {
        createScoresDiv(playerId, 'plus')
    });
    playerlist.append(playerDiv);
    playerDiv.append([playerNameDiv, playerScoresDiv, minusButton, plusButton]);

    function animateCreation(playerIdSelector) {
        const animation = new TimelineLite({ paused: true });
        var id = '#' + playerIdSelector;
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

    animateCreation(playerId);

}


// clearing player list
function clearPlayerList() {
    var playerList = $('#playerList');
    playerList.empty();
    createBlankTable();
}


// check if name already in game
function checkNames(playerId) {
    for (var player in cStats) {
        if (player == playerId) {
            return false;
        }
    }
    return true;
}


// adding Player to cStats-object and creating playerDiv
function addPlayer(playerId, playerName) {
    var playerScores = 0
    if (playerId && playerName) {
        playerObj = {};
        playerObj[playerId] = { name: playerName, scores: playerScores };
        if (JSON.stringify(cStats) == '{}') {
            $('#playerList').empty();
        }
        $.extend(cStats, playerObj);
        createPlayerRow(playerId, playerName, playerScores);
        setCookie('stats', JSON.stringify(cStats), 2);
    }
}


// clearing all results from cStats and writing it to Cookie
function clearResults() {
    const disappearAnimation = new TimelineLite({
        paused: true,
        onComplete: function () {
            clearPlayerList();
            cStats = {};
            setCookie('stats', JSON.stringify(cStats), 2);
        }
    });
    disappearAnimation.staggerFromTo(".playerDiv", 0.15,
        {

            opacity: 1,
        },
        {
            opacity: 0,
            scale: 0,
        }, -0.05
    );
    disappearAnimation.play();
}


// increase player results to question cost  
function scorePlus(playerId, cost) {
    // sum 
    cStats[playerId].scores += parseInt(cost);
    results = parseInt(cStats[playerId].scores);
    // update scores on table
    $('#' + playerId + ' .playerScores').first().text(results);
    // write to cookie
    setCookie('stats', JSON.stringify(cStats), 2);
}


// decrease player results to  question cost
function scoreMinus(playerId, cost) {
    // sub
    cStats[playerId].scores -= parseInt(cost);
    results = parseInt(cStats[playerId].scores);
    // update scores on table
    $('#' + playerId + ' .playerScores').first().text(results);
    // write to cookie
    setCookie('stats', JSON.stringify(cStats), 2);
}

// Show settings panel
function showSettings() {

    // anti-spam protection
    if (!settingsActive) {
        settingsActive = true;

        var settingsButton = $("#settingsButton");
        var gearIcon = $('.button-icon.settings').first();


        // Animation on show
        const showSettingsAnimation = new TimelineLite({ paused: true, onComplete: function () { settingsActive = false; } });
        showSettingsAnimation
            // .to("#settingsBar", 0.1, {display: 'inline-block'}, 0.01)
            .staggerFromTo("#settingsBar .button", 0.15,
                { opacity: 0, x: -70 },
                { opacity: 1, x: 0 }, 0.05)
            .fromTo(".button-icon.nightmode", 0.25,
                { rotation: 180 },
                { rotation: 145, }, 0.5);


        // Animation on hide
        const hideSettingsAnimation = new TimelineLite({ paused: true, onComplete: function () { settingsActive = false; $('#settingsBar').hide(); } });
        hideSettingsAnimation
            .to(".button-icon.nightmode", 0.5,
                { rotation: '-=360' })
            .to("#settingsBar.button", 0.15,
                { opacity: 0, x: 70 }, 0.25);

        // check if settings bar has already active
        if (!settingsButton.hasClass('active')) {
            // if not -- activate and run show animation
            settingsButton.addClass('active');
            gearIcon.children().first().addClass('spin');
            $('#settingsBar').show(0);
            showSettingsAnimation.play(0);
        }
        else {
            // else -- deactivate and run hide animation
            settingsButton.removeClass('active');
            gearIcon.children().first().removeClass('spin');
            hideSettingsAnimation.play(0);
        }
    }
}


// Create Modal with Input to input new player name
function createInputModal() {
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
    $('#modalInput').trigger('focus');


    // All modal window elements animation
    const globalShowAnimation = new TimelineLite({
        paused: true,
        onReverseComplete: function () {
            cancelCreateisActive = false;
            $('#modal').remove();
        }
    });
    globalShowAnimation
        .fromTo(".main", 0,
            { webkitFilter: 'blur(0px)' },
            { webkitFilter: 'blur(2px)' })
        .fromTo(".modal-bg", 0.15,
            { opacity: 0 },
            { opacity: 1 })
        .fromTo(".modal-window", 0.15,
            { opacity: 0, y: -70 },
            { opacity: 1, y: 0 })
        .fromTo(".modal-cancel", 0.15,
            { opacity: 0, x: -60, width: 60 },
            { opacity: 1, width: 120, x: 0 });


    // Accept Button Appear Animation
    const showAcceptAnimation = new TimelineLite({ paused: true, onComplete: function () { console.log('1') } });
    showAcceptAnimation
        .to('.modal-accept', 0.1, { display: 'block' }, 0.1)
        .fromTo(".modal-accept", 0.15,
            {
                opacity: 0,
                x: 60,
                width: 60
            },
            {
                opacity: 1,
                x: 0,
                width: 120
            });


    // Accept Button Disappear Animation
    const hideAcceptAnimation = new TimelineLite({ paused: true, onComplete: function () { $('.modal-accept').first().hide() } });
    hideAcceptAnimation.fromTo(".modal-accept", 0.15,
        {
            opacity: 1,
            x: 0,
            width: 120
            // ease: Power0
        },
        {
            opacity: 0,
            x: 60,
            width: 60
            // ease: Power0
        });


    // Border decoration animation
    var animateBorderinAction = false;
    function animateBorder(mode, duration) {
        if (!animateBorderinAction) {
            animateBorderinAction = true;
            switch (mode) {
                case 'init':
                    color = 'rgba(0, 0, 0, 0.12)';
                    break;
                case 'good':
                    color = 'rgba(68, 189, 50, 1.0)';
                    break;
                case 'info':
                    color = 'rgba(0, 168, 255, 1.0)';
                    break;
                case 'bad':
                    color = 'rgba(232, 65, 24,1.0)';
                    break;
            }

            const animation = new TimelineLite({ paused: true, onComplete: function () { animateBorderinAction = false; } });
            animation.to('.modal-input', duration, {
                borderColor: color
            });
            animation.play();
        }
    }

    // Text change animation
    var textChangeinAction = false;
    function animatedTextChange(text, classname, delay, mode, textDelay) {
        // Anti-spam protection
        if (!textChangeinAction) {
            textChangeinAction = true;
            var textBefore = 'Введите имя нового игрока';

            // Animation constructor
            const animationText = new TimelineLite({
                paused: true,
                onComplete: function () {
                    $(classname).first().text(text);
                    animationText.reverse();
                },
                onReverseComplete: function () {
                    textChangeinAction = false;
                }
            });
            animationText.to(classname, delay, {
                opacity: 0
            })

            animateBorder(mode, 0.1);
            animationText.play();

            setTimeout(function () {
                animationText.vars.onComplete = function () {
                    $(classname).first().text(textBefore);
                    animationText.reverse();
                }
                animationText.play();
                animateBorder('init', 0.1);
            }, textDelay);
        }
    }


    globalShowAnimation.play();


    // Player name validation
    function acceptCreatePlayer(playerName) {
        var delay = 0.15
        var playerId = playerName.replace(/ /g, "_");
        if (playerName.length > 0) {
            if (playerName.search(/[-!$%^&*()_+|~=`{}\[\]:";'<>?,.\/]/) >= 0) {
                animatedTextChange("Используются запрещенные символы", '.modal-text', delay, 'bad', 1500);
            }
            else {
                if (checkNames(playerId)) {
                    addPlayer(playerId, playerName);
                    animatedTextChange("Игрок добавлен", '.modal-text', delay, 'info', 1500);
                    $('#modalInput').val('');
                    hideAcceptAnimation.play();
                }
                else {
                    animatedTextChange("Такое имя игрока уже существует", '.modal-text', delay, 'bad', 1500);
                }
            }
        }
    }


    // Create player cancelation function 
    var cancelCreateisActive = false;
    function cancelCreatePlayer() {
        if (!cancelCreateisActive) {
            cancelCreateisActive = true;
            hideAcceptAnimation.play(0);
            globalShowAnimation.reverse(0);
        }
    }


    // Input validation + animation
    $('#modalInput').on('keyup', function (e) {
        var input = $(e.target);
        if (input.val().length > 0) {
            if (input.val().search(/[-!$%^&*()_+|~=`{}\[\]:";'<>?,.\/]/) < 0 && input.val().trim().length > 0) {
                if (!input.hasClass('good')) {
                    input.addClass('good');
                    showAcceptAnimation.play(0);
                }
                animateBorder('good', 0.1);
            }
            else {
                if (input.hasClass('good')) {
                    input.removeClass('good');
                }
                hideAcceptAnimation.play(0);
                animateBorder('bad', 0.1);
            }
        }
        else {
            if (input.hasClass('good')) {
                input.removeClass('good');
            }
            hideAcceptAnimation.play(0);
            animateBorder('bad', 0.1);
        }

    });


    // on Accept button click -- add new player
    $('.modal-accept').first().on('click', function () {
        var input = $('#modalInput').val().trim()
        acceptCreatePlayer(input);
    });
    modalCancel.click(cancelCreatePlayer);


    // on Ctrl + Enter key press -- add  new player
    // on Escape key press -- hide the modal
    $('#modalInput').on('keyup', function (e) {
        if (e.ctrlKey && e.keyCode == 13) {
            var input = $('#modalInput').val().trim()
            acceptCreatePlayer(input);
        }
        else if (e.key === "Escape") {
            cancelCreatePlayer();
        }
    });


    // on Escape key press hide the modal
    $('body').first().on('keyup', function (e) {
        if (e.key === "Escape" && $('#modal').length > 0) {
            cancelCreatePlayer();
        }
    });
}


// function that create Confirmation Modal (clear resulst confirmation)
function createConfirmModal() {
    // confirmation flag. If true -- the results will be clear;
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


    // All elements appearing animation
    const appearAnimation = new TimelineLite({
        paused: true,
        onReverseComplete: function () {
            $('#modal').remove();
            // Check the confirmation flag;
            if (confirm) clearResults();
        }
    });
    appearAnimation
        .to(".main", 0,
            { webkitFilter: "blur(2px)", })
        .fromTo(".modal-bg", 0.15,
            { opacity: 0 },
            { opacity: 1 })
        .fromTo(".modal-window", 0.15,
            { opacity: 0, y: -70 },
            { opacity: 1, y: 0 })
        .fromTo(".modal-cancel", 0.15,
            { opacity: 0, width: 60, x: -60 },
            { opacity: 1, width: 120, x: 0 })
        .fromTo(".modal-accept", 0.15,
            { display: '', opacity: 0, x: 60, width: 60 },
            { display: 'block', opacity: 1, width: 120, x: 0 }, '-=0.15');

    appearAnimation.play(0);


    // Cancel clear results
    modalCancel.on('click', function () {
        appearAnimation.reverse(0);
    })

    // Close the modal window by Escape key press
    $('body').first().on('keyup', function (e) {
        if (e.key === "Escape" && $('#modal').length > 0) {
            appearAnimation.reverse(0)
        }
    });

    // Accept clear results
    modalAccept.on('click', function () {
        confirm = true;
        appearAnimation.reverse();
    })
}


// Make screenshot function
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


        // Show modal animation
        const showModal = new TimelineLite({
            paused: true,
            onReverseComplete: function () {
                $('#modal').remove();
            }
        });

        showModal
            .to(".main", 0, { webkitFilter: "blur(2px)" })
            .fromTo(".modal-bg", 0.15,
                { opacity: 0 },
                { opacity: 1 })
            .fromTo(".modal-window", 0.15,
                { opacity: 0, y: -70 },
                { opacity: 1, y: 0 })
            .fromTo(".modal-accept", 0.15,
                { display: 'none', opacity: 0, x: 60, width: 60, },
                { display: 'block', opacity: 1, width: 120, x: 0 }, '-=0.15');

        var $canvas = $(".modal-image canvas").first();
        $canvas.css('height', "auto");
        $canvas.width(554);

        showModal.play();

        // Close the modal window by Escape key press
        $('body').first().on('keyup', function (e) {
            if (e.key === "Escape" && $('#modal').length > 0) {
                showModal.reverse(0)
            }
        });

        modalAccept.on('click', function () { showModal.reverse(); });
    });
}


// Toogle night mode function
function toggleNighMode() {
    const animation = new TimelineLite({
        paused: true,
        onComplete: function () {
            nightMode = false;
        },
        onReverseComplete: function () {
            nightMode = true;
        }
    })
    animation
        .fromTo('body', 0.25, 
            {backgroundColor: 'rgba(35, 37, 38, 1.0)', color: 'rgba(223, 249, 251, 1.0)'}, 
            {backgroundColor: 'rgba(245, 246, 250, 1.0)', color: 'rgba(35, 37, 38, 1.0)'})
        .fromTo('.header', 0.25,
            {color: 'rgba(223, 249, 251, 1.0)'},
            {color: 'rgba(47, 54, 64,1.0)'}, -0.25)
        .fromTo('.button', 0.25, 
            {borderColor: 'rgba(223, 249, 251, .2)'},
            {borderColor: 'rgba(47, 54, 64, .5)'}, -0.25)
        .fromTo('.button-icon', 0.25,
            {fill: 'rgba(223, 249, 251, .2)'},
            {fill: 'rgba(47, 54, 64, .5)'}, -0.25)
        // .fromTo('.button-icon:hover', 0.25, 
        //     {fill: 'rgba(223, 249, 251, 1.0)'},
        //     {fill: 'rgba(47, 54, 64, .5)'}, -0.25);


    if (nightMode) {
        animation.play(0);
    }
    else {
        animation.reverse(0);
    }

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
        for (var playerId in cStats) {
            createPlayerRow(playerId, cStats[playerId].name, cStats[playerId].scores);
        }
    }

    // linking functions to buttons
    $('#settingsButton').click(showSettings);
    $('#addPlayer').click(createInputModal);
    $('#clearResults').click(createConfirmModal);
    $('#screenShot').click(makeScreenshot);
    $('#nightMode').click(toggleNighMode);


    // adding keyboard control
    $('body').on('keyup', function (e) {
        switch (e.which) {
            // O - open settings
            case 79:
                if ($('#modal').length == 0)
                    showSettings();
                break
            // of settings Opened and P pressed -- show New Player Adding Window.
            case 80:
                if ($("#settingsButton").hasClass('active') && $('#modal').length == 0) {
                    createInputModal();
                }
        }
    })
}
