if(!Hangout) Hangout={};

Hangout.LoginPage = function(){
    this.init = function(){
        $("#loginButton").click(promptLogin);
        FB.Event.subscribe('auth.statusChange', onLoginStatusChange);
    }

    this.checkLoginStatus = function(){
        FB.getLoginStatus(onLoginStatusChange);
    }

    var promptLogin = function () {
        $(".page").hide();
        $(".loading").show();
        FB.login(null, {scope: 'email'});
    }

    var onLoginStatusChange = function(session) {
        console.log('Got the user\'s session: ', session);
        if (session.authResponse) {
            homePage.show();
        } else {
            $(".page").hide();
            $(".login").show();
        }
    }
}

var loginPage = new Hangout.LoginPage();