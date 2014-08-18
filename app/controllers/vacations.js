'use strict';

exports.init = function(req, res){
  res.render('vacations/init');
};
exports.index = function(req, res){
  res.render('vacations/index');
};
exports.create = function(req, res){
  console.log(req.body);
  res.redirect('/vacations');
};
