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

// jdb_create("uid5994269089254");

/*function microtime_float()
{
    list($usec, $sec) = explode(" ", microtime());
    return $usec . $sec;
}

$time_start = microtime_float();

dd($time_start, microtime(), time());*/


// dd(JDB::exists("collections"));
// dd(JDB::create("test"));
// $result = JDB::table("test")->settings("test");

// $result = JDB::table("test")->insert([
//   "first_name" => "Clara",
//   "last_name" => "Stucke",
//   "email" => "cstucke0@google.es"
// ]);

// $data = file_get_contents('mock_data.json');
// $data = json_decode($data, true);
// $i = 0;
// foreach ($data as $value) {
//   $i += JDB::table("test")->insert($value) ? 1 : 0;
// }
// dd($i);

$result = JDB::table('test')->find([
  'ip_address' => '12.200.4.81'
]);

dd($result);