var EventHandler = function(){
    var eventList = {};

    this.on = function(event,handler){
        if(!eventList.hasOwnProperty(event)){
            eventList[event] = [];
        }
        eventList[event].push(handler);
    }

    this.fire = function(event,args){
         if(eventList.hasOwnProperty(event)){
           for (var i = 0; i < eventList[event].length; i++) {
               var toCall = eventList[event][i];
               toCall.call(toCall,args);
           }
         }
    }
}

$E = new EventHandler();