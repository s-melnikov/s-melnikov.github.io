<?php

error_reporting(E_ALL);

define('ROOT', realpath(dirname(__FILE__)) . '/');
define('SYS', ROOT . 'system/');

require SYS . 'app.php';

new App();