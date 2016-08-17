var app = require('../app');
var request = require("request");
var supertest = require("supertest");
// var base_url = "http://localhost:7000/";
// var base_url = "https://warm-river-72899.herokuapp.com/";


describe("Express Server API", function () {
  describe('should return users json on get /users', function() {
    it("returns status code 200", function (done) {
      supertest(app)
        .get('/users')
        .expect('Content-Type', /json/)
        .expect(200, done);
    });

    it("returns a correct json format", function (done) {
      supertest(app)
        .get('/users')
        .expect({
          name: 'Christopher Ong',
          job: 'Web Development Immersive (WDI 4) Student',
          age: 56,
          maritalStatus: 'married',
          hobby: ['play jigsaw puzzles',
                  'reading',
                  'listen to music',
                  'singing',
                  'jogging',
                  'basketball'],
          email: 'chrisongts@gmail.com',
          mobile: '+65 9822 3551',
          school: 'General Assembly (GA)',
          schoolAbbr: 'GA'
        }, done);
    });

    it("returns status code 404", function (done) {
      supertest(app)
        .get('/users/about')
        .expect(404, done);
    });

  });
});
