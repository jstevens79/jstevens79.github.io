
var letters = /^[a-zA-Z]+$/;
var wordContainer = document.getElementById('wordToGuess');
var getStartedContainer = document.getElementById('getStarted');
var wrongGuessesContainer = document.getElementById('wrongGuesses');
var wrongLettersContainer = document.getElementById('wrongLetters');
var livesContainer = document.getElementById('lives');
var livesIcons = document.getElementById('livesIcons');
var scoreBoardContainer = document.getElementById('scoreArea');
var winsContainer = document.getElementById('wins');
var lossesContainer = document.getElementById('losses');
var responseImageCard = document.getElementById('responseImageCard');

// audio
var gameStartAudio = document.getElementById('gameStartAudio');
var winAudio = document.getElementById('winAudio');
var loseAudio = document.getElementById('loseAudio');

var game = {
  wins: 0,
  losses: 0,
  gameStarted: false,
  currentWordArray: [],
  lives: 4,
  lettersContainer: null,
  incorrectLetters: [],
  words: [
    {
      name: "Spider-Man",
      played: false
    },
    {
      name: "Vision",
      played: false
    },
    {
      name: "Steve Rogers",
      played: false
    },
    {
      name: "Vibranium",
      played: false
    },
    {
      name: "Hawkeye",
      played: false
    },
    {
      name: "Wakanda",
      played: false
    },
    {
      name: "Iron Man",
      played: false
    },
    {
      name: "Star-Lord",
      played: false
    },
    {
      name: "Groot",
      played: false
    },
    {
      name: "Black Widow",
      played: false
    },
    {
      name: "Infinity Stone",
      played: false
    },
    {
      name: "Thanos",
      played: false
    },
    {
      name: "Dr Strange",
      played: false
    }
  ],

  startNewGame: function() {

    gameStartAudio.play();
    gameStartAudio.volume = 0.6;

    // hide get started div
    getStartedContainer.classList.add('hidden');
    wordContainer.classList.remove('hidden');
    wrongGuessesContainer.classList.remove('hidden');
    livesContainer.classList.remove('hidden');
    scoreBoardContainer.classList.remove('hidden');

    this.gameStarted = true;
    this.setUpWordInfo();
    this.updateLivesRemaining(4);
    this.updateScoreBoard();
  },
 
  getRandomIndex: function() {

    // if there are any available words to play, return a random index
    if (!this.words.every(x => x.played === true)) {
      var rInd = null;
      var ind
      
      do {
        ind = Math.floor(Math.random() * this.words.length)
        if (!this.words[ind].played) { rInd = ind; }
      } while (rInd === null)
      
      return ind;

    } else {
      // reset it if there are no more available words
      this.resetWords();
    }
  
  },

  resetWords: function() {
    this.words.forEach(function(val) {
      val.played = false;
    });
    this.setUpWordInfo();
  },

  setUpWordInfo: function() {
    // flush current word and guessed letters arrays
    this.currentWordArray = [];
    this.incorrectLetters = [];
    this.renderWrongLetters();

    var currentIndex = this.getRandomIndex();

    this.words[currentIndex].played = true;
    var wordArray = this.words[currentIndex].name.split('');

    wordArray.forEach(function(char, i) {
      var special = (!char.match(letters)) ? true : false;
      this.currentWordArray.push({ letter: char, answered: special, nonAlpha: special })
    }.bind(this))

    this.renderWord();   
  },

  renderWord: function() {
    // flush the current div
    while(wordContainer.firstChild) {
      wordContainer.removeChild(wordContainer.firstChild);
    }

    this.currentWordArray.forEach(function(char, i) {
      var letterSpan = document.createElement('span');
      letterSpan.classList.add('letterSpace');

      if (!char.nonAlpha) {
        if (!char.answered) {
          letterSpan.innerText = '_';
        } else {
          letterSpan.innerText = char.letter;
        }
      } else {
        letterSpan.classList.add('noBorder');
        letterSpan.innerText = char.letter;
      }

      wordContainer.append(letterSpan);
    
    }.bind(this))
  },

  checkLetter: function(l) {
    // look for the letter in the current word array
    // set that object's anwswered property to true if it's found
    var letterRight = false;
    var alreadyGuessedCorrect = false;
    this.currentWordArray.forEach(function(val) {
      if (val.letter.toLowerCase() === l) {
        letterRight = true;
        alreadyGuessedCorrect = (!val.answered) ? false : true;
        val.answered = true;
      }
    });
    // if there were right letters found, re-render the word
    if (letterRight === true) {
      // prevent already correct guessed letters from scoring
      if (alreadyGuessedCorrect === false) {
        this.renderWord();
        this.handleScoring(true);
      }
    } else {
      // if this letter hasn't already been guessed
      if (this.incorrectLetters.indexOf(l) === -1) {
        this.incorrectLetters.push(l);
        this.renderWrongLetters();
        this.handleScoring(false);
      }      
    }
    
  },

  handleScoring: function(correct) {
    if (correct) {
      if (this.currentWordArray.every(w => w.answered === true)) {
        this.wins = this.wins += 1;
        this.completedWordResponse();
      }
    } else {
      this.lives = this.lives -= 1;
      this.updateLivesRemaining();
      
      if (this.lives === 0) { 
        this.losses = this.losses += 1;
        this.failedWordResponse();
      }
    }
    
    this.updateScoreBoard();
  },

  renderWrongLetters: function() {
    // flush the current div
    while(wrongLettersContainer.firstChild) {
      wrongLettersContainer.removeChild(wrongLettersContainer.firstChild);
    }

    this.incorrectLetters.forEach(function(l) {
      wrongLettersContainer.append(l);
    });
  },

  updateLivesRemaining: function(num) {
    if (num !== undefined) {
      this.lives = num;
    }

    while(livesIcons.firstChild) {
      livesIcons.removeChild(livesIcons.firstChild);
    }
    
    for (i = 0; i < this.lives; i++) {
      var star = document.createElement('i');
      //star.classList.add('fas');
      star.setAttribute('class', 'fas fa-star')
      livesIcons.append(star);
    }  
  },

  updateScoreBoard: function() {
    winsContainer.innerText = this.wins;
    lossesContainer.innerText = this.losses;
  },

  completedWordResponse: function() {
    // play correct word sound
    winAudio.play();

    // show captain america
    responseImageCard.classList.add('correct');

    setTimeout(function() {
      this.setUpWordInfo();
      this.updateLivesRemaining(4);
      responseImageCard.classList.remove('correct');
    }.bind(this), 1800);
  },

  failedWordResponse: function() {
    
    // play failed game sound
    loseAudio.play();

    // show thanos
    responseImageCard.classList.add('incorrect');
    
    setTimeout(function() {
      this.setUpWordInfo();
      this.updateLivesRemaining(4);
      responseImageCard.classList.remove('incorrect');
    }.bind(this), 1800);

  }

}


// listen for user input
document.addEventListener('keyup', function(e) {

  if (!game.gameStarted) {
    game.startNewGame();
  } else {
    var theKey = e.key.toLowerCase()
  
    if (theKey.match(letters) && theKey.length === 1) {
      game.checkLetter(theKey);
    }

  }

})
  
