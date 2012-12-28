var should = require('should'),
    app = require('../app'),
    models = require('../models/models.js')
    request = require('supertest');

require('./lib.js');  


describe('API', function(){

  beforeEach(function(done){
    models.clearDb(done);
  });

  describe('/users',function(){

    test_user = function(){
               return {
                         "id": "11265765672",
                         "name": "Venkatesh CM",
                         "link": "https://www.facebook.com/venkatesh.cm",
                         "username": "venkatesh.cm",
                         "gender": "male",
                         "timezone": 5.5,
                         "friends" :[
                            {
                               "name": "Krishnan Mln",
                               "id": "100000160408296"
                            }]
                      };

    };

    it('should get user', function(done){
      var test_function = function(){
        request(app)
            .get('/users/'+test_user()['id'])
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function(err,res){
                if(err) done(err);
                var obj = res.body;
                if(test_user().equals(obj)) done();
                else done('error');
            })
          };

      models.User.save(test_user())
      .then(test_function,function(err){throw done(err);});
    });
  
    it('should create user', function(done){
      request(app)
      .post('/users')
      .send(test_user())
      .expect(200)
      .end(function(err,res){
          if(err) done(err);
          var obj = res.body;
          if(test_user().equals(obj)) done();
          else done('error');
      });
    });

   });


  describe('/events',function(){


    test_event = function(){
              return {
                 "event_name": "Team outing",
                 "location" : "bangalore",
                 "created_by" : "11265765672",
                 "event_date_time" : "2013/01/20 10:10 PM",
                 "updated_time": "2012-11-07T09:08:57+0000",
                 "invited_friends" :[
                    {
                       "name": "Krishnan Mln",
                       "id": "100000160408296"
                    }
                    ]
              };           
    };

    test_event_with_comments = function(){
              return {
                 "event_name": "Team outing",
                 "location" : "bangalore",
                 "created_by" : "11265765672",
                 "event_date_time" : "2013/01/20 10:10 PM",
                 "updated_time": "2012-11-07T09:08:57+0000",
                 "invited_friends" :[
                    {
                       "name": "Krishnan Mln",
                       "id": "100000160408296"
                    }
                    ],
                  "comments": [
                              {
                             "comment": "already added comment!!!",
                             "created_by" : "11265765672",
                             "created_date_time" : "2013/01/20 10:10 PM"
                          }
                  ]
              };
    };


    test_comment = function(){
              return {
                 "comment": "Lets go !!!",
                 "created_by" : "11265765672",
                 "created_date_time" : "2013/01/20 10:10 PM"
              };           
    };



    it('should get events', function(done){

      var anEvent = test_event();
      models.Event._save_given_id(1,anEvent)
                  .then(function(){
                      request(app)
                      .get('/users/' + anEvent['created_by'] + '/events/'+anEvent['id'])
                      .expect('Content-Type', /json/)
                      .expect(200)
                      .end(function(err,res){
                          if(err) done(err);
                          var obj = res.body;
                          anEvent['id'] = 1;
                          if(anEvent.equals(obj)) done();
                          else done('error');
                      });            
                  })
                  .fail(function(err){
                    throw done(err);            
                  });
    });
  
    it('should create event', function(done){

      var prev_event_count = 10;
      var anEvent = test_event();
      models.Event._set_event_count(prev_event_count)
                  .then(function(){
                      request(app)
                        .post('/users/' + anEvent['created_by'] + '/events')
                        .expect('Content-Type', /json/)
                        .send(anEvent)
                        .expect(200)
                        .end(function(err,res){
                            if(err) done(err);
                            var obj = res.body;
                            anEvent['id'] = prev_event_count + 1;
                            if(anEvent.equals(obj)) done();
                            else done('error');
                        });
                      })
                  .fail(function(err){
                    throw done(err);            
                  });
    });

    it('should update event', function(done){

      var prev_event_count = 10;
      var anEvent = test_event();
      anEvent['id'] = 2;
      models.Event._set_event_count(prev_event_count)
                  .then(function(){
                      request(app)
                        .post('/users/' + anEvent['created_by'] + '/events')
                        .expect('Content-Type', /json/)
                        .send(anEvent)
                        .expect(200)
                        .end(function(err,res){
                            if(err) done(err);
                            var obj = res.body;
                            if(anEvent.equals(obj)) done();
                            else done('error');
                        });
                      })
                  .fail(function(err){
                    throw done(err);            
                  });

    });

    it('should get user invited event', function(done){

      var anEvent = test_event();
      models.Event._save_given_id(1,anEvent)
                  .then(function(){
                          request(app)
                            .get('/users/' + anEvent['invited_friends'][0]['id'] + "/events")
                            .expect('Content-Type', /json/)
                            .expect(200)
                            .end(function(err,res){
                                if(err) done(err);
                                var obj = res.body[0];
                                if(anEvent.equals(obj)) done();
                                else done('error');
                            });
                          })
                  .fail(function(err){
                    throw done(err);            
                  });

    });

    it('should create comment', function(done){
      var eventId = 1
      var anComment = test_comment()
      var anEvent = test_event();
      models.Event._save_given_id(eventId,anEvent)
                  .then(function(){
                        request(app)
                          .post('/users/' + anEvent['created_by'] + '/events/' +  eventId + '/comments')
                          .expect('Content-Type', /json/)
                          .send(anComment)
                          .expect(200)
                          .end(function(err,res){
                              if(err) done(err);
                              var obj = res.body['comments'][0];
                              if(!anComment.equals(obj)) return done('error');
                              done();
                          });
                        })
                  .fail(function(err){
                    throw done(err);            
                  });

    });


    it('should uppend comment', function(done){
      var eventId = 1
      var anComment = test_comment()
      var anEvent = test_event_with_comments();
      models.Event._save_given_id(eventId,anEvent)
                  .then(function(){
                        request(app)
                          .post('/users/' + anEvent['created_by'] + '/events/' +  eventId + '/comments')
                          .expect('Content-Type', /json/)
                          .send(anComment)
                          .expect(200)
                          .end(function(err,res){
                              if(err) done(err);
                              var obj = res.body;
                              if(obj['comments'].length != 2) return done('wrong number of comments');
                              if(!anComment.equals(obj['comments'][1])) return done('error');
                              done();
                          });
                        })
                  .fail(function(err){
                    throw done(err);            
                  });

    });

  });

});
