<?php

define('DS', DIRECTORY_SEPARATOR);
define('ROOT', realpath(dirname(__FILE__)) . DS);
define('SYS', ROOT . 'sys' . DS);
define('DEBUG', true);

require SYS . 'core.php';
require SYS . 'jsondb.php';
require SYS . 'jwt.php';

config('secret', 'd02e614988d6169b555fe517176a80e271b2691307eebf6a90848a54768a2c36');

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
  if (!isset($request['email']) || !isset($request['password'])) {
    $response['error'] = 'EMPTY_DATA';
  } else {
    $user = JDB::table('users')->find_one(['email' => $request['email']]);
    if (!$user) {
      $response['error'] = 'USER_NOT_EXISTS';
    } else {
      if ($user['hash'] !== hash('sha256', $user['salt'] . $request['password'])) {
        $response['error'] = 'USER_NOT_EXISTS';
      } else {
        $payload = json_encode([
          'first_name' => $user['first_name'],
          'last_name' => $user['last_name'],
          'status' => $user['status'],
          'uid' => $user['uid'],
          'expired' => time() + (24 * 60 * 60)
        ]);
        $response['token'] = JWT::encode($payload, config('secret'));
        $response['status'] = 'USER_AUTHORISED';
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