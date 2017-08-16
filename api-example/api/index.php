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

config('url', str_replace(DS, '/', str_replace(realpath($_SERVER['DOCUMENT_ROOT']), '', ROOT)));

// create_collection("collections", "");

// jdb_create("collections");

/*jdb_insert('collections', [
  'name' => 'employees',
  'title' => 'Employees',
  'fields' => [
    [
      'name' => 'first_name',
      'title' => 'First name',
      'type' => 'text',
      'default' => '',
      'required' => true
    ],
    [
      'name' => 'last_name',
      'title' => 'Last name',
      'type' => 'text',
      'default' => '',
      'required' => true
    ],
    [
      'name' => 'email',
      'title' => 'Email',
      'type' => 'text',
      'default' => '',
      'required' => true
    ],
    [
      'name' => 'gender',
      'title' => 'Gender',
      'type' => 'select',
      'default' => '',
      'options' => ['male', 'femail']
    ]
  ]
]);*/
