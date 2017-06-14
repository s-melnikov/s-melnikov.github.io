<?php

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
  echo phtml('index', []);
});

map(['GET', 'POST'], '/signin', function() {
  $locals = ['errors' => []];
  $locals = array_marge($locals, from($_POST, ['email', 'password']));
  if ($locals['email'] && $locals['password']) {
    if ($result = jdb_select('.users', ['email' => $locals['email']])) {
      $user = $result[0];
      if ($user['hash'] ==
        hash('sha256', config('salt') . $locals['password'] . config('salt'))) {
        session('user', $user);
        redirect(base_url(), null, true);
      }
    }
    $locals['error'] = 'Unknow user or wrong password.';
  }
  print phtml('signin', $locals, false);
});

map('GET', '/logout', function() {
  session('user', null);
  redirect(base_url('signin'));
});

map(404, function () {
  print phtml('404');
});

map(['GET', 'POST'], '/collections', function() {
  $error = null;
  $id = params('id');
  $name = params('name');
  $description = params('description');
  if ($id) {
    if (count(jdb_select('collections', ['id' => $id]))) {
      $error = 'Collection with the identifier ['.$id.'] alredy exists.';
    } else {
      $uid = jdb_insert('collections', [
        'id' => $id,
        'name' => $name,
        'description' => $description,
        'fields' => []
      ]);
      if ($uid) {
        jdb_create('collections/'.$id);
      }
      redirect(base_url('collections'));
    }
  }
  $collections = jdb_select('collections');
  foreach ($collections as &$collection) {
    $collection['updated'] = jdb_settings('collections/'.$collection['id'], 'updated');
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
  $uid = $params['uid'];
  $result = jdb_select('collections', $uid);
  $collection = $result[0];
  $name = params('name');
  $id = params('id');
  $type = params('type');
  if ($id) {
    $isset = false;
    foreach ($collection['fields'] as $field) {
      if ($field['id'] == $id) $isset = true;
    }
    if ($isset) {
      $error = 'Field with identifier ['.$id.'] already exists.';
    } else {
      $collections['fields'][] = [
        'name' => $name,
        'id' => $id,
        'description' => $description
      ];
      jdb_update('collections', [
        'fields' => $collections['fields']
      ], $uid);
    }
  }
  print phtml('fields', [
    'error' => $error,
    'collection' => $collection
  ]);
});

dispatch();