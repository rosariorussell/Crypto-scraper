function saveEvent () {
  $('.table-striped').on('click', '.save', function () { // --!!!--> .save should be fixed because it gets clicked twice
    console.log('jjj')
    var currentRow = $(this).closest('tr')
    var col1 = currentRow.find('td:eq(0)').text()
    var col2 = currentRow.find('td:eq(1)').text()

    $.ajax({
      method: 'POST',
      url: '/api/save',
      data: { title: col1, summary: col2 }
    }).done(function (data) {

    }) // end of $.ajax
  })
}

function deleteArticle () {
  $('.table-striped').on('click', '.delete', function () {
    // console.log("test");
    console.log($(this).parent('td'))
    var rowId = $(this).parent('td').parent('tr').attr('id')
    console.log(rowId)
    $(this).closest('tr').remove()
    $.ajax({
      method: 'DELETE',
      url: '/api/article/' + rowId
    }).done(function (data) {
      // window.location="/articles";
    })
  })
}

function deleteNotes () {
  $('.deleteComment').on('click', function () {
    // console.log("test");
    console.log($(this).parent('td'))
    var rowId = $(this).parent('td').parent('tr').attr('id')
    console.log(rowId)
    $(this).closest('tr').remove()
    $.ajax({
      method: 'DELETE',
      url: '/comment/' + rowId
    }).done(function (data) {
      // window.location="/articles";
    })
  })
}

$(document).ready(function () {
  // console.log("ready!");
  $('#scrape').on('click', function () {
    // console.log("hello");
    $('tbody').empty()
    $.ajax({
      method: 'GET',
      url: '/scrape'
    }).done(function (data) {
      console.log(data)
      // $("#headings").contents().remove();
      $('#headings').html('<h1>Collected Market Caps</h1>')
      for (var i = 0; i < data.length; i++) {
        var price = parseFloat(data[i].summary).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')

        $('#nyt-articles').append(
          '<tbody><tr><td>' + data[i].title + '</td>' +
          '<td>$' + price + '</td>' +
          "<td><button class='btn btn-success save'> Save Crypto Price </button></td></tr></tbody>"
        )
      }
      saveEvent() // --!!!--> .save should be fixed because it gets clicked twice
    })
  })

  $('#home').on('click', function (event) {
    event.preventDefault()
    window.location = '/'
  })

  $('#savedArticles').on('click', function (event) {
    event.preventDefault()
    $.ajax({
      method: 'GET',
      url: '/articles'
    }).done(function (data) {
      console.log(data)
      $('#page-title1').html('S')
      $('#page-title2').html('AVED')
      $('#page-title3').html('A')
      $('#page-title4').html('RTICLES')
      $('#headings').html('<h1>Saved Articles</h1>')
      $('tbody').empty()

      for (var i = 0; i < data.length; i++) {
        $('#nyt-articles').append(
          '<tbody><tr id =' + data[i]._id + ' ><td>' + data[i].title + '</td>' +
          '<td>' + data[i].summary + '</td>' +
          "<td><button class='btn btn-success articleComments' data-toggle='modal' data-target='#comment' data-id=" + data[i]._id + " >Article Notes</button></td><td><button class='btn btn-danger delete'>Delete Article</button></td></tr></tbody>"
        )
      }// end of for loop
      deleteArticle()
      // displayArticleComments();
      // createComment();
    })// end of $.ajax
  })

  // code below is to pass the article id to the comment-modal so that eventually I can create a comment and link it to the correct article.
  $('#comment').on('show.bs.modal', function (e) {
    // get data-id attribute of the clicked element
    var articleId = $(e.relatedTarget).data('id')
    // console.log(articleId);
    $('#comment').attr('data-article-id', articleId)
    // console.log(articleId);
    // populate the textbox
    // ------------- AJAX CALL ALL THE NOTES WITH ARTICLE ID
    $.ajax({
      method: 'GET',
      url: '/articles/' + articleId
    }).done(function (data) {
      console.log(data)
      for (var i = 0; i < data.comment.length; i++) {
        console.log(data.comment.length)
        $('.comment_list').append(
          '<tbody><tr id=' + data.comment[i]._id + '><td>&bull;  ' + data.comment[i].body + "  <button class='btn btn-danger deleteComment'>X</button>"
        )
      }
      deleteNotes()
    })

    $('.saveComments').on('click', function (event) {
      event.preventDefault
      var modalId = $('#comment').attr('data-article-id')
      console.log(modalId)
      console.log($('#myTextArea').val())
      // var thisId = $(this).attr("data-article-id");
      $.ajax({
        method: 'POST',
        url: '/api/new_comment/' + modalId,
        data: {
          body: $('#myTextArea').val()
        }
      }).done(function (data) {
        // $(".comment_list").html(data);
        alert('comment saved')
      })

      // $.ajax({
      //   method:"GET",
      //   url:"/articles/"+ modalId,
      // }).done(function(data){
      //   // $(".comment_list").html(data);
      //   alert("comment saved");
      // });
    })
  })
}) // END OF DOCUMENT READY

// // When you click the savenote button
// $(document).on("click", "#savenote", function() {
//   // Grab the id associated with the article from the submit button
//   var thisId = $(this).attr("data-id");

//   // Run a POST request to change the note, using what's entered in the inputs
//   $.ajax({
//     method: "POST",
//     url: "/articles/" + thisId,
//     data: {
//       // Value taken from title input
//       title: $("#titleinput").val(),
//       // Value taken from note textarea
//       body: $("#bodyinput").val()
//     }
//   })
//     // With that done
//     .done(function(data) {
//       // Log the response
//       console.log(data);
//       // Empty the notes section
//       $("#notes").empty();
//     });

//   // Also, remove the values entered in the input and textarea for note entry
//   $("#titleinput").val("");
//   $("#bodyinput").val("");
// });
