$(document).ready(function() {
      
    $(".res").each(function() {
      if ($(this).text().toLowerCase().indexOf('wp') < 0) {
        $(this).remove();
      }
      $(this).css({
      "font-family":"Quicksand",
      "color":"#e6dae1",
      "margin":"30px 0px 30px 0px",
      "padding":"5px",
      "font-size":"22px",
      "list-style-type":"none",
      "list-style-position":"left",
      "text-align":"left",
      "background-color":"#104E8B",
      "border-radius":"10px",
      "overflow":"auto",
      "width":"100%"})
    });
    
    var arrz = [];
    $('ul').children().each(function() {
      arrz.push($(this).text());
    });
    var ids = [];
    for (i = (arrz.length/2); i < arrz.length; i++) {
      ids.push(arrz[i]);
    }
    var code = [];
    $(".res").one("click", function() {
      $(this).css("pointer-events", "none");
      var index = $(this).parent().children().index(this);
      code = ids[index];
      $.post("/anredd", {url: code}, function (data) {

        $(".container").replaceWith('<br><input type="submit", id="check", value="Check Answers"/><input type="button", class="back", value="Go Back", onclick="history.go(0)"/><br>');
        $(".container").append('<p>"if your answers are correct, they will turn green!"</p>');

        $("#reddit-content").replaceWith('<div class="story">' + data + '</div>');

        var tButton = '<select class="the btn" name="the"><option value="null">(select)</option><option value="the">the</option><option value="a">a</option><option value="an">an</option></select>'

        var anButton = '<select class="an btn" name="an"><option value="null">(select)</option><option value="the">the</option><option value="a">a</option><option value="an">an</option></select>'

        var aButton = '<select class="a btn" name="a"><option value="null">(select)</option><option value="the">the</option><option value="a">a</option><option value="an">an</option></select>'

        var tempArr = $('.story').text().split(' ');
        for (i = 0; i < tempArr.length; i++) {
          if (tempArr[i] == 'the') {
            tempArr[i] = "" + tButton + "";
          }
          if (tempArr[i] == 'an') {
            tempArr[i] = "" + anButton + "";
          }
          if (tempArr[i] == 'a') {
            tempArr[i] = "" + aButton + "";
          }
        }
        var fStory = tempArr.join(' ');
        $('.story').html(fStory);

        $('html, body').animate({ scrollTop: 0 }, 0);

        $("#check").click(function() {
          $(".the").each(function() {
           if ($(this).val() == 'the') {
               $(this).css("background-color", "#00FF00");
               $(this).css("pointer-events", "none");
           }
          });
          $(".an").each(function() {
           if ($(this).val() == 'an') {
               $(this).css("background-color", "#00FF00");
               $(this).css("pointer-events", "none");
           }
          });
          $(".a").each(function() {
           if ($(this).val() == 'a') {
               $(this).css("background-color", "#00FF00");
               $(this).css("pointer-events", "none");
           }
          });
        });
      });
    });

  });