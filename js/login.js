
$(document).ready( () => {
//handler for click on submit in login form
    $(".login").on('click','.submit', (e) => {
        //prevent page reload
        e.preventDefault();
        //fetch username and password from input fields
        let username = $("#login .username").val();
        let password = ($("#login .password").val());
        SDK.login(username,password, (err, data) => {
            if(err) {
                return $('#login .form-input').addClass('error')
            }
            $("#login .form-input").addClass('success');
            $(".login").removeClass('slideInLeft');
            $(".login").addClass('fadeOutDown');
            $(".switch").addClass('fadeOutDown');

            setTimeout(loadUser,1000);
        })
    });

    $(".Opret").on('click','.submit', (e) => {
        e.preventDefault();
        if ($("#Opret .username").val().length > 7 && $("#Opret .password").val().length > 7) {
            username = $("#Opret .username").val();
            password = ($("#Opret .password").val());
            SDK.Users.create(username,password, (err, data) => {
                if(err) {
                    return $('#Opret .form-input').addClass('error')
                }
                $("#Opret .form-input").addClass('success');
                $(".switch").html('Har du ikke en bruger?');
                $(".login").addClass('slideInLeft');
                $(".login").removeClass('slideOutLeft');
                $(".Opret").addClass('slideOutLeft');
                $(".Opret").removeClass('slideInLeft');
                $(".login .username").val(username);
            })
        } else {
            alert("username and password must be at least 8 characters");
        }
    });
$(".switch").on('click', () => {
    if ($(".login").hasClass('slideOutLeft')) {
        $(".login").addClass('slideInLeft');
        $(".login").removeClass('slideOutLeft');
        $(".Opret").addClass('slideOutLeft');
        $(".Opret").removeClass('slideInLeft');
    } else {
        $(".login").addClass('slideOutLeft');
        $(".login").removeClass('slideInLeft');
        $(".Opret").addClass('slideInLeft animated');
        $(".Opret").removeClass('slideOutLeft');
    }
})


});


loadUser = () => {
    if (!SDK.Storage.load("isPersonel"))
    {
        window.location.href = "userMainPage.html";
    } else {
        window.location.href = "staffMainPage.html"; }
};