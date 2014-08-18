/* jshint expr:true */
/* global describe, it, before, beforeEach */

'use strict';

var expect    = require('chai').expect,
    Vacation    = require('../../app/models/vacation'),
    dbConnect = require('../../app/lib/mongodb'),
    Mongo     = require('mongodb'),
    cp        = require('child_process'),
    db        = 'vacation-test';

describe('Vacation', function(){
  before(function(done){
    dbConnect(db, function(){
      done();
    });
  });

  beforeEach(function(done){
    cp.execFile(__dirname + '/../scripts/clean-db.sh', [db], {cwd:__dirname + '/../scripts'}, function(err, stdout, stderr){
      done();
    });
  });

  describe('constructor', function(){
    it('should create a new Vacation object', function(){
      var b = {name: 'Barcelona',start:'8/6/2014', end:'8/28/2014', coordinates:{lat:'41.38506390', lng:'2.17340350'}, photos:[]},
       v = new Vacation(b);
      expect(v).to.be.instanceof(Vacation);
    });
  });
  describe('.create', function(){
    it('should create a new vacation in the database', function(done){
      var b = {name: 'Barcelona',start:'8/6/2014', end:'8/28/2014', coordinates:{lat:'41.38506390', lng:'2.17340350'}, photos:[]};
      Vacation.create(b, function(err, vacation){
        expect(vacation._id).to.be.instanceof(Mongo.ObjectID);
        done();
      });
    });
  });
});
describe('.all', function(){
  it('should get all vacations', function(done){
    Vacation.all(function(err, vacations){
      expect(vacations).to.have.length(3);
      done();
    });
  });
});

