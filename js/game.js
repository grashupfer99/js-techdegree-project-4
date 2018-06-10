/*
* Project name:         Tic-Tac-Toe
* Student name:         Alex Khant (http://github.com/grashupfer99)
* Updated:              2018-06-10
*/

// Game module 
const gameController = (function(){

    // Creating an array of boxes
    const boxes = Array.from($('.box'));

    // Combination of winning moves
    const winMoves = [ 
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [6, 4, 2]
    ];

    // class Player
    class Player {
        constructor(name, human = true){
            this.name = name;
            this.human = human;
        }
    }

    // check if the board is filled
    const boardFilled = () => {
        let check = false;
        check = boxes.every((box)=> $(box).attr('data-marked'));
        return check;
    }

    // Get all available spots on the game board
    const availableSpot = () => {
        let availBoxes = [];
        boxes.filter((box, i, arr) => {
            if(!$(box).attr('data-marked')){
                availBoxes.push(box);
            } 
        });
        return availBoxes;
    }

    // Reset the whole board to start a new game
    const resetBoard = (player) =>{
        // Reset active player variable
        player = 1;
        // Set active player classes to default
        $('#player1').addClass('active');
        $('#player2').removeClass('active');
        // Set all boxes to default
        $('.box').each((i,cur) => {
            $(cur).removeAttr('data-marked');
            $(cur).removeAttr('style');
            if($(cur).hasClass('box-filled-1')){
                $(cur).removeClass('box-filled-1');
            }
            if($(cur).hasClass('box-filled-2')){
                $(cur).removeClass('box-filled-2');
            }
        });
        // Reset the win-screen
        $('.screen').removeClass('screen-win-one').removeClass('screen-win-two');
        return player;
    }

    /* Determine a winner
       Chaining array iteration methods some() and every() 
       some() tests if at least one element in the array of winning moves contains numbers belonging to player '1' or '2'   
       every() tests if all elements in a given collection are equal to '1' or '2'      
    */
    const getWinner = (player) => {
        return winMoves.some(rowOfThree => {
            return rowOfThree.every(box => {
                let temp = parseInt($(boxes).eq(box).attr('data-marked'));
                return temp === player;
            });
        });
    }

    // Highlight the active player 
    const nextTurn = (player) => {
        // Keep changing unless the board is filled
        if(!boardFilled()){
            if(player === 1){
                $('#player1').addClass('active');
                $('#player2').removeClass('active');
            }else {
                $('#player1').removeClass('active');
                $('#player2').addClass('active');
            }
        }       
    }
    // Generate random available spots from unoccupied squares  
    const randMove = (availMoves) => {
        return availMoves[Math.floor(Math.random() * availMoves.length)];
    }

    return {

        // Get winner
        winning: (player) => {
            return getWinner(player);
        },

        // Detect a lucky winner
        detectWinner: (p1, p2, win1Screen, win2Screen, tieScreen) => {
            // Setting up flags
            let pla1 = false, pla2 = false;
            // Check if there's a winner
            pla1 = getWinner(1);
            pla2 = getWinner(2);
            // Watch for the lucky winner unless the board isn't filled 
            if (!boardFilled() || (pla1 || pla2)) {
                if (pla1) {
                    $('.message').text(`Winner: ${p1.name}`);
                    win1Screen();
                }
                if (pla2) {
                    $('.message').text(`Winner: ${p2.name}`);
                    win2Screen();
                }
            // if the board is filled and no winner is found, declare 'It's a Tie!'
            } else {
                $('.message').text(`It's a tie`);
                tieScreen();
            }
        },

        // Reset the board and start a new game 
        reset: (player) => resetBoard(player),

        // Highlight the active player 
        markActivePlayer: (player) => nextTurn(player),

        // Mark each box, human playes against human 
        setBox: (player, e)=> {
            // Select data-marked attribute
            const $attr = $(e.target).attr('data-marked');
            // For player '1'
            if(player === 1){
                // If the data attribute on the selected element doesn't exist - 'mark' the box 
                if (!$attr){
                    // add a data attribute for the active player
                    $(e.target).attr("data-marked", `${player}`);
                    // add 'O' and a peculiar to this player background color
                    $(e.target).addClass("box-filled-1").css({ "background-image": "url(img/o.svg)" });
                    // set the variable to the next player
                    player = 2;
                }
                else {
                    // if the box is already 'marked', don't change the existing player
                    player = 1;
                }
                return player;
            // For player '2'    
            } else {
                // If the data attribute on the selected element doesn't exist, - 'mark' the box
                if (!$attr){
                    // add a data attribute for the active player
                    $(e.target).attr("data-marked", `${player}`);
                    // add 'X' and a peculiar to this player background color
                    $(e.target).addClass("box-filled-2").css({ "background-image": "url(img/x.svg)" });
                    // set the variable to the next player
                    player = 1;
                }else {
                    // if the box is already 'marked', don't change the existing player
                    player = 2;
                }
                return player;
            }
        },
        // Human vs Ai game
        setBoxAiMode: (e, huPla = 1, aIpla = 2) => {
            let availSpots, aiRandMove;
            const $attr = $(e.target).attr("data-marked");
            // for Human player
            if (!$attr) {
                $(e.target).attr("data-marked", `${huPla}`);
                $(e.target).addClass("box-filled-1").css({ "background-image": "url(img/o.svg)" });
            }
            // For Ai player
            availSpots = availableSpot();
            if (availSpots.length > 0) {
                aiRandMove = randMove(availSpots);
                $('#player1').removeClass('active');
                $('#player2').addClass('active');
                const arr = boxes.filter((box, i) => availSpots.includes(i));
                $(aiRandMove).attr('data-marked', `${aIpla}`);
                // Ai opponent responds to user's move within a range of 300 - 1200 milliseconds
                let aiRandThink = Math.floor(Math.random() * (1200 - 300) + 300);
                setTimeout(() => {
                    $(aiRandMove).addClass("box-filled-2").css({ "background-image": "url(img/x.svg)" });
                    $('#player1').addClass('active');
                    $('#player2').removeClass('active');
                }, aiRandThink);
            }
        },

        // Class Player
        addPlayer: (name, human) => {
            return new Player(name, human);
        },
        // Set players' names, check if player 2 is human or ai
        setPlayers: (pla1, pla2) => {
            if ($('#input-1').val() !== '') {
                pla1.name = $('#input-1').val();
                $('.name1').text(pla1.name);
            } else {
                $('.name1').text('Player 1');
                pla1.name = $('.name1').text();
            }
            if ($('#input-2').val() !== '') {
                pla2.name = $('#input-2').val();
                $('.name2').text(pla2.name);
            } else {
                $('.name2').text('Player 2');
                pla2.name = $('.name2').text();
            }
            const val2 = $(".data-2 input[type=radio]:checked").val();
            val2 !== 'human-2' ? pla2.human = false : pla2.human = true;
        },
    }
})();


// UI module 
const UIController = (function(){

    const DOMContainers = {
        // Start screen
        start: `
            <div class="screen screen-start" id="start">
                <header>
                    <h1>Tic Tac Toe</h1>
                    <div class="players-data">
                        <div class="data-1">
                            <input type="text" placeholder="player 1:" id="input-1">
                        </div>
                        <div class="data-2">
                            <input type="text" placeholder="player 2:" id="input-2">
                            <input type="radio" name="usr_pla2" value="human-2" id="human-2">  
                            <label for="human-2">Human</label>
                            <input type="radio" name="usr_pla2" value="computer-2" id="computer-2">
                            <label for="computer-2">Computer</label>
                        </div>
                    </div>
                    <a href="#" class="button">Start game</a>
                </header>
            </div>
        `,
        // Win/tie screen
        win: `
            <div class="screen screen-win" id="finish">
                <header>
                    <h1>Tic Tac Toe</h1>
                    <p class="message"></p>
                    <a href="#" class="button">New game</a>
                </header>
            </div>
        `
    }

    // Update the finish screen
    const updateScreen = (className, text) => {
        $('#finish').slideDown(1000);
        $('#board').fadeOut(1000);
        $('#finish').addClass(className);
    }

    return {
        // Render start screen
        renderStart: () => $('body').prepend(DOMContainers.start),
        // Render winner screen
        renderWinner: () => $('body').prepend(DOMContainers.win),
        // Append player's names
        appendNames: () => {
            $('#player1').append('<span class="name1"></span>');
            $('#player2').append('<span class="name2"></span>');
        },
        // Initial presets
        initialPresets: () => {
            // Hide the board
            $('#board').hide();
            // Set the default player
            $('#player1').addClass('active');
            // Set player's default settings
            $('#human-1, #human-2').prop("checked", true);
        },
        // Settings for winner/tie screen
        winOneScreen: () => updateScreen('screen-win-one'),
        winTwoScreen: () => updateScreen('screen-win-two'),
        tieScreen: () => updateScreen('screen-win-tie'),
    }
})();


// Main module 
const mainController = (function(gameCtrl, UICtrl){

    // active player (player1: 1, player2: 2)
    let activePlayer = 1; 
    // Create instances of two players
    const playerOne = gameCtrl.addPlayer();
    const playerTwo = gameCtrl.addPlayer();

    // Setup all event listeners
    const setupEventListeners = () => {
        
        // Highlight empty boxes unless they're filled
        $('.box').on('mouseover', function(e){
            const attr = $(e.target).is('[data-marked]');
            // Human players
            if(playerTwo.human !== false){
                if (!attr) {
                    $(this).css({ "background-image": `url(img/${activePlayer === 1 ? 'o' : 'x'}.svg)` });
                } 
            // Ai player
            } else {
                if (!attr){
                    $(this).css({ "background-image": "url(img/o.svg)" });
                }
            }
        });

        // Remove 'X' or 'O' unless boxes are filled
        $('.box').on('mouseout', function (e){
            const attr = $(e.target).is('[data-marked]');
            // Human players
            if(playerTwo.human !== false){
                if (!attr) {
                    if (activePlayer === 1) {
                        $(this).css({ "background-image": "" });
                    } else {
                        $(this).css({ "background-image": "" });
                    }
                }
            // Ai player
            } else {
                if (!attr){
                    $(this).css({ "background-image": "" });
                }
            }
        });

        // Hide start screen 
        $('#start .button').click(e => {
            // Prevent the default behavior
            e.preventDefault();
            // Hide the start screen and show the board
            $('#start').slideUp(300);
            $('#board').slideDown(600);
            // Setup players
            gameCtrl.setPlayers(playerOne, playerTwo);
        });

        // Event listener for each box
        $('.box').on('click', function(e) {
            const attr = $(e.target).is('[data-marked]');
            // Human vs human
            if (playerTwo.human === true) {
                activePlayer = gameCtrl.setBox(activePlayer, e);
                // Highlight the active player 
                gameCtrl.markActivePlayer(activePlayer);
                // Detect a winner/tie
                gameCtrl.detectWinner(
                    playerOne,
                    playerTwo,
                    UICtrl.winOneScreen,
                    UICtrl.winTwoScreen,
                    UICtrl.tieScreen
                );
            // Human vs Ai
            } else {
                if(!attr){
                    gameCtrl.setBoxAiMode(e);
                    // Detect a winner/tie
                    gameCtrl.detectWinner(
                        playerOne,
                        playerTwo,
                        UICtrl.winOneScreen,
                        UICtrl.winTwoScreen,
                        UICtrl.tieScreen
                    );
                }
            }
        });   
        // New Game
        $('#finish .button').click( e => {
            // Prevent the default behavior
            e.preventDefault();
            // Reset the board, hide the winner/tie screen and show a new board 
            if ($(e.target).hasClass('button')){
                activePlayer = gameCtrl.reset(activePlayer);
                $('#finish').fadeOut(150);
                $('#board').fadeIn();
            }
        });
    } 

    return {
        // Public init function
        init: () => {
            // Render the winner/tie screen and hide it
            UICtrl.renderWinner();
            $('#finish').hide();
            // Render players names
            UICtrl.appendNames();
            // Render start screen
            UICtrl.renderStart();
            // Initial presets
            UICtrl.initialPresets();
            // Initialize all event listeners
            setupEventListeners();
        }
    }
})(gameController, UIController);

mainController.init();