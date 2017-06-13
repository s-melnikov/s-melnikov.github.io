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
        redirect(config('url'), null, true);
      }
    }
    $locals['error'] = 'Unknow user or wrong password.';
  }
  print phtml('signin', $locals, false);
});

map('GET', '/logout', function() {
  session('user', null);
  redirect(config('url') . 'signin');
});

map(404, function () {
  print phtml('404');
});

map('GET', '/collections', function() {
  $locals = [];
  print phtml('collections', $locals);
});

map(['GET', 'POST'], '/collection', function() {
  $locals = [
    'collection' => []
  ];
  if (count($_POST)) {
    dd($_POST);
  }
  print phtml('collection', $locals);
});

dispatch();

/*Collection::create(
  '.users',
  [
    'fields' => [
      [
        'name' => 'first_name',
        'title' => 'First Name',
        'type' => 'string',
        'required' => true
      ],
      [
        'name' => 'last_name',
        'title' => 'Last Name',
        'type' => 'string',
        'required' => true
      ],
      [
        'name' => 'email',
        'title' => 'Email Address',
        'type' => 'string',
        'required' => true,
        'uniq' => true
      ],
      [
        'name' => 'username',
        'title' => 'Username',
        'type' => 'string',
        'required' => true,
        'uniq' => true
      ],
      [
        'name' => 'aboutme',
        'title' => 'About Me',
        'type' => 'text'
      ]
    ]
  ]
);*/

/*$col = collection('.users');
$result = $col->save_entry([
  'first_name' => 'Dakota',
  'last_name' => 'Rice',
  'email' => 'dakota.rice@gmai.com',
  'username' => 'dakotarice',
  'aboutme' => 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ipsam sint magni ratione delectus, id laborum ex aut non eius, reiciendis quae beatae at fuga cum dolores dicta nihil! Culpa, totam!'
]);

dd($col->getError());*/