<?php 

class App {

  private $config;

  public function __construct() {
    $this->init_configs();

    dd($this->config);
  }

  private function init_configs() {
    $this->config = require SYS . 'config.php';
  }

}

function dd() {
  print "<pre>";
  call_user_func_array('var_dump', func_get_args());
  print "</pre>";
  exit;
}

?>