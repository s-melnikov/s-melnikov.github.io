<?php

# Set true, if work in debug mode
if (!defined('DEBUG')) {
  define('DEBUG', false);
}

# Path to store json files
if (!defined('JDB_STORAGE')) {
  define('JDB_STORAGE', 'storage' . DIRECTORY_SEPARATOR);
}


# Check is exists table with current name
function jdb_exists($name) {
  return file_exists(JDB_STORAGE . $name . '.json');
}

function jdb_create($name) {

  if (jdb_exists($name)) {
    throw new RuntimeException(
       "JSON DB table [{$name}] already exist.",
      500
    );
  }

  $data = [
    'settings' => [
      'created' => date('Y-m-d H:i:s')
    ],
    'items' => []
  ];

  return !!jdb_set_file_data($name, $data);
}

function jdb_drop($name) {

  if (!jdb_exists($name)) {
    throw new RuntimeException(
       "JSON DB table [{$name}] not exist.",
      500
    );
  }

  return unlink(JDB_STORAGE . $name . '.json');
}

function jdb_get_file_data($name) {

  $file = JDB_STORAGE . $name . '.json';

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

function jdb_set_file_data($name, $data) {

  if (!is_string($name)) {
    throw new InvalidArgumentException(
      "String expected as first argument",
      500
    );
  }

  $file = JDB_STORAGE . $name . '.json';

  if (!is_array($data) || !is_array($data['settings']) ||
    !is_array($data['items'])) {
    throw new InvalidArgumentException(
      "Associative array expected as second argument",
      500
    );
  }

  $data['settings']['updated'] = date('Y-m-d H:i:s');

  $json = json_encode($data, DEBUG ?
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

function jdb_settings($name, $key = null, $value = null) {

  $argc = func_num_args();

  $data = jdb_get_file_data($name);

  if ($argc == 1) {
    return $data['settings'];
  }

  if ($argc == 2) {
    return isset($data['settings'][$key]) ? $data['settings'][$key] : null;
  }

  if ($argc == 3) {
    $data['settings'][$key] = $value;
  }

  return jdb_set_file_data($name, $data);
}

function jdb_insert($name, $new_item) {

  if (!is_array($new_item)) {
    throw new InvalidArgumentException(
      "Array expected as second argument",
      500
    );
  }

  $data = jdb_get_file_data($name);
  $uid = uniqid('', true);

  $new_item['_uid'] = $uid;
  $data['items'][] = $new_item;

  if (!jdb_set_file_data($name, $data)) {
    return false;
  }

  return $uid;
}

function jdb_select($name, $where = null) {
  $data = jdb_get_file_data($name);

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

function jdb_update($name, $update, $where = null) {

  if (!is_array($update) && !is_callable($update)) {
    throw new InvalidArgumentException(
      "Array or function expected as second argument",
      500
    );
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

  if (jdb_set_file_data($name, $data)) {
    return $counter;
  }

  return null;
}

function jdb_delete($name, $where = null) {

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

  return jdb_set_file_data($name, $data);
}

?>