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

require SYS . 'utils.php';
require SYS . 'dispatch.php';
require SYS . 'jdb.php';

spl_autoload_register(function($class) {
  $file = SYS . strtolower($class) . '.php';
  if (!file_exists($file)) {
    throw new RuntimeException(
      "Class '{$class}' not exist.", 500
    );
  }
  require $file;
});

config(parse_ini_file(SYS . 'config.ini'));

map('GET', '/', function() {
  auth_check();
  echo phtml('index', [
    'error' => null
  ]);
});

map(['GET', 'POST'], '/signin', function() {
  $error = null;
  $email = request('email');
  $password = request('password');
  if ($email && $password) {
    if ($user = jdb_select('.users', ['email' => $email])) {
      $user = $user[0];
      if ($user['hash'] ==
        hash('sha256', config('salt') . $password . config('salt'))) {
        session('user', $user);
        redirect(base_url(), null, true);
      }
    }
    $error = 'Unknow user or wrong password.';
  }
  print phtml('signin', [
    'error' => $error
  ], false);
});

map('GET', '/logout', function() {
  session('user', null);
  redirect(base_url('signin'));
});

map(404, function () {
  print phtml('404', [
    'error' => null
  ]);
});

map(['GET', 'POST'], '/collections', function() {
  $error = null;
  $id = request('id');
  $name = request('name');
  $description = request('description');
  if ($id) {
    $result = jdb_select('collections', ['id' => $id]);
    if (count($result)) {
      $error = 'Collection with the identifier ['.$id.'] alredy exists.';
    } else {
      $uid = jdb_insert('collections', [
        'id' => $id,
        'name' => $name,
        'description' => $description,
        'fields' => []
      ]);
      if ($uid) {
        jdb_create('collections/'.$uid);
      }
      redirect(base_url('collections'));
    }
  }
  $collections = jdb_select('collections');
  foreach ($collections as &$collection) {
    $settings = jdb_settings('collections/'.$collection['uid']);
    $collection['updated'] = $settings['updated'];
    $result = jdb_select('.users', $settings['about']);
    $collection['about'] = $result[0]['nickname'];
  }
  print phtml('collections', [
    'error' => $error,
    'id' => $id,
    'name' => $name,
    'description' => $description,
    'collections' => $collections
  ]);
});

map(['GET', 'POST'], '/collection/<uid>/fields', function($params) {
  $error = null;
  $col_uid = $params['uid'];
  if (request('to_delete')) {
    $result = jdb_select('collections', $col_uid);
    jdb_delete('collections', $col_uid);
    jdb_drop('collections/'.$col_uid);
    redirect(base_url('collections', 200, true));
  }
  $col_name = request('name');
  $col_description = request('description');
  if ($col_name) {
    jdb_update('collections', [
      'name' => $col_name,
      'description' => $col_description
    ], $col_uid);
  }
  $collection = jdb_select('collections', $col_uid)[0];
  $field_id = request('field_id');
  $field_name = request('field_name');
  $field_type = request('field_type');
  if ($field_id) {
    $isset = false;
    foreach ($collection['fields'] as $field) {
      if ($field['id'] == $field_id) $isset = true;
    }
    if ($isset) {
      $error = 'Field with identifier ['.$field_id.'] already exists.';
    } else {
      $collection['fields'][] = [
        'name' => $field_name,
        'id' => $field_id,
        'type' => $field_type
      ];
      jdb_update('collections', [
        'fields' => $collection['fields']
      ], $col_uid);
      redirect(base_url('collection/'.$col_uid.'/fields'));
    }
  }
  print phtml('fields', [
    'error' => $error,
    'collection' => $collection,
    'field_id' => $field_id,
    'field_name' => $field_name,
    'field_type' => $field_type
  ]);
});

map('GET', '/content', function() {
  $collections = jdb_select('collections');
  print phtml('content', [
    'error' => null,
    'collections' => $collections,
    'collection' => null,
    'items' => null
  ]);
});

map('GET', '/content/<uid>', function($params) {
  $error = null;
  $uid = $params['uid'];
  $collections = jdb_select('collections');
  $collection = jdb_select('collections', $uid);
  $collection = $collection[0];
  $items = jdb_select('collections/'.$uid);
  print phtml('content', [
    'error' => $error,
    'collections' => $collections,
    'collection' => $collection,
    'items' => $items
  ]);
});

map(['GET', 'POST'], '/content/<uid>/item', function($params) {
  $error = null;
  $uid = $params['uid'];
  $collections = jdb_select('collections');
  $collection = jdb_select_one('collections', $uid);
  print phtml('item', [
    'error' => $error,
    'collections' => $collections,
    'collection' => $collection
  ]);
});

dispatch();