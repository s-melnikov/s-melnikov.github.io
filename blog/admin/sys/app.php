<?php

JDB::configure(STORAGE);

on('GET', '/', function() {
  redirect('index.php/login', 401, !authenticated());
  render('index');
});

on('GET', '/login', function() {
  print 'Login!';
});

error(404, function () {
  print "Oops!\n";
});


function authenticated() {
  return false;
}

?>