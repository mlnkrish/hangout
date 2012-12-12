var should = require('should'),
    app = require('../app'),
    request = require('supertest');
  


describe('auth', function(){

  describe('GET /',function(){
    it('should get html', function(done){
      request(app)
      .get('/')
      .expect(200, done);
    })
  });

  describe('GET /users',function(){
    it('should get /users', function(done){
      request(app)
      .post('/users')
      .send({
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
})
      .expect(200,done);
    })
  })

});
