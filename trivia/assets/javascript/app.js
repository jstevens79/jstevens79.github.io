

// set up a new game
var game = {
  loaded: false,
  score: 0,
  totalQuestions: 12,
  currentQuestion: 0,
  maxTime: 20,
  questionTime: 0,
  questionTimer: null,
  questions: [],
  startTimer: function() {
    this.questionTime = this.maxTime;
    this.questionTimer = setInterval(function() {
      this.questionTime -=1;
      this.renderTimer(this.questionTime);
      if (this.questionTime === 0) {
        this.stopTimer();
        this.renderAnswers(true);
        this.renderResponse(false, true);
      }
    }.bind(this), 1000)
  },
  stopTimer: function() {
    clearInterval(this.questionTimer)
  },
  setupGame: function() {
    // set up initial variables    
    var title = $('<h1>')
      .addClass('title')
      .html('<i class="fas fa-star"></i> Movie Trivia <i class="fas fa-star"></i>');
    var gameWrapper = $('<div>').addClass('gameWrapper');
    var startScreen = $('<div>').addClass('startScreen');
    var startText = $('<h2>').text('Test your movie knowledge!');
    var startImage = $('<img>').attr('src', './assets/images/movie-image.png').addClass('movieImage');
    var startButton = $('<button>').attr('id', 'startGame').text('Start!');
    startScreen.append(startImage, startText, startButton);
    gameWrapper.append(startScreen);
    gameWrapper.append()
    $('body').prepend(title, gameWrapper);

    $('#startGame').click(function() {
      $(this).off();
      this.startGame();
    }.bind(this))

  },
  startGame: function() {
    this.loaded = false;
    this.gameStarted = false;
    this.score = 0;
    this.currentQuestion = 0;
    this.questions = [];
    this.questionTime = 0;
    this.questionTimer = null;
    this.getQuestions();
    var questionArea = $('<div>').addClass('questionArea');
    var responseContainer = $('<div>').addClass('responseContainer');
    var questionsContainer = $('<div>').addClass('questionContainer');
    questionArea.append(questionsContainer, responseContainer)
    var timer = $('<div>').addClass('timerContainer').append(this.createTimer());
    $('.gameWrapper').empty()
    $('.gameWrapper').append(questionArea, timer);
    
  },
  shuffle: function(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1));
      x = a[i];
      a[i] = a[j];
      a[j] = x;
    }
    return a;
  },
  renderTimer: function(time) {
    function timeConvert() {
      if (time < 10) {
        return '0' + time;
      }
      return time;
    }
    
    $('.timerText').text('00:' + timeConvert());
    $('.clockHand').css({
      'transform' : 'translateX(-50%) rotate(' + (time * 6) + 'deg)'
    })
  },
  getQuestions: function() {
    // get the json
    $.getJSON( "./assets/javascript/trivia-data.json", function(data) {
      var results = data.results;
      this.shuffle(results);
      var questions = results.slice(0, this.totalQuestions);

      // generate new objects for each question
      $.each(questions, function(ind, val) {
        var newObj = {
          answered: null, // <- may not need this...
          questionTime: game.maxTime,
          questionTimer: null,
          answers: [],
        }

        var correct = {answer: val.correct_answer, correct: true, selected: false};
        newObj.answers.push(correct);

        $.each(val.incorrect_answers, function(ind, ans) {
          var incorrect = {answer: ans, correct: false, selected: false}
          newObj.answers.push(incorrect);
        })

        game.shuffle(newObj.answers);
        var combined = {...val,...newObj};

        game.questions.push(combined);

      })

      // set up the first question
      this.setupQuestion();

    }.bind(this));    

  },
  createTimer: function() {
    var timer = $('<div>').addClass('timer');
    var timerText = $('<span>').addClass('timerText').append('00:00');
    var clockWrapper = $('<div>').addClass('clockWrapper');
    var clockInner = $('<div>').addClass('clockInner');
    var clockHand = $('<div>').addClass('clockHand');
    clockWrapper.append(clockInner, clockHand);
    var clockContainer = $('<div>').addClass('clockContainer').append(clockWrapper);
    timer.append(timerText, clockContainer);
    return timer;
  },
  setupQuestion: function() {
    $('.responseContainer').removeClass('answered');
    $('.questionContainer').empty();
    $('.responseContainer').empty();
    this.renderTimer(this.maxTime);
    var theQ = this.questions[this.currentQuestion];
    var questionTxt = $('<p>').addClass('questionText').html(theQ.question);
    var answers = $('<div>').addClass('answersContainer');
    $('.questionContainer').append(questionTxt, answers);
    
    this.renderAnswers();

    // start the timer
    this.startTimer();

    // handle clicks
    $('.answer').click(function() {
      $('.answer').off();
      game.stopTimer();
      theQ.answers[$(this).data('answer')].selected = true;
      game.renderAnswers(true);
      game.renderResponse(theQ.answers[$(this).data('answer')].correct)      
    });
    
  },
  renderAnswers: function(grade) {

    var answers = this.questions[this.currentQuestion].answers;
    $('.answersContainer').empty();

    var answersReady = [];
    
    $.each(answers, function(ind, val){

      var myAnswer = $('<div>')
        .attr('data-answer', ind)
        .addClass('answer')
        .html(val.answer); 

      if (grade !== undefined) {
        if (val.selected) {
          if (val.correct) {
            myAnswer.addClass('disabled selected correct');
          } else {
            myAnswer.addClass('disabled selected wrong');
          }
        } else {
          if (val.correct) {
            myAnswer.addClass('disabled unselected correct');
          } else {
            myAnswer.addClass('disabled wrong');
          }
        }
      }
      answersReady.push(myAnswer);
    });

    $('.answersContainer').append(answersReady);
    
  },
  renderResponse: function(correct, timesup) {
    $('.responseContainer').addClass('answered');

    if (correct) {
      $('.responseContainer').append('<h1>Good job!</h1>');
      game.score++;
      game.goToNextQuestion();
    } else {
      var getCorrect = this.questions[this.currentQuestion].answers.filter(function(ques){
        return ques.correct === true
      })

      if (timesup) {
        $('.responseContainer').append("<h1>Time's up!</h1>");
      }  else {
        $('.responseContainer').append('<h1>Incorrect.</h1>');
      }
      setTimeout(function() {
        $('.responseContainer').append('<p>The correct answer is ' + getCorrect[0].answer + '</p>');
        game.goToNextQuestion();
      }, 1000)

    }

  },

  goToNextQuestion: function() {
    setTimeout(function() {
      if (game.currentQuestion < game.questions.length - 1) {
        game.currentQuestion += 1;
        game.setupQuestion();
      } else {
        game.finishGame();
      }
    }, 3000);
  },
  finishGame: function() {
    var percentage = Math.round((game.score / game.totalQuestions) * 100);
    var perc = $('<h2>').text(percentage + '%').addClass('percentage');
    var responseText = (percentage >= 70) ? 'Good job!' : "Well, that didn't go so well."
    var finishText = $('<p>')
      .text('You got ' + game.score  + ' out of ' + game.totalQuestions + ' correct.')
      .addClass('scoreDetails');
    var finishResponse = $('<p>').text(responseText);
    var startButton = $('<button>').attr('id', 'startGame').text('Play again!');
    var startScreen = $('<div>').addClass('startScreen');
    startScreen.append(perc, finishResponse, finishText, startButton);
    var tryAgain = $('#startButton')
    $('.gameWrapper').empty();
    $('.gameWrapper').append(startScreen);

    $('#startGame').click(function() {
      $(this).off();
      this.startGame();
    }.bind(this))

  }
}


$(document).ready(function() {
  game.setupGame()
})