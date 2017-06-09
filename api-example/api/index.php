<?php

define('DS', DIRECTORY_SEPARATOR);
define('ROOT', realpath(dirname(__FILE__)) . DS);
define('SYS', ROOT . 'sys' . DS);

require SYS . 'utils.php';

spl_autoload_register(function($class) {
  $file = SYS . strtolower($class) . '.php';
  if (!file_exists($file)) {
    throw new RuntimeException(
      "Class '{$class}' not exist.", 500
    );
  }
  require $file;
});

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

$col = collection('.users');
$result = $col->save_entry([
  'first_name' => 'Dakota',
  'last_name' => 'Rice',
  'email' => 'dakota.rice@gmai.com',
  'username' => 'dakotarice',
  'aboutme' => 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ipsam sint magni ratione delectus, id laborum ex aut non eius, reiciendis quae beatae at fuga cum dolores dicta nihil! Culpa, totam!'
]);

dd($col->getError());