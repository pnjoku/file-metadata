var supertest = require("supertest")
var should = require("should")

// This agent refers to PORT where program is runninng.

var server = supertest.agent("https://file-metadata-pnjoku.c9users.io")

// UNIT test begin

describe("Unit test",function(){

  // should return home page

  it("should return home page",function(done){

    server
    .get("/")
    .expect("Content-type",/json/)
    .expect(200)
    .end(function(err,res){
      res.status.should.equal(200)
      done()
    })
  })

})