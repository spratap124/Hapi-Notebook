$(document).ready(function() {

  // Note Preview
  $('.headingList .nav li a.lfloat').click(function(event) {
    event.preventDefault();
    var that=$(this);
    $('a').removeClass('active');
    that.addClass('active');
    var url=$(this).data('role');
  //  console.log("url is :="+url);
    $.ajax({
      url:url,
      method:'GET',
      dataType:'text json',
      success:function(result,noteId) {
        $('.notePreview .noteHeading > span').text(result.noteHeading);
        $('.notePreview .noteValue > p').text(result.noteValue);
        console.log($('.edit a'));
        $('.edit > a')[0].href="/edit/"+result.noteId;
        $('.edit > a').css({"display":"block"});

        $('.lastModified').css({"display":"block"});
        $('.lastModified > span:last-child').html(result.lastModified);


      },
      error:function(err) {
        throw err;
      }
    });
  });

  //TRASH//

  $('.trash > a').click(function() {
    event.preventDefault();
    $('.trashContainer').fadeIn(500);
    var url = this.href;

    $.ajax({
      url:url,
      method:'GET',
      dataType:'text json',
      success:function(result) {
        console.log(result);
        for(var noteId in result){

          var $ul = $(".trashList > ul");
          var $li = $("<li>");

            var $h5 = $("<h5>",{"class":"lfloat"});

            $h5.html(result[noteId].noteHeading);

            var $unDelete = $("<div>",{class:"unDelete lfloat"});
              var $undoLink = $("<a>",{href:"/delete/"+noteId+"?type=undel"});
                var $undoSpan = $("<span>",{class:"glyphicon glyphicon-repeat"});

            $undoLink.append($undoSpan);
            $unDelete.append($undoLink);

            var $hardDelete = $("<div>",{class:"hardDelete lfloat"});
              var $hDelLink = $("<a>",{href:"/delete/"+noteId+"?type=harddel"});
                var $hDelSpan = $("<span>",{class:"glyphicon glyphicon-trash"});

            $hDelLink.append($hDelSpan);
            $hardDelete.append($hDelLink);

            $li.append($h5);
            $li.append($unDelete);
            $li.append($hardDelete);
            $ul.append($li);
        }
      },
      error:function(err) {
        throw err;
      }
    });

  });

  //CLOSE THE TRASH PANEL

  $('.closePanel').click(function() {
    $(".trashList > ul").empty();
    $('.trashContainer').fadeOut(500);
  });

});
