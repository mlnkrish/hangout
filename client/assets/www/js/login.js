if(!Hangout) var Hangout={};

Hangout.Login = function(){
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
            FB.api('/me',{fields: 'name, picture'},function(response) {

                  if (!response.error) {
                    user = response;
                    console.log('Got the user\'s name and picture: ');
                    console.log(JSON.stringify(response));

                    //Update display of user name and picture
                    $(".page").hide();
                    $(".home").show();
                    $("#my-name").html(user.name)
                    $("#my-picture").attr("src",user.picture.data.url)
                  }
                });
        } else {
            $(".page").hide();
            $(".login").show();
        }
    }
}

var login = new Hangout.Login();