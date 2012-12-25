var FB_CONNECT_SERVICE = 'org.apache.cordova.facebook.Connect';

var TEST_ACCESS_TOKEN = null;

window.setTestAccessToken = function(value){
	TEST_ACCESS_TOKEN = value;
};

window.MockCordova = {	
	_serviceMap : {},

	exec : function(successFunction, failFunction, service, action, args){
		if(service in MockCordova._serviceMap && action in MockCordova._serviceMap[service]){
			callback = MockCordova._serviceMap[service][action];
			callback(successFunction,failFunction,args);
		}
		else
		{
			console.trace();
			console.log('**** NO intercept found ******** service = ' + service + ' action = ' + action + ' args = ' + args);
			successFunction(null);
		}
			
	},

	interceptExec : function(service,action, callback){
		if(service in MockCordova._serviceMap){
			if (action in MockCordova._serviceMap[service]){
				MockCordova._serviceMap[service][action] = callback;
			}
			else
			{
				MockCordova._serviceMap[service][action] = callback;
			}
		}
		else
		{
			MockCordova._serviceMap[service] = {};
			MockCordova._serviceMap[service][action] = callback;
		}
	}

}

// MockCordova.interceptExec(FB_CONNECT_SERVICE,'login',function(successFunction,failFunction){
// 	if (successFunction)
// 		successFunction({ authResponse: { expiresIn: 100000 } });
// });

MockCordova.interceptExec(FB_CONNECT_SERVICE,'getLoginStatus',function(successFunction,failFunction){
	if (successFunction)
		successFunction({"authResponse":{"accessToken": TEST_ACCESS_TOKEN,"session_key":true,"expiresIn":"5128724505","userId":"null","sig":"..."},"status":"connected"});
});


MockCordova.interceptExec(FB_CONNECT_SERVICE,'init',function(successFunction,failFunction){

	var authResponse = localStorage.getItem('cdv_fb_session');
	if(authResponse)
	{
		successFunction(authResponse);
		return;
	}

	var url = 'https://www.facebook.com/dialog/oauth?client_id='+ window.TEST_APP_ID +'&redirect_uri=http://localhost:3000/facebook_response.html&scope=email&response_type=token';
	var accessToken = window.showModalDialog(url,'name','height=255,width=500,toolbar=no,directories=no,status=no,menubar=no,scrollbars=no,resizable=no ,modal=yes');
	console.log('data = ' + TEST_ACCESS_TOKEN);
	if (successFunction)
	{
		var authResponse = {"accessToken":TEST_ACCESS_TOKEN,"session_key":true,"expiresIn":"5128814057","sig":"...","expirationTime":6485155655118};
		localStorage.setItem('cdv_fb_session', JSON.stringify(authResponse));
		successFunction(authResponse);
	}
});


function desktop_setup(appId){
	window.cordova = window.MockCordova;
	window.TEST_APP_ID = appId;
}
