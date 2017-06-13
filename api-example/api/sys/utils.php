<?php

function dd() {
  echo '<pre>';
  call_user_func_array('var_dump', func_get_args());
  exit();
}

function from($source, $key) {
  if (is_array($key)) {
    $result = [];
    foreach ($key as $k) {
      $result[$k] = isset($source[$k]) ? $source[$k] : null;
    }
    return $result;
  }
  return isset($source[$key]) ? $source[$key] : null;
}

function auth_check() {
  if (!session('user')) redirect(config('url') . 'signin', 302, true);
}

function base_url($path = '') {
  print config('url') . $path;
}

function css($name = '') {
  base_url('assets/css/' . $name . '.css');
}

function js($name = '') {
  base_url('assets/js/' . $name . '.js');
}