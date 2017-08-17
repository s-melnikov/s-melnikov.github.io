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

  private $handle = null;

  /**
   * Constructor
   */
  public function __construct($name) {
    $this->name = $name;
    $this->file = self::$path . $this->name . '.json';
    if (!file_exists($this->file)) {
      throw new Exception("File [{$this->file}] not exists.");
    }
  }

  /**
   * Lock table
   */
  private function lock() {
    $attempt = 100000;
    while ($attempt-- && !($this->handle = fopen($this->file, 'a+'))) {
      usleep(10);
    }
    if (!flock($this->handle, LOCK_EX)) {
      throw new Exception("Could not write in file [{$file}].");
    }
  }

  /**
   * Unlock table
   */
  private function unlock() {
    flock($this->handle, LOCK_UN);
    fclose($this->handle);
  }

  /**
   * Get data from collection
   */
  public function get_data() {
    $contents = fread($this->handle, filesize($this->file));
    if (!$contents) {
      throw new Exception("Table data is corrupted");
    }
    $data = json_decode($contents, true);
    $err = json_last_error();
    if ($err !== JSON_ERROR_NONE) {
      throw new Exception("JSON encoding failed [{$err}].");
    }
    $this->data = $data;
  }

  /**
   * Save collection to file
   */
  public function save_data() {
    if (!is_string($this->name)) {
      throw new Exception("String expected as first argument");
    }
    $this->data['meta']['updated'] = date('Y-m-d H:i:s');
    $json = json_encode($this->data, self::$debug ?
      JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE : 0);
    ftruncate($this->handle, 0);
    fwrite($this->handle, $json);
    return true;
  }

  /**
   *  Collection meta
   */
  public function meta($key = null, $value = null) {
    $this->lock();
    $this->get_data();
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
    $this->save_data($this->name, $this->data);
    $this->unlock();
    return true;
  }

  /**
   * Push new item to collection
   */
  public function push($item) {
    $this->lock();
    $this->get_data();
    if (!is_array($item)) {
      throw new Exception("Array expected as second argument");
    }
    $uid = self::uid();
    $item['uid'] = $uid;
    $this->data['items'][] = $item;
    if (!$this->save_data($this->name, $this->data)) {
      return false;
    }
    $this->unlock();
    return $uid;
  }

  /**
   * Find items in collection
   */
  public function find($where = null) {
    $this->lock();
    $this->get_data();
    $result = null;
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
    $this->unlock();
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
    $this->lock();
    $this->get_data();
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
    $this->save_data($this->name, $this->data);
    $this->unlock();
    if () {
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
    $content = json_encode($data, self::$debug ?
      JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE : 0);
    return !!file_put_contents(self::$path . $name . '.json', $content);
  }

  /**
   * Delete collection
   */
  static function drop($name) {
    if (!self::exists($name)) {
      throw new Exception("JSON DB table [{$name}] not exist.");
    }
    return unlink(self::$path . $name . '.json');
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