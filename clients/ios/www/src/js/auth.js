//////////////////////////
//
// Authentication
// See "Logging the user in" on https://developers.facebook.com/mobile
//
//////////////////////////

var user = [];

function authUser() {
  FB.Event.subscribe('auth.statusChange', handleStatusChange);
}

function handleStatusChange(session) {
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

//Prompt the user to login and ask for the 'email' permission
function promptLogin() {
    $(".page").hide();
    $(".loading").show();
    FB.login(null, {scope: 'email'});
}

//This will prompt the user to grant you acess to their Facebook Likes
function promptExtendedPermissions() {
  FB.login(function() {
    setAction("The 'user_likes' permission has been granted.", false);
    
    setTimeout('clearAction();', 2000);
    
    document.body.className = 'permissioned';
  }, {scope: 'user_likes'});
}

//See https://developers.facebook.com/docs/reference/rest/auth.revokeAuthorization/
function uninstallApp() {
  FB.api({method: 'auth.revokeAuthorization'},
    function(response) {
     // window.location.reload();
     // To clear the local storage cache and native session, call logout
     logout();
    });
}

//See https://developers.facebook.com/docs/reference/javascript/FB.logout/
function logout() {
  FB.logout(function(response) {
    window.location.reload();
  });
}