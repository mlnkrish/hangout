if(!Hangout) Hangout={};

Hangout.LoginPage = function(){
    this.init = function(){
        $("#loginButton").click(promptLogin);
        FB.Event.subscribe('auth.statusChange', onLoginStatusChange);
    }

    this.loginSuccess = function(){
        
    }

    this.loginFail = function(){
        console.log("login failed, showing the login page.")
        $.mobile.changePage($("#login-page"),{transition:"slide"});
    }

    var promptLogin = function () {
        FB.login(null, {scope: 'email'});
    }

    var onLoginStatusChange = function(session) {
        console.log('Got the user\'s session: ', session);
        if (session.authResponse) {
            homePage.show();
        } else {
           $.mobile.changePage($("#login-page"),{transition:"slide"});
        }
    }
}

var loginPage = new Hangout.LoginPage();