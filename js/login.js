
$(document).ready(function () {
//handler for click on submit in login form
    $(".login").on('click','.submit', function (e) {
        //prevent page reload
        e.preventDefault();
        //fetch username and password from input fields
        $username = $("#login .username").val();
        $password = ($("#login .password").val());
        API.login($username,$password,function (err,data) {
            if(err) {
                return $('#login .form-input').addClass('error')
            }
            $("#login .form-input").addClass('success')
            $(".login").removeClass('slideInLeft');
            $(".login").addClass('fadeOutDown');
            $(".switch").addClass('fadeOutDown');


            if (!API.Storage.load("isPersonel"))
            {
                window.location.href = "userMainPage.html";
            } else {
                window.location.href = "staffMainPage.html"; }
        })
    });

    $(".Opret").on('click','.submit', function (e) {
        e.preventDefault();
        if ($("#Opret .username").val().length > 7 && $("#Opret .password").val().length > 7) {
            $username = $("#Opret .username").val();
            $password = ($("#Opret .password").val());
            API.Users.create($username,$password,function (err,data) {
                if(err) {
                    return $('#Opret .form-input').addClass('error')
                }
                $("#Opret .form-input").addClass('success')

            })
        } else {
            alert("username and password must be at least 8 characters");
        }
    });
$(".switch").on('click',function () {
    if ($(".login").hasClass('slideOutLeft')) {
        $(".switch").html('Har du ikke en bruger?');
        $(".login").addClass('slideInLeft');
        $(".login").removeClass('slideOutLeft');
        $(".Opret").addClass('slideOutLeft');
        $(".Opret").removeClass('slideInLeft');
    } else {
        $(".switch").html('Har du en bruger?');
        $(".login").addClass('slideOutLeft');
        $(".login").removeClass('slideInLeft');
        $(".Opret").addClass('slideInLeft animated');
        $(".Opret").removeClass('slideOutLeft');
    }
})


});