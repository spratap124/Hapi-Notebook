$(document).ready(function() {
  $('.headingList .nav li > a:first-child').click(function(event) {
    event.preventDefault();
    var url=$(this).data('role');
    console.log("url is :="+url);
    $.ajax({
      url:url,
      method:'GET',
      dataType:'text json',
      success:function(result) {
        $('.notePreview .noteHeading > h4').text(result.noteHeading);
        console.log(result.noteValue);
        $('.notePreview .noteValue > p').text(result.noteValue);
      },
      error:function(err) {
        console.log(err);
      }
    });
  });
});
