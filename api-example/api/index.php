<?php

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

config("url", "/git/s-melnikov/api-example/api/");

// map(["GET", "POST"], "/", function() {
//   print json(response());
// });

// dispatch();

print "Table [emploees] " . (jdb_exists("employees") ? "" : "not") . " exists";
