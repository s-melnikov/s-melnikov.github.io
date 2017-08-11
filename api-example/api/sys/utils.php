<?php

function dd() {
  echo '<pre>';
  call_user_func_array('var_dump', func_get_args());
  exit();
}

function check_auth() {
  if (!session('user')) {
    redirect(config('url') . 'signin', 302, true);
  }
}

function request($name = null, $default = null) {

  static $source = null;

  if (!$source) {
    $source = array_merge($_GET, $_POST);
    if (get_magic_quotes_gpc()) {
      array_walk_recursive($source, function(&$value) {
        $value = stripslashes($value);
      });
    }
  }

  if (is_string($name))
    return (isset($source[$name]) ? $source[$name] : $default);

  if (is_array($name)) {
    $result = [];
    foreach ($name as $value) {
      $result[$value] = params($value, $default);
    }
    return $result;
  }
}