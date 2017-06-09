<?php

class JDB {

  # Check is exists table with current name
  static function exists($name) {
    return file_exists(Config::STORAGE . $name . '.json');
  }

  static function create($name) {

    if (JDB::exists($name)) {
      throw new RuntimeException(
         "JSON DB table [{$name}] is already exists.",
        500
      );
    }

    $data = [
      'settings' => [
        'created' => date('Y-m-d H:i:s')
      ],
      'items' => []
    ];

    return !!JDB::set_file_data($name, $data);
  }

  static function drop($name) {

    if (!JDB::exists($name)) {
      throw new RuntimeException(
         "JSON DB table [{$name}] not exists.",
        500
      );
    }

    return unlink(Config::STORAGE . $name . '.json');
  }

  static function get_file_data($name) {

    $file = Config::STORAGE . $name . '.json';

    if (!file_exists($file)) {
      throw new RuntimeException(
         "File [{$file}] not exists.",
        500
      );
    }

    $json = file_get_contents($file);
    $data = json_decode($json, true);
    $err = json_last_error();

    if ($err !== JSON_ERROR_NONE) {
      throw new RuntimeException(
        "JSON encoding failed [{$err}].",
        500
      );
    }

    return $data;
  }

  static function set_file_data($name, $data) {

    if (!is_string($name)) {
      throw new InvalidArgumentException(
        "String expected as first argument",
        500
      );
    }

    $file = Config::STORAGE . $name . '.json';

    if (!is_array($data) || !is_array($data['settings']) ||
      !is_array($data['items'])) {
      throw new InvalidArgumentException(
        "Associative array expected as second argument",
        500
      );
    }

    $data['settings']['updated'] = date('Y-m-d H:i:s');

    $json = json_encode($data, Config::DEBUG ?
      JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE : 0);

    if (!file_exists($file)) {
      return file_put_contents($file, $json);
    }

    $attempt = 100;
    while ($attempt-- && !($fp = fopen($file, 'r+'))) {
      usleep(1000);
    }

    if (flock($fp, LOCK_EX)) {
      ftruncate($fp, 0);
      fwrite($fp, $json);
      fflush($fp);
      flock($fp, LOCK_UN);
    } else {
      throw new RuntimeException(
        "Could not write in file [{$file}].",
        500
      );
    }

    fclose($fp);

    return true;
  }

  static function settings($name, $key = null, $value = null) {

    $argc = func_num_args();

    $data = JDB::get_file_data($name);

    if ($argc == 1) {
      return $data['settings'];
    }

    if ($argc == 2) {
      return isset($data['settings'][$key]) ? $data['settings'][$key] : null;
    }

    if ($argc == 3) {
      $data['settings'][$key] = $value;
    }

    return JDB::set_file_data($name, $data);
  }

  static function insert($name, $new_item) {

    if (!is_array($new_item)) {
      throw new InvalidArgumentException(
        "Array expected as second argument",
        500
      );
    }

    $data = JDB::get_file_data($name);
    $uid = uniqid();

    $new_item['_uid'] = $uid;
    $data['items'][] = $new_item;

    if (!JDB::set_file_data($name, $data)) {
      return false;
    }

    return $uid;
  }

  static function select($name, $where = null) {
    $data = JDB::get_file_data($name);

    if ($where == null) {
      return $data['items'];
    }

    if (is_callable($where)) {

      $result = array_filter($data['items'], $where);

    } else {

      if (is_string($where)) {
        $where = ['_uid' => $where];
      }

      $result = array_filter($data['items'], function($item) use ($where) {
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

  static function update($name, $update, $where = null) {

    if (!is_array($update) && !is_callable($update)) {
      throw new InvalidArgumentException(
        "Array or function expected as second argument",
        500
      );
    }

    $data = JDB::get_file_data($name);

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
        $where = ['_uid' => $where];
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

    if (JDB::set_file_data($name, $data)) {
      return $counter;
    }

    return null;
  }

  static function delete($name, $where = null) {

    $data = JDB::get_file_data($name);

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
          $where = ['_uid' => $where];
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

    return JDB::set_file_data($name, $data);
  }

}