<?php

/**
 *
 */
class JDB {

  /**
   * Symbols for generating an unique id
   */
  const PUSH_CHARS = '-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz';

  /**
   * Path to folder with files
   */
  static $path = 'storage' . DIRECTORY_SEPARATOR;

  /**
   * Debug mode
   */
  static $debug = true;

  /**
   * Name of table
   */
  private $name = null;

  /**
   * Collection data
   */
  private $data = null;

  /**
   * Constructor
   */
  public function __construct($name) {
    $this->name = $name;
    $this->get_data();
  }

  /**
   *  Collection meta
   */
  public function meta($key = null, $value = null) {

    $argc = func_num_args();

    if ($argc == 0) {
      return $this->data['meta'];
    }

    if ($argc == 1) {
      return isset($this->data['meta'][$key]) ?
        $this->data['meta'][$key] : null;
    }

    if ($argc == 2) {
      $this->data['meta'][$key] = $value;
    }

    return self::save_data($this->name, $this->data);
  }

  /**
   * Push new item to collection
   */
  public function push($item) {

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

  /**
   * Find items in collection
   */
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

  /**
   * Find first one item in collection
   */
  public function find_one($where = null) {
    $result = $this->find($where);
    return count($result) ? $result[0] : null;
  }

  /**
   * Update collection items
   */
  public function update($update, $where = null) {

    if (!is_array($update) && !is_callable($update)) {
      throw new Exception("Array or function expected as second argument");
    }

    $counter = 0;

    if (func_num_args() === 1) {

      if (is_callable($update)) {
        array_walk($this->data['items'], $update);
        $counter = count($this->data['items']);
      } else {
        foreach ($this->data['items'] as &$item) {
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

      foreach ($this->data['items'] as &$item) {

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

    if (self::save_data($this->name, $this->data)) {
      return $counter;
    }

    return 0;
  }

  /**
   * Delete items from collection
   */
  public function delete($where = null) {

    if ($where) {

      if (is_callable($where)) {

        $new_items = [];

        foreach ($this->data['items'] as $item) {
          if (!$where($item)) {
            $new_items[] = $item;
          }
        }

        $this->data['items'] = $new_items;

      } else {

        if (is_string($where)) {
          $where = ['uid' => $where];
        }

        foreach ($this->data['items'] as $item_key => $item_value) {

          $next = false;

          foreach ($where as $key => $value) {
            if (!isset($item_value[$key]) || $item_value[$key] !== $value) {
              $next = true;
            }
          }

          if ($next) continue;

          unset($this->data['items'][$item_key]);
        }

      }

      $this->data['items'] = array_values($this->data['items']);

    } else {

      $this->data['items'] = [];
    }

    return self::save_data($this->name, $this->data);
  }

  /**
   * Get data from collection
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

  /**
   * Save collection to file
   */
  static function save_data($name, $data) {

    if (!is_string($name)) {
      throw new Exception("String expected as first argument");
    }

    $file = self::$path . $name . '.json';

    if (!is_array($data) || !is_array($data['meta']) ||
      !is_array($data['items'])) {
      throw new Exception("Associative array expected as second argument");
    }

    $data['meta']['updated'] = date('Y-m-d H:i:s');

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
   * Create new collection
   */
  static function create($name) {

    if (self::exists($name)) {
      throw new Exception("JSON DB table [{$name}] already exist.");
    }

    $data = [
      'meta' => [
        'created' => date('Y-m-d H:i:s'),
        'updated' => date('Y-m-d H:i:s')
      ],
      'items' => []
    ];

    return !!self::save_data($name, $data);
  }

  /**
   * Delete collection
   */
  static function drop($name) {

    if (!self::exists($name)) {
      throw new Exception("JSON DB table [{$name}] not exist.");
    }

    return unlink(JDB_STORAGE . $name . '.json');
  }

  /**
   * Check is collection exists
   */
  static function exists($name) {
    return file_exists(self::$path . $name . '.json');
  }

  /**
   * Return new instance
   */
  static function table($name) {
    return new self($name);
  }

  /**
   *  Create uniq id
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