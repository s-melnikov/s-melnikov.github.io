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

function request_body() {

  static $content = null;

  if ($content)
    return $content;

  $content_type = isset($_SERVER['HTTP_CONTENT_TYPE']) ?
    $_SERVER['HTTP_CONTENT_TYPE'] :
    $_SERVER['CONTENT_TYPE'];

  $content = file_get_contents('php://input');
  $content_type = preg_split('/ ?; ?/', $content_type);

  if ($content_type[0] == 'application/json')
    $content = json_decode($content, true);
  else if ($content_type[0] == 'application/x-www-form-urlencoded')
    parse_str($content, $content);

  return $content;
}

function response($key = "*", $val = null) {

  static $data = [];

  if ($val) {
    return $data[$key] = $val;
  } else {
    return $key === "*" ? $data : $data[$key];
  }

}