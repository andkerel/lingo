///////////////////////
//LOADING AND SIDEBAR//
///////////////////////


$(document).ready(function () {
    
     var height = window.innerHeight;


    if(height<700) {
        $("#spinner").css('margin-top', '20vh');    
    } else if (height<900) {
        $("#spinner").css('margin-top', '30vh');
    }

    $("li").click(function () {
        $("li").not(this).removeClass('active');
        $(this).toggleClass('active');
    });


    $(".question").click(function () {
        $("#message").slideToggle(function () {
            if($("#message").is(':visible')) {
                $("#quest").css("display", "none");
                $("#exit").css("display", "block").addClass('question');
            } else if($("#message").is(':hidden')) {
                $("#quest").css("display", "block").addClass('question');
                $("#exit").css("display", "none");
            }
        });
    });

    var request; 
    var interval;

    var blah = true;

    $(".plus").click(function() {

        if (blah == true) {

            request = $.ajax({
                data: {slang:$(".slang").val()} ,
                type: "POST",
                url: "php/add-slang.php",
            });

            request.done(function (data){
                console.log("DONE!");
            });

            request.always(function(data) {
                console.log("ITS GOIN");
            });

            $(".slang").addClass('sChange');
            $(".plus").addClass('pChange');

            $(".plus").val("Pending Approval!");

            blah = false;

            interval = setTimeout(function(){ 
                changeBack();
            }, 3000);

        }

    });

    function changeBack(){
        $(".slang").removeClass('sChange');
        $(".plus").removeClass('pChange');

        $(".plus").val("+");
        $(".slang").val("");
        blah = true;    
    }

    $('.sidebar').simpleSidebar({
        settings: {
            opener: '#open-sb',
            wrapper: '.wrapper',
            animation: {
                duration: 500,
                easing: 'easeOutQuint'
            }
        },
        sidebar: {
            align: 'left',
            width:400,
            closingLinks: 'a',
        }
    });



});