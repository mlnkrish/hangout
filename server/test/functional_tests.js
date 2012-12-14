var should = require('should'),
    app = require('../app'),
    models = require('../models/models.js')
    request = require('supertest');
  

var TEST_USER = {
   "id": "11265765672",
   "name": "Venkatesh CM",
   "first_name": "Venkatesh",
   "last_name": "CM",
   "link": "https://www.facebook.com/venkatesh.cm",
   "username": "venkatesh.cm",
   "birthday": "01/01/1990",
   "work": [
      {
         "employer": {
            "id": "108526095838792",
            "name": "ThoughtWorks"
         }
      }
   ],
   "gender": "male",
   "timezone": 5.5,
   "locale": "en_US",
   "verified": true,
   "updated_time": "2012-11-07T09:08:57+0000",
   "friends" :[
      {
         "name": "Rajiv Mathew",
         "id": "503931901"
      },
      {
         "name": "Krishnan Mln",
         "id": "100000160408296"
      },
      {
         "name": "Chethan Venkatappa",
         "id": "100001030770033"
      }]
};

var TEST_EVENT = {
   "id": "11265765672",
   "event_name": "Team outing",
   "location" : "bangalore",
   "updated_time": "2012-11-07T09:08:57+0000",
   "invited_friends" :[
      {
         "name": "Rajiv Mathew",
         "id": "503931901"
      },
      {
         "name": "Krishnan Mln",
         "id": "100000160408296"
      },
      {
         "name": "Chethan Venkatappa",
         "id": "100001030770033"
      }]
};



Object.prototype.equals = function(x)
{
  var p;
  for(p in this) {
      if(typeof(x[p])=='undefined') {
        console.log("1. type(x[" + p + "]) = " + x['id']+ " and this[" + p + "]=" + this[p] + " and x = " + x);
        return false;
      }
  }

  for(p in this) {
      if (this[p]) {
          switch(typeof(this[p])) {
              case 'object':
                  if (!this[p].equals(x[p])) { 
                    console.log("2. x[ " + p + "] = " + x[p] + " and this[" + p + "] = " + this[p]);
                    return false; 
                  } 
                  break;
              case 'function':
                  if (typeof(x[p])=='undefined' ||
                      (p != 'equals' && this[p].toString() != x[p].toString()))
                  {
                    console.log("3. x[ " + p + "] = undefined or p!= 'equals' and this[" + p + "].toString() !=" + this[p].toString() + " and x[" + p + "].toString = " + x[p].toString());
                      return false;
                  }
                  break;
              default:
                  if (this[p] != x[p]) { 
                    console.log("4. x[ " + p + "] = " + x[p] + " and this[" + p + "] = " + this[p]);
                    return false; 
                  }
          }
      } else {
          if (x[p])
          {
              console.log("5. x[ " + p + "] = " + x[p]);
              return false;
          }
      }
  }

  for(p in x) {
      if(typeof(this[p])=='undefined') {
        console.log("6. type(this[+ " + p + "]) = is undefined");
        return false;
      }
  }

  return true;
}

describe('API', function(){

  beforeEach(function(done){
    models.clearDb(done);
  });

  describe('/users',function(){

    it('should get user', function(done){
      models.User.save(TEST_USER,function(err){
        if(err) throw done(err);
      });
      request(app)
      .get('/users/'+TEST_USER['id'])
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function(err,res){
          if(err) done(err);
          var obj = JSON.parse(res.body);
          if(TEST_USER.equals(obj)) done();
          else done('error');
      });
    });
  });

  describe('POST /users',function(){

    it('should create user', function(done){
      request(app)
      .post('/users')
      .send(TEST_USER)
      .expect(200,done);
    });
  });


  describe('/events',function(){

    it('should get events', function(done){
      models.Event.save(TEST_EVENT,function(err){
        if(err) throw done(err);
      });
      request(app)
      .get('/events/'+TEST_EVENT['id'])
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function(err,res){
          if(err) done(err);
          var obj = JSON.parse(res.body);
          if(TEST_EVENT.equals(obj)) done();
          else done('error');
      });
    });
  });

  describe('POST /events',function(){

    it('should create event', function(done){
      request(app)
      .post('/events')
      .send(TEST_EVENT)
      .expect(200,done);
    });
  });





});
