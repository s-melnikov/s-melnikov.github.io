<?php

define('DS', DIRECTORY_SEPARATOR);
define('ROOT', realpath(dirname(__FILE__)) . DS);
define('SYS', ROOT . 'sys' . DS);
define('DEBUG', true);

require SYS . 'core.php';
require SYS . 'jsondb.php';
require SYS . 'jwt.php';

config('url', str_replace(DS, '/', str_replace(realpath($_SERVER['DOCUMENT_ROOT']), '', ROOT)));

config('router', 'index.php');

map(404, function ($code) {
  http_response_code(200);
  return json(['error' => 'path_not_found']);
});

map(['GET'], '/', function() {
  return json([]);
});

map(['POST'], '/auth', function() {
  $response = [];
  $request = request_body();
  return json($request);
  if (!isset($request['email']) || !isset($request['password'])) {
    $response['error'] = 'EMPTY_DATA';
  } else {
    $user = DB::table('.users')->find_one(['email' => $request['email']]);
    if (!$user) {
      $response['error'] = 'USER_NOT_EXISTS';
    } else {
      if ($user['hash'] !== hash('sha256', $user['uid'] . $request['password'])) {
        $response['error'] = 'USER_NOT_EXISTS';
      } else {
        // session('user', $user['uid']);
        $response['status'] = 'USER_AUTHORISED';
        unset($user['hash']);
        $response['user'] = $user;
      }
    }
  }
  return json($response);
});

map(['GET'], '/<collection>', function($params) {
  $table_name = $params['collection'];
  if (!JDB::exists($table_name)) {
    return json(['error' => 'COLLECTION_NOT_EXISTS']);
  }
  $table = JDB::table($table_name);
  return json([ 'result' => $table->find() ]);
});

map(['GET'], '/<collection>/<uid>', function($params) {
  $table_name = $params['collection'];
  $uid = $params['uid'];
  if (!JDB::exists($table_name)) {
    return json(['error' => 'COLLECTION_NOT_EXISTS']);
  }
  $table = JDB::table($table_name);
  if ($item = $table->find_one($uid)) {
    return json([ 'result' => $item ]);
  }
  return json([ 'error' => 'ITEM_NOT_EXISTS' ]);
});

dispatch();