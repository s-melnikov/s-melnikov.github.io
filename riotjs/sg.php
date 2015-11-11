<?php
error_reporting(E_ALL);

define('DS', DIRECTORY_SEPARATOR);
define('ROOT', realpath(dirname(__FILE__)) . DS);

$configs = array(
  'theme' => 'default',
  'source.dir' => 'content',
  'destination.dir' => 'public',
  'source.ext' => 'md',
  'destination.ext' => 'html'
);

class App {

  private $configs;

  public function __construct($configs) {
    $this->configs = $configs;
    $this->generateFiles($this->configs['source.dir']);   
    print "Ready!";
  }

  public function generateFiles($directory) {

    $paths = glob($directory . '/*');

    foreach ($paths as $i => $path) {
      if (is_dir($path)) {
        $sourcePath = str_replace($this->configs['source.dir'], $this->configs['destination.dir'], $path);
        if (!is_dir($sourcePath)) {          
          mkdir($sourcePath);
        }
        $this->generateFiles($path);
      } else {
        $fileContent = file_get_contents($path);
        $filePath = str_replace($this->configs['source.dir'], $this->configs['destination.dir'], $path);
        $filePath = str_replace($this->configs['source.ext'], $this->configs['destination.ext'], $filePath);
        file_put_contents(
          $filePath, 
          $this->template('default', array('content' => $fileContent))
        );
      }
    }
  }

  public function template($view, $locals = null) {
    $view_root = 'themes' . DS . $this->configs['theme'];

    if (is_array($locals) && count($locals))
      extract($locals, EXTR_SKIP);

    $view = $view_root . DS . $view . '.html.php';
    $html = '';

    if (file_exists($view)) {
      ob_start();
      require $view;
      $html = ob_get_clean();
    } else {
      print "ERROR: template [{$view}] not found";
    }

    return $html;
  }
}

new App($configs);

?>