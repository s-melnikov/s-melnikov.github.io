<?php

define('ROOT_DIR', realpath(dirname(__FILE__)) . '/');
define('SYS', ROOT_DIR . 'sys/');
define('STORAGE', SYS . 'storage/');

require SYS . 'dispatch.php';
require SYS . 'jsondb.php';
require SYS . 'configs.php';
require SYS . 'app.php';

dispatch();

?>