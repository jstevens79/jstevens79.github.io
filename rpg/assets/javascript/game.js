// 
var rpgGame = {
  gameStarted: false,
  playerChosen: null,
  enemyChosen: null,
  attacking: false,
  characters: [],
  setupGame: function () {
    // reset everything
    $('#gameWrapper').empty();
    this.characters = [];
    this.playerChosen = null;
    this.enemyChosen = null;

    var header = $('<header>');
    header.append('<image class="logo" alt="star wars logo" src="' + './assets/images/Star_Wars_Logo.png' + '">');
    $('#gameWrapper').append(header);

    // create characters object
    this.generateCharacters();

    var stage = $('<div>').addClass('stage');
    var gameInstructions = $('<h1>').addClass('instructions').text('Choose your character.');
    var battleArea = $('<div>').addClass('battleArea');

    // setup character select area
    var characterSelect = $("<div>").addClass("characterSelect");
    battleArea.append(characterSelect);

    stage.append(gameInstructions).append(battleArea);

    // setup the controls area
    var controls = $('<div>').addClass('controls').toggle();    
    $('#gameWrapper').append(stage).append(controls);

    // add characters to characterSelect
    this.stageCharacters();
    
  },

  generateCharacters: function () {
    var that = this;

    function addCharacter(name, health, attack, counterAttack, image) {
      var character = {
        name: name,
        health: health,
        attack: attack,
        currentAttack: attack,
        counterAttack: counterAttack,
        defeated: false,
        image: image
      }
      that.characters.push(character);
    }

    //name, health, attack, counterAttack, image
    addCharacter('luke skywalker', 160, 20, 15, './assets/images/skywalker.jpg');
    addCharacter('darth vader', 200, 25, 22, './assets/images/vader.jpg');
    addCharacter('yoda', 190, 24, 20, './assets/images/yoda.jpg');
    addCharacter('kylo ren', 140, 18, 20, './assets/images/kylo.jpg');
    addCharacter('rey', 130, 15, 15, './assets/images/rey.jpg');
    addCharacter('chewbacca', 160, 22, 25, './assets/images/chewy.jpg');

  },

  characterCard: function (a, classy) {
    // setup and return a character card
    var classCheck = (a.defeated) ? ' defeated' : classy;
    
    var card = $("<div>")
      .addClass('characterCard')
      .addClass(classCheck)
      .attr('data-character', this.characters.indexOf(a))
      .append("<img alt='" + a.name + "' src='" + a.image + "'>");

    var stats = $("<div>")
      .addClass('characterStats')
      .append("<h3>" + a.name + "</h3>")
      .append("<span class='stats'><i class='fas fa-heart'></i></i> <span class='health'>" + a.health + "</span></span>");

    card.append(stats);

    return card;
    
  },

  reRenderCards: function () {
    // update the character cards
    $('.characterCard').each(function(i, obj) {
      var c = $(this).data("character");
      $(this).find('.health').text(rpgGame.characters[c].health)
      if(rpgGame.characters[c].health === 0) {
        $(this).removeClass('select').addClass('defeated')
      }
    })
    // update the chosen player stats
    console.log(rpgGame.characters[rpgGame.playerChosen].currentAttack)
    $('.controls').find('.health').text(rpgGame.characters[rpgGame.playerChosen].health);
    $('.controls').find('.attackStat').text(rpgGame.characters[rpgGame.playerChosen].currentAttack);
  },

  stageCharacters: function () {
    $.each(this.characters, function (index, value) {
      $('.characterSelect').append(this.characterCard(value, 'select'));
    }.bind(this))

    $('.select').click(function () {
      if (rpgGame.playerChosen === null) {
        rpgGame.choosePlayer($(this).data("character"));
        $(this).remove();
      } else {
        rpgGame.chooseEnemy($(this).data("character"));
      }
    })
  },

  choosePlayer: function (a) {
      this.playerChosen = a;
      this.updatePlayerDash();
      $('.instructions').text('Choose your foe.');
      $('.controls').toggle("slow");
  },

  updatePlayerDash: function () {
    var player = this.characters[this.playerChosen];
    var playerPic = $('<img>')
      .attr('src', player.image)
      .attr('alt', player.name + '_icon')
      .addClass('playerIcon');
    var yourPlayer = $('<h1>').text('Your player');
    var playerName = $('<h3>').text(player.name);
    var powers = $('<div>')
      .addClass('powerStats')
      .append("<div class='stats'><i class='fas fa-heart'></i></i> <span class='health'>" + player.health + "</span> <span class='blue'>// Attack Power: <span class='attackStat'>" + player.currentAttack + "</span><span></div>"); 
    

    $('.controls').append(yourPlayer).append(playerPic).append(playerName).append(powers);
  },
  
  chooseEnemy: function (a) {
    this.enemyChosen = a;

    $('.instructions').text('Fight!');

    $('.characterSelect').fadeTo("fast", 0, function() {
      var battle = $('<div>').addClass('battle');
      var player = $('<div>')
        .addClass('battlePlayer')
        .append(rpgGame.characterCard(rpgGame.characters[rpgGame.playerChosen], rpgGame.playerChosen, 'chosen'));
      var enemy = $('<div>')
        .addClass('battleEnemy')
        .append(rpgGame.characterCard(rpgGame.characters[rpgGame.enemyChosen], rpgGame.enemyChosen, 'chosenCompetitor'));
      var attackArea = $('<div>').addClass('attackBar');
      var attackButton = $('<button>').addClass('attack').text('Attack');
      attackArea.append(attackButton);
      battle.append(player).append(enemy).append(attackArea);
      $('.battleArea').append(battle);

      $('.attack').click(function () {
        if (!rpgGame.attacking) {
          $(this).addClass('disabled');
          rpgGame.attack();
        }
      })
    });
    
  },

  continueGame: function() {
    $('.battle').fadeTo("fast", 0, function(){
      $(this).remove();
      $('.characterSelect').fadeTo("fast", 1);
    })
  },

  attack: function () {
    var Player = this.characters[this.playerChosen];
    var Enemy = this.characters[this.enemyChosen];
    this.attacking = true;

    // attack the enemy
    $('[data-character="' + this.enemyChosen + '"]').addClass('gettingAttacked');
    var updatedEnemyHealth = Enemy.health - Player.currentAttack;
    Enemy.health = (updatedEnemyHealth <= 0) ? 0 : updatedEnemyHealth;
    Enemy.defeated = (Enemy.health === 0) ? true : false;
    Player.currentAttack = Player.currentAttack + Player.attack;

    setTimeout(function() {
      this.reRenderCards();
      $('[data-character="' + this.enemyChosen + '"]').removeClass('gettingAttacked');
      $('[data-character="' + this.playerChosen + '"]').addClass('gettingAttacked');
    }.bind(this), 1200)
    
    // get attacked
    setTimeout(function() {
      var updatedHealth = Player.health - Enemy.counterAttack;
      Player.health = (updatedHealth <= 0) ? 0 : updatedHealth;
      this.reRenderCards();
      this.attacking = false;
      this.score();
      $('[data-character="' + this.playerChosen + '"]').removeClass('gettingAttacked');
    }.bind(this), 2400)
    
  },

  score: function () {
    var playerDefeated = (this.characters[this.playerChosen].health <= 0) ? true : false;
    var enemyDefeated = (this.characters[this.enemyChosen].health <= 0) ? true : false;
    
    if (playerDefeated) {
      $('.attack').remove();
      $('.attackBar').append('<button onclick="rpgGame.setupGame()">You lost. Try again.</button>');
      return;
    }

    if (enemyDefeated) {
      $('.attack').remove();
      setTimeout(function() {
        if (this.checkIfAllDefeated()) {
          this.restartGameButton('Play again');
          $('.attackBar').append('<button onclick="rpgGame.setupGame()">You won! Play again?</button>');
        } else {
          this.continueGame();
          $('.instructions').text('Choose your foe.');
        }
      }.bind(this), 1200);
    }

    $('.disabled').removeClass('disabled');

  },

  checkIfAllDefeated: function() {
    var allDefeated = true;
    $.each(this.characters, function(index, value) {
      if (index !== this.playerChosen) {
        if (value.defeated === false) {
          allDefeated = false;
          return;
        }
      }
    }.bind(this));
    return allDefeated;
  },


}

rpgGame.setupGame();
