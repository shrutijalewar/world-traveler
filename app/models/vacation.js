'use strict';
var _ = require('lodash'),
  Mongo = require('mongodb'),
  fs = require('fs'),
  path= require('path'),
  cp = require('child_process');

function Vacation(v){
  this.name = v.name;
  this.start = new Date(v.start);
  this.end = new Date(v.end);
  this.coordinates = {lat:parseFloat(v.lat), lng:parseFloat(v.lng)};
 // this.lat = parseFloat(v.lat);
 // this.lng = parseFloat(v.lng);
  this.photos = [];
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

Vacation.findById = function(id, cb){
  var _id = Mongo.ObjectID(id);
  Vacation.collection.findOne({_id:_id}, function(err,obj){
    cb(err, _.create(Vacation.prototype, obj));
  });
};

Vacation.prototype.uploadPhoto = function(files, cb){
  var dir = __dirname + '/../static/img/' + this._id,
      exist = fs.existsSync(dir),
      self = this;

  if(!exist){
    fs.mkdirSync(dir);
  }
  files.photos.forEach(function(photo){
    var ext = path.extname(photo.path),
        rel = '/img/'+ self._id + '/' + self.photos.length + ext,
        abs = dir + '/' + self.photos.length + ext;
    fs.renameSync(photo.path, abs);
    self.photos.push(rel);
  });
  Vacation.collection.save(self, cb);
};

Vacation.prototype.downloadPhoto = function(url, cb){
  var extensions = url.split('.'),
  extension = extensions[extensions.length-1],
  dir = this._id,
  file = this.photos.length + '.' +extension,
  self = this;
  console.log(url, dir, file);

  cp.execFile(__dirname + '/../scripts/download.sh', [url, file, dir], {cwd:__dirname + '/../scripts'}, function(err, stdout, stderr){
    var photo = '/img/' +dir+ '/'+ file;
    self.photos.push(photo);
    Vacation.collection.save(self, cb);
  });
};
module.exports = Vacation;

