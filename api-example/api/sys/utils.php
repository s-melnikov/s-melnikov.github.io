<?php

function dd() {
  echo '<pre>';
  call_user_func_array('var_dump', func_get_args());
  exit();
}

function collection($name) {
  return new Collection($name);
}