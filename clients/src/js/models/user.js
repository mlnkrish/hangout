if(!Hangout) var Hangout={};

Hangout.User = function() {
    var self = this;


    var _u = {id:null};
    

    this.id = function(id){ if(!!id) _u.id=id; return _u.id; } ;
    this.name = function(name){ if(!!name) _u.name=name; return _u.name; } ;
    this.email = function(email){ if(!!email) _u.email=email; return _u.email; } ;
    this.link = function(link){ if(!!link) _u.link=link; return _u.link; } ;
    this.username = function(username){ if(!!username) _u.username=username; return _u.username; } ;
    this.gender = function(gender){ if(!!gender) _u.gender=gender; return _u.gender; } ;
    this.timezone = function(timezone){ if(!!timezone) _u.timezone=timezone; return _u.timezone; } ;
    this.friends = function(friends){ if(!!friends) _u.friends=friends; return _u.friends; } ;

    this.hasBasicData = function(){
        return self.id() != null;
    }

    this.pictureUrl = function(){
        return "https://graph.facebook.com/me/picture?type=normal&access.token="+FB.getAccessToken();
    }

    this.save = function() {
        if(self.hasBasicData()){
            $.ajax({
                type: "POST",
                url: SERVER_URL+"users",
                beforeSend: function(xhr) {
                    xhr.setRequestHeader("fb_token", FB.getAccessToken());
                },
                data: _u,
                error:function(e){
                    alert("post failed"+JSON.stringify(e));
                    //TODO:ERROR HANDLING
                }
            });
        }
    }

    this.toString = function() {
        console.log("**->"+_u.id);
        console.log("**->"+_u.name);
        console.log("**->"+_u.email);
        console.log("**->"+_u.link);
        console.log("**->"+_u.username);
        console.log("**->"+_u.gender);
        console.log("**->"+_u.timezone);
        console.log("**->"+_u.friends);
    }
}

var $user = new Hangout.User();