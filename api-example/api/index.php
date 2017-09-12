<?php

// set default timezone
date_default_timezone_set('UTC');

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

session_start();

define('DS', DIRECTORY_SEPARATOR);
define('ROOT', realpath(dirname(__FILE__)) . DS);
define('SYS', ROOT . 'sys' . DS);

define('DEBUG', true);
define('DB_STORAGE', 'storage' . DIRECTORY_SEPARATOR);

require SYS . 'functions.php';
require SYS . 'dispatch.php';
require SYS . 'db.php';
require SYS . 'collections.php';

config('url', str_replace(DS, '/',
  str_replace(realpath($_SERVER['DOCUMENT_ROOT']), '', ROOT)));

map('GET', '/auth/', function() {
  $response = [];
  if (session('user')) {
    $uid = session('user');
    $user = DB::table('.users')->find_one($uid);
    if (!$user) {
      $response['status'] = 'USER_NOT_EXISTS';
    } else {
      $response['status'] = 'USER_AUTHORISED';
      unset($user['hash']);
      $response['user'] = $user;
    }
  } else {
    $response['status'] = 'USER_NOT_AUTHORISED';
  }
  json($response);
});

map('POST', '/auth/', function() {
  $response = [];
  $request = request_body();
  if (session('user')) {
    session('user', null);
  }
  if (!isset($request['email']) || !isset($request['password'])) {
    $response['status'] = 'EMPTY_DATA';
  } else {
    $user = DB::table('.users')->find_one(['email' => $request['email']]);
    if (!$user) {
      $response['status'] = 'USER_NOT_EXISTS';
    } else {
      if ($user['hash'] !== hash('sha256', $user['uid'] . $request['password'])) {
        $response['status'] = 'USER_NOT_EXISTS';
      } else {
        session('user', $user['uid']);
        $response['status'] = 'USER_AUTHORISED';
        unset($user['hash']);
        $response['user'] = $user;
      }
    }
  }
  json($response);
});

map('GET', '/collection/', function() {
  $response = [];
  $collections = DB::table('collections')->find();
  foreach ($collections as &$collection) {
    $user = DB::table('.users')->find_one($collection['about']);
    if ($user) {
      unset($user['hash']);
      $collection['about'] = $user;
    } else {
      $collection['about'] = [];
    }
  }
  $response['collections'] = $collections;
  json($response);
});

map('POST', '/collections/', function() {
  $response = [];
  $table_collections = DB::table('collections');
  $item = request_body();
  if ($table_collections->find_one(['name' => $item['name']])) {
    $response['status'] = 'COLLECTION_WITH_SAME_NAME_ALREADY_EXISTS';
  } else {
    $item['updated'] = date('Y-m-d H:i:s');
    $item['about'] = DB::table('.users')->find_one()['uid'];
    $item['fields'] = [];
    $uid = $table_collections->push($item);
    $response['uid'] = $uid;
  }
  json($response);
});

map('GET', '/collection/<id>', function($params) {
  $response = [];
  $collection = DB::table('collections')->find_one($params['id']);
  $user = DB::table('.users')->find_one($collection['about']);
  if ($user) {
    unset($user['hash']);
    $collection['about'] = $user;
  } else {
    $collection['about'] = [];
  }
  $response['collection'] = $collection;
  json($response);
});

dispatch();