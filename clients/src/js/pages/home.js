if(!Hangout) Hangout={};

Hangout.HomePage = function(){
    this.init = function() {

    }

    this.show = function() {
        FB.api("/me",function(response) {
            if (!response.error) {
                console.log("Got the user\'s info: "+JSON.stringify(response));
                $user.id(response.id);
                $user.name(response.name);
                $user.email(response.email);
                $user.link(response.link);
                $user.username(response.username);
                $user.gender(response.gender);
                $user.timezone(response.timezone);
                $user.save();
                render();
            } else{
//                alert("error.HomePage.Show.getMe");
                //TODO:ERROR HANDLING
            }
        });
        FB.api("/me/friends",{fields:["name","id","picture"]},function(response){
            if(!response.error){
                console.log("Got the user's friends info: ******************"+JSON.stringify(response));
                $user.friends(response.data);
                $user.toString();
                $user.save();
            } else{
                //alert("error.HomePage.Show.getMeFriends");
                //TODO:ERROR HANDLING
            }
        })
        render();
    }

    var render = function(){
        if($user.hasBasicData()){
            $.mobile.changePage($("#home-page"),{transition:"slide"});
        }
    }

}

var homePage = new Hangout.HomePage();

