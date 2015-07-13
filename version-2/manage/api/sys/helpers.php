<?php

# Debugging function, simply a var_dump wrapper
function dd() {
  echo '<pre>';
  call_user_func_array('var_dump', func_get_args());
  echo '</pre>';
  exit;
}

# Helper for getting values from $_GET, $_POST and route symbols.
function params($name = null, $default = null) {

  static $source = null;

  # initialize source if this is the first call
  if (!$source) {
    $source = array_merge($_GET, $_POST);
    if (get_magic_quotes_gpc()) {
      array_walk_recursive($source, create_function(
        '&$value',
        '$value = stripslashes($value);'
      ));
    }
  }

  # this is a value fetch call
  if (is_string($name)) {    
    return (isset($source[$name]) ? $source[$name] : $default);
  }

  # used by on() for merging in route symbols.
  if (is_array($name)) {
    $source = array_merge($source, $name);
  }
}

# Helper for getting values from any arrays.
function from($source, $key, $default = null) {

  if (is_array($key)) {
    $result = [];

    foreach ($key as $k) {
      $result[$key] = from($source[$k]);
    }

    return $result;
  }

  if (isset($source[$key]))
    return $source[$key];

  return $default;
}

function response($key, $val = null) {
  static $response = null;

  if (!$response) {
    $response = [
      'status' => 'ok',
      'message' => '',
      'response' => ''
    ];
  }

  # if key is '*', return response
  if ($key == '*') return $response;

  # for all other string keys, set or get
  if (is_string($key)) {
    if ($val === null) {      
      return $response[$key];
    }
    return $response[$key] = $val;
  }
  
  # setting multiple settings
  if (is_array($key)) {    
    $response = array_merge($response, $key);
  }
}

function set_error($msg) {
  response('status', 'error');
  response('message', $msg);
}