<?php

session_start();

define('ROOT', realpath(dirname(__FILE__)) . '/');
define('SYS', ROOT . 'sys/');

require SYS . 'dispatch.php';
require SYS . 'helpers.php';
require SYS . 'jsondb.php';

config(require SYS . 'configs.php');

JDB::config([ 'path' => '../../storage/' ]);

# dev
# JDB::table('portfolio')->alter('add', ['test3', 'test4']);
# JDB::table('portfolio')->alter('drop', ['test3', 'test4']);

map('GET', '/', function() {
  if (session('user')) {
    JDB::config([ 'path' => 'sys/db/' ]);

    $id = session('user')['id'];
    $user = JDB::table('users')->select(['id', 'login', 'name'], [ 'where' => [ 'id' =>  $id]]);

    if ($user[0]) {
      response('user', $user[0]);
    }    
  }
});

map('POST', '/auth', function() {
  JDB::config([ 'path' => 'sys/db/' ]);

  $login = trim(params('login'));
  $password = trim(params('password'));

  if (!$login) {
    set_error('empty login field!');
  } else if (!$password) {
    set_error('empty password field');
  } else {
    $user = JDB::table('users')->select('*', [ 'where' => [ 'login' =>  $login]]);
    if (!$user[0]) {
      set_error('not correct login or password');
    } else {
      $user = $user[0];
      $hash = sha1(sha1(config('salt')) . sha1($password));
      if ($user['hash'] !== $hash) {
        set_error('not correct login or password');
      } else {
        session('user', [ 'id' => $user['id'] ]);
        response('user', [
          'id' => $user['id'],
          'login' => $user['login'],
          'name' => $user['name']
        ]);
      }
    }
  }  
});

map('GET', '/logout', function() {
  session('user', null);
});

map('GET', '/logout', function() {
  session('user', null);
});

map('GET', '/portfolio/', function() {  
  $portfolio = JDB::table('portfolio')->select('*');
  response('response', $portfolio);  
});

map('GET', '/portfolio/<id>', function($params) {
  $portfolio = JDB::table('portfolio')->select('*', ['where' => ['id' => $params['id']]]);  
  response('response', $portfolio[0]);  
});

map('POST', '/portfolio/', function() {  
  $record = json_decode(file_get_contents('php://input'), true);
  $portfolio = JDB::table('portfolio');
  if (!$portfolio->insert($record)) set_error(JDB::status(true));
  else response('response', ['last_insert_id' => $portfolio->last_insert_id()]);
});

map('POST', '/portfolio/<id>', function($params) {
  $record = json_decode(file_get_contents('php://input'), true);
  $portfolio = JDB::table('portfolio');
  if (!$record) {
    $result = $portfolio->delete(['id' => $params['id']]);
  } else {
    $result = $portfolio->update($record, ['id' => $params['id']]);
  }  
  if (!$result) set_error(JDB::status(true));
});

map(function() {
  response('message', 'unknow path');
});

dispatch();

json(response('*'));