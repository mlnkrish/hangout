var FB_CONNECT_SERVICE = 'org.apache.cordova.facebook.Connect';

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

MockCordova.interceptExec(FB_CONNECT_SERVICE,'login',function(successFunction,failFunction){
	if (successFunction)
		successFunction({ authResponse: { expiresIn: 100000 } });
});

MockCordova.interceptExec(FB_CONNECT_SERVICE,'getLoginStatus',function(successFunction,failFunction){
	if (successFunction)
		successFunction({"authResponse":{"accessToken":"AAADmOOWcyLYBAJrtazy4tXZCmOZCq1a6Mjs2qZAOwneiCfInsYmXdIGZCZAj2pyOOY0WoFV1vxdlEasYp5DSC1IZBwrLyv5BvmjYmxq7enKQZDZD","session_key":true,"expiresIn":"5128724505","userId":"null","sig":"..."},"status":"connected"});
});

MockCordova.interceptExec(FB_CONNECT_SERVICE,'init',function(successFunction,failFunction){
	if (successFunction)
	{
		var authResponse = {"accessToken":"AAADmOOWcyLYBAJrtazy4tXZCmOZCq1a6Mjs2qZAOwneiCfInsYmXdIGZCZAj2pyOOY0WoFV1vxdlEasYp5DSC1IZBwrLyv5BvmjYmxq7enKQZDZD","session_key":true,"expiresIn":"5128814057","userId":"1126143492","sig":"...","expirationTime":6485155655118};
		localStorage.setItem('cdv_fb_session', JSON.stringify(authResponse));
		successFunction(authResponse);
	}
		
});


function desktop_setup(){
	window.cordova = window.MockCordova;
}
