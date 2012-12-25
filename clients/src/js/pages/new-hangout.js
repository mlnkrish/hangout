if(!Hangout) Hangout={};

Hangout.NewHangoutPage = function(){
    this.init = function(){
        $("#edatetime").mobiscroll().datetime({
            dateOrder: 'ddmmyy',
            dateFormat: 'dd/mm/yy'
        });
    }

}


var newHangoutPage = new Hangout.NewHangoutPage();