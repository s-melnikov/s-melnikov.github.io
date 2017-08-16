<?php

/**
 *
 */
class JDB {

  const PUSH_CHARS = '-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz';

  static $path = 'storage' . DIRECTORY_SEPARATOR;

  static $debug = true;

  private $name = null;

  private $data = null;

  public function __construct($name) {
    $this->name = $name;
    $this->get_data();
  }

  public function settings($key = null, $value = null) {

    $argc = func_num_args();

    if ($argc == 0) {
      return $this->data['settings'];
    }

    if ($argc == 1) {
      return isset($this->data['settings'][$key]) ?
        $this->data['settings'][$key] : null;
    }

    if ($argc == 2) {
      $this->data['settings'][$key] = $value;
    }

    return self::save_data($this->name, $this->data);
  }

  public function insert($item) {

    if (!is_array($item)) {
      throw new Exception("Array expected as second argument");
    }

    $uid = self::uid();

    $item['uid'] = $uid;
    $this->data['items'][] = $item;

    if (!self::save_data($this->name, $this->data)) {
      return false;
    }

    return $uid;
  }

  public function find($where = null) {

    if ($where == null) {
      return $this->data['items'];
    }

    if (is_callable($where)) {

      $result = array_filter($this->data['items'], $where);

    } else {

      if (is_string($where)) {
        $where = ['uid' => $where];
      }

      $result = array_filter($this->data['items'], function($item) use ($where) {
        foreach ($where as $key => $value) {
          if (!isset($item[$key]) || $item[$key] !== $value) {
            return false;
          }
        }
        return true;
      });
    }
    return array_values($result);
  }

  public function find_one($where = null) {
    $result = $this->select($where);
    return count($result) ? $result[0] : null;
  }

  public function update($name, $update, $where = null) {

    if (!is_array($update) && !is_callable($update)) {
      throw new Exception("Array or function expected as second argument");
    }

    $data = jdb_get_file_data($name);

    $counter = 0;

    if (func_num_args() === 2) {
      if (is_callable($update)) {
        $data['items'] = array_map($update, $data['items']);
        $counter = count($data['items']);
      } else {
        foreach ($data['items'] as &$item) {
          foreach ($update as $key => $val) {
            $item[$key] = $val;
          }
          $counter++;
        }
      }

    } else {

      if (is_string($where)) {
        $where = ['uid' => $where];
      }

      foreach ($data['items'] as &$item) {

        $next = false;

        foreach ($where as $key => $value) {
          if (!isset($item[$key]) || $item[$key] !== $value) {
            $next = true;
          }
        }

        if ($next) continue;

        foreach ($update as $key => $value) {
          $item[$key] = $value;
        }

        $counter++;
      }

    }

    if (jdb_set_file_data($name, $data)) {
      return $counter;
    }

    return null;
  }

  public function delete($name, $where = null) {

    $data = jdb_get_file_data($name);

    if (func_num_args() === 2) {

      if (is_callable($where)) {

        $new_items = [];

        foreach ($data['items'] as $item) {
          if (!$where($item)) {
            $new_items[] = $item;
          }
        }

        $data['items'] = $new_items;

      } else {

        if (is_string($where)) {
          $where = ['uid' => $where];
        }

        foreach ($data['items'] as $item_key => $item_value) {

          $next = false;

          foreach ($where as $key => $value) {
            if (!isset($item_value[$key]) || $item_value[$key] !== $value) {
              $next = true;
            }
          }

          if ($next) continue;

          unset($data['items'][$item_key]);
        }

      }

      $data['items'] = array_values($data['items']);

    } else {

      $data['items'] = [];
    }

    return jdb_set_file_data($name, $data);
  }

  /**
   *
   */
  public function get_data() {

    $file = self::$path . $this->name . '.json';

    if (!file_exists($file)) {
      throw new Exception("File [{$file}] not exists.");
    }

    $json = file_get_contents($file);
    $this->data = json_decode($json, true);
    $err = json_last_error();

    if ($err !== JSON_ERROR_NONE) {
      throw new Exception("JSON encoding failed [{$err}].");
    }
  }

  static function save_data($name, $data) {

    if (!is_string($name)) {
      throw new Exception("String expected as first argument");
    }

    $file = self::$path . $name . '.json';

    if (!is_array($data) || !is_array($data['settings']) ||
      !is_array($data['items'])) {
      throw new Exception("Associative array expected as second argument");
    }

    $data['settings']['updated'] = date('Y-m-d H:i:s');

    $json = json_encode($data, self::$debug ?
      JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE : 0);

    if (!file_exists($file)) {
      return file_put_contents($file, $json);
    }

    $attempt = 1000;
    while ($attempt-- && !($fp = fopen($file, 'r+'))) {
      usleep(10000);
    }

    if (flock($fp, LOCK_EX)) {
      ftruncate($fp, 0);
      fwrite($fp, $json);
      fflush($fp);
      flock($fp, LOCK_UN);
    } else {
      throw new Exception("Could not write in file [{$file}].");
    }

    fclose($fp);

    return true;
  }

  /**
   *
   */
  static function create($name) {

    if (self::exists($name)) {
      throw new Exception("JSON DB table [{$name}] already exist.");
    }

    $data = [
      'settings' => [
        'created' => date('Y-m-d H:i:s')
      ],
      'items' => []
    ];

    return !!self::save_data($name, $data);
  }

  /**
   *
   */
  static function drop($name) {

    if (!self::exists($name)) {
      throw new Exception("JSON DB table [{$name}] not exist.");
    }

    return unlink(JDB_STORAGE . $name . '.json');
  }

  /**
   *
   */
  static function exists($name) {
    return file_exists(self::$path . $name . '.json');
  }

  /**
   *
   */
  static function table($name) {
    return new self($name);
  }

  /**
   *
   */
  static function uid() {
    $now = microtime(true) * 10000;
    $timeStampChars = [];
    for ($i = 0; $i < 8; $i++) {
      $timeStampChars[] = substr(self::PUSH_CHARS, $now % 64, 1);
      $now = floor($now / 64);
    }
    $id = implode('', array_reverse($timeStampChars));
    for ($i = 0; $i < 12; $i++) {
      $id .= substr(self::PUSH_CHARS, floor(rand(0, 63)), 1);
    }
    return $id;
  }
}

?>