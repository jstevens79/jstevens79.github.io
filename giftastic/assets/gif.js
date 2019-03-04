// topics to display
var starterTopics = ['elephant', 'alligator', 'elephant', 'monkey', 'dog', 'cat'];
var topics = [];
var trending = false;
var editOpen = false;
var storing = false;

function renderButtons() {
  var buttonsRendered = [];
  topics.forEach(function(topic) {
    var bttnContainer = $('<li>');
    var bttn = $('<button>')
                .addClass('showMeTheGiphy')
                .attr('data-gif', topic)
                .text(topic);
    var remove = $('<button>')
                  .addClass('remove')
                  .attr('data-remove', topic)
                  .html('<i class="fas fa-minus-square"></i>');
    if (editOpen) {
      remove.addClass('displayed');
    }
    bttnContainer.append(bttn, remove);
    buttonsRendered.push(bttnContainer)
  })

  $('.topics').empty().append(buttonsRendered)
}

// add button
$('#topic-add').click(function(e) {
  e.preventDefault();
  var newTopic = $('#topic-input').val().trim();
  if (newTopic !== '') {
    topics.unshift(newTopic);
    if (storing) {
      localStorage.setItem('gifTopics', JSON.stringify(topics));
    }
    renderButtons();
  }
  $('#topic-input').val('');
})

function getGifs(gif) {
  var queryURL = '';
  var gifTitle = '';

  if (gif !== undefined) {
    if (trending === true) {
      $('#gifsContainer').empty();
      trending = false;
    }
    queryURL = "https://api.giphy.com/v1/gifs/search?q=" + gif + "&api_key=TCW1jTUIEdZrL78UFfUCHtWVO7VpiHTg&rating=pg&limit=10&offset=0";
    gifTitle = gif;
  } else {
    queryURL = "https://api.giphy.com/v1/gifs/trending?api_key=TCW1jTUIEdZrL78UFfUCHtWVO7VpiHTg&rating=pg-13&limit=10";
    gifTitle = 'Some trending GIFs to get you started';
    trending = true;
  }

  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function(response) {
    var results = response.data;
    var gifHolder = $('<div>').addClass('gifHolder');
    var title = $('<h2>').text(gifTitle);
    gifHolder.append(title);
    results.forEach(function(res) {
      var gifDiv = $('<div>').addClass('gifContainer');
      var gifOverlay = $('<div>').addClass('gifOverlay');
      var rating = $('<span>').addClass('rating');
      rating.text('Rating: ' + res.rating);
      var playPause = $('<span>').addClass('playPause');
      playPause.html('<i class="fas fa-play"></i>');
      gifOverlay.append(playPause, rating);
      var myGif = $('<img>').addClass('gif');
      myGif.attr('src', res.images.fixed_height_still.url);
      myGif.attr('data-src-still', res.images.fixed_height_still.url);
      myGif.attr('data-src-gif', res.images.fixed_height.url);
      myGif.attr('data-state', "still");
      gifDiv.append(myGif, gifOverlay);
      gifHolder.append(gifDiv);
    })
    
    $('#gifsContainer').prepend(gifHolder);
    $('#gifsDisplayed').scrollTop($('#gifsDisplayed').scrollTop() + $('#gifsContainer').position().top - 40);
    
  });
  
}

$(document).on("click", ".showMeTheGiphy", function() {
  var gif = $(this).attr("data-gif");
  getGifs(gif);
});

$(document).on("click", ".remove", function() {
  var myTopic = $(this).attr('data-remove');
  var myIndex = topics.indexOf(myTopic)
  topics.splice(myIndex, 1);
  if (storing) {
    localStorage.setItem('gifTopics', JSON.stringify(topics));
  }
  renderButtons();
});


$(document).on("click", ".gifContainer", function() {
  var myGif = $(this).find('.gif');
  if (myGif.attr('data-state') === 'still') {
    myGif.attr('src', myGif.data('src-gif'));
    myGif.attr('data-state', 'playing');
    $(this).addClass('playing');
    $(this).find('.playPause').html('<i class="fas fa-pause"></i>');
  } else {
    myGif.attr('src', myGif.data('src-still'));
    myGif.attr('data-state', 'still');
    $(this).removeClass('playing');
    $(this).find('.playPause').html('<i class="fas fa-play"></i>');
  }
})

$('.saveLink').click(function(e) {
  e.preventDefault();
  storing = !storing;
  if (storing) {
    $(this).find('.indicator').html('<i class="fas fa-bookmark"></i>');
    localStorage.setItem('gifTopics', JSON.stringify(topics));
  } else {
    $(this).find('.indicator').html('<i class="far fa-bookmark"></i>');
    localStorage.removeItem('gifTopics');
  }
});


$('.editLink').click(function(e) {
  e.preventDefault();
  editOpen = !editOpen;
  if (editOpen) {
    $(this).text('close')
  } else {
    $(this).text('edit list')
  }
  $('.remove').toggle("fast", function() {
    console.log('anything?')
    $('.remove').addClass('displayed');
  })
});


$(document).ready(function() {
  if (localStorage.gifTopics !== undefined) {
    storing = true;
    $('.saveLink').find('.indicator').html('<i class="fas fa-bookmark"></i>');
    topics = JSON.parse(localStorage.gifTopics)
  } else {
    topics = starterTopics;
  }
  renderButtons();
  getGifs();
})



