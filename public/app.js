// Grab the articles as a json
$.getJSON("/articles", function(data) {
  // For each one
  for (var i = 0; i < data.length; i++) {
    // Display the apropos information on the page
    $("#articles").prepend("<div class='article'><p data-id='" + data[i]._id + "'> <br /> <a href=' https://www.apnews.com" + data[i].link + "' target='_blank'> <span class='title'>" + data[i].title  + " </span></a> <br /> " + data[i].summary +  "<br/><button data-id='" + data[i]._id + "' id='save-article' class='btn btn-primary'> <i class='far fa-save'></i> Save</button> <button class='btn btn-secondary'><i class='fas fa-pencil-alt'></i> Notate</button>");
  }
});

// Grab the saved articles as a json
$.getJSON("/articles", function(data) {
  // For each one
  for (var i = 0; i < data.length; i++) {
    // Display the apropos information on the save article section
   if(data[i].saved === true){
    //console.log(data[i]);
    $("#saved").append(
      "<div class='saved-articles'> <p data-id='" + data[i]._id + "'><br /> <a href='" + data[i].link + "' target='_blank'> <span class='title'>" + data[i].title  + "</span></a><br /> " + data[i].summary + " <br/> <button data-id='" + data[i]._id + "' id='delete-article' class='btn btn-danger'>Delete</button> <button class='btn btn-secondary'><i class='fas fa-pencil-alt'></i> Notate</button>"

    )
   } 
  }
});



// Whenever someone clicks a p tag
$(document).on("click", "p", function() {
  // Empty the notes from the note section
  $("#notes").empty();
  // Save the id from the p tag
  var thisId = $(this).attr("data-id");

  // Now make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
    // With that done, add the note information to the page
    .then(function(data) {
      console.log(data);
      // The title of the article
      $("#notes").append("<h3 class='notes-title'>" + data.title + "</h3>");
      // An input to enter a new title
      $("#notes").append("<input id='titleinput' name='title' >");
      // A textarea to add a new note body
      $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
      // A button to submit a new note, with the id of the article saved to it
      $("#notes").append("<button data-id='" + data._id + "' id='savenote' class='btn btn-primary'><i class='far fa-save'></i> Save Note</button>");

      // If there's a note in the article
      if (data.note) {
        // Place the title of the note in the title input
        $("#titleinput").val(data.note.title);
        // Place the body of the note in the body textarea
        $("#bodyinput").val(data.note.body);
      }
    });
});

// When you click the savenote button
$(document).on("click", "#savenote", function() {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,    
    data: {
      // Value taken from title input
      title: $("#titleinput").val(),
      // Value taken from note textarea
      body: $("#bodyinput").val()
    }
  })
    // With that done
    .then(function(data) {

      
      // Log the response
      console.log(data);
      // Empty the notes section
      $("#notes").empty();
    });

  // Also, remove the values entered in the input and textarea for note entry
  $("#titleinput").val("");
  $("#bodyinput").val("");
});

$(document).on("click", "#save-article", function() {
  var thisId = $(this).attr("data-id");
 

  $.ajax({
    method: "PUT",
    url: "/articles/" + thisId,
    data: {saved: true}    
  }).then( data => {
    console.log(data)
  });
  location.reload();

})

$(document).on("click", "#delete-article", function() {
  let thisId = $(this).attr("data-id");

  $.ajax({
    method: "DELETE",
    url: "/articles/" + thisId,
    data: {saved: false}    
  }).then( data => {
    console.log(data)
  });
  location.reload();
})
