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
define('JDB_STORAGE', 'storage' . DIRECTORY_SEPARATOR);

require SYS . 'functions.php';
require SYS . 'dispatch.php';
require SYS . 'jdb.php';
require SYS . 'collections.php';

config('url', str_replace(DS, '/',
  str_replace(realpath($_SERVER['DOCUMENT_ROOT']), '', ROOT)));

map('GET', '/collections/', function() {
  $data = [];
  $collections = JDB::table('collections')->find();
  foreach ($collections as &$collection) {
    $user = JDB::table('.users')->find_one($collection['about']);
    unset($user['hash']);
    $collection['about'] = $user;
  }
  $data['collections'] = $collections;
  json($data);
});

dispatch();

