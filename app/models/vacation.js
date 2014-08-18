'use strict';

function Vacation(v){
  this.name = v.name;
  this.start = new Date(v.start);
  this.end = new Date(v.end);
  this.coordinates = {lat:parseFloat(v.lat), lng:parseFloat(v.lng)};
 // this.lat = parseFloat(v.lat);
 // this.lng = parseFloat(v.lng);
  this.photo = [];
}

Object.defineProperty(Vacation, 'collection', {
  get: function(){return global.mongodb.collection('vacations');}
});

Vacation.create = function(v, cb){
  var b = new Vacation (v);
  Vacation.collection.save(b, cb);
};
Vacation.all = function(cb){
  Vacation.collection.find().toArray(cb);
};


module.exports = Vacation;

