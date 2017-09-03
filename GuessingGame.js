function generateWinningNumber() {
    return Math.floor(Math.random() * 100 + 1); 
}

function shuffle(arr) {
    var n = arr.length
    var t;
    var i;

    while (n) {
        i = Math.floor(Math.random() * n--);

        t = arr[n];
        arr[n] = arr[i];
        arr[i] = t;
    }

    return arr;
}

function Game() {
    this.playersGuess = null;
    this.pastGuesses = [];
    this.winningNumber = generateWinningNumber();
}

Game.prototype.difference = function() {
    return Math.abs(this.playersGuess - this.winningNumber);
}

Game.prototype.isLower = function() {
    if (this.playersGuess < this.winningNumber) {
        return true;
    }

    return false;
}

Game.prototype.playersGuessSubmission = function(num) {
    if (num < 1 || num > 100 || typeof num !== "number") {
        throw "That is an invalid guess.";
    }

    this.playersGuess = num;
    return this.checkGuess();
}

Game.prototype.checkGuess = function() {
    if (this.playersGuess === this.winningNumber) {
        $("#title").text("You win!");
        $("#subtitle").text("Click the Reset button to play again.");
        $("#submit, #hint").prop("disabled", true);
        return "You Win!"
    }
    else {
        if (this.pastGuesses.indexOf(this.playersGuess) !== -1) {
            $("#title").text("Guess again!");
            return "You have already guessed that number.";
        }
        else {
            this.pastGuesses.push(this.playersGuess);
            if (this.pastGuesses.length === 5) {
                $("#title").text("You lose :(");
                $("#subtitle").text("Click the Reset button to play again.");
                $("#submit, #hint").prop("disabled", true);
                return "You Lose.";
            }
            else {
                $(".guess li:nth-child(" + this.pastGuesses.length + ")").text(this.playersGuess);
                var diff = this.difference();

                if (diff < 10) {
                    return "You're burning up!";
                }
                else if (diff < 25) {
                    return "You're lukewarm.";
                }
                else if (diff < 50) {
                    return "You're a bit chilly.";
                }
                else {
                    return "You're ice cold!";
                }
            }
        }
    }
}

function newGame() {
    return new Game();
}

Game.prototype.provideHint = function() {
    var arr = [this.winningNumber, generateWinningNumber(), generateWinningNumber()];
    return shuffle(arr);
}

function makeAGuess(game) {
    var guess = $("#player-input").val();
    $("#player-input").val("");
    var output = game.playersGuessSubmission(parseInt(guess, 10));
    console.log(output);
}

$(document).ready(function() {

    var game = new Game();

    $("#submit").on("click", function() {
        makeAGuess(game);
    })

    $("#player-input").on("keyup", function() {
        if (event.which == 13) {
            makeAGuess(game);
        }
    })

    $("#reset").on("click", function() {
        game = new Game();
        $("title").text("Guessing Game!");
        $("subtitle").text("Guess a number between 1-100");
        $(".guess").text("-");
        $("#submit, #hint").prop("disabled", false);
    })

    $("#hint").on("click", function() {
        var hints = game.provideHint();
        $("#title").text("The winning number is " + hints[0] + ", " + hints[1] + ", or " + hints[2] + ".");
    })
})