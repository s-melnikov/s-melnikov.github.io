<?php

class JDB
{

  private static $path = null;
  private static $error = array(
    'code' => 0,
    'message' => ''
  );

  private static $handle;

  private $table;
  private $file;
  private $data;

  /**
   * Configs
   */
  public static function configure($configs)
  {
    if (is_string($configs)) {
      self::$path = $configs;
    } else {
      self::$path = $configs['path'];
    }
  }

  /**
   * Get status of last request.
   */
  public static function status($full = false)
  {
    return !$full ? self::$error['code'] : implode('; ', self::$error);
  }

  /**
   * Table
   */
  public static function table($table)
  {

    if (!self::$path) {
      self::$path = $_SERVER['DOCUMENT_ROOT'] . '/jdb/';
    }

    if (!self::exists($table)) {
      self::$error = array('code' => 102, 'message' => 'Table: "' . $table . '" doesnt exists;');
      return false;
    }

    return new self($table);
  }

  /**
   * Create table.
   */
  public static function create($table, $keys)
  {
    self::$error = array('code' => 0, 'message' => '');

    if (self::exists($table)) {
      self::$error = array('code' => 101, 'message' => 'Table: "' . $table . '" already exists;');
      return false;
    }

    $increment = false;
    $auto_increment = false;
    $default_values = array();
    $table_keys = array();

    if (!is_array($keys)) {
      self::$error = array('code' => 104, 'message' => 'Somthing wrong width parameters: "' . $keys . '"');
      return false;
    }

    foreach ($keys as $key => $item) {
      if (is_array($item)) {
        $table_keys[] = $key;

        if (in_array('auto_increment', $item) && !$increment) {
          $increment = true;
          $auto_increment = $key;
        }

        if ($default_value = $item['default']) {
          $default_values[$key] = $default_value;
        }
      } else {
        $table_keys[] = $item;
      }
    }

    if (self::check_array($table_keys, true)) {
      self::$error = array('code' => 104,
        'message' => 'Somthing wrong width parameters: "' . implode(',', array_keys($table_keys)) . '"');
      return false;
    }

    $json = array(
      'settings' => array(
        'keys' => $table_keys,
        'auto_increment' => $auto_increment,
        'default_values' => $default_values,
        'create' => date('Y-m-d h:i:s')
      ),
      'rows' => array()
    );

    $table = self::$path . $table . '.json';

    return self::setJSON($table, $json);
  }

  /**
   * Drop
   */
  public static function drop($table)
  {

    if (!self::exists($table)) {
      self::$error = array('code' => 102, 'message' => 'Table: "' . $table . '" doesnt exists;');
      return false;
    }

    $file = self::$path . $table . '.json';

    if (file_exists($file)) {
      return unlink($file);
    }

    return false;
  }

  /**
   * Constructor
   */
  public function __construct($table)
  {
    $this->table = $table;
    $this->file = self::$path . $table . '.json';
  }

  /**
   * Select data from table;
   */
  public function select($select, $options = array())
  {
    self::$error = array('code' => 0, 'message' => '');

    $select = $this->select2array($select);

    $this->data = self::getJSON($this->file);

    if (self::check_array($select, true)) {
      self::$error = array('code' => 104,
        'message' => 'Somthing wrong width parameters: "' . implode(',', $select) . '"');
      return false;
    }

    if (!$this->check_table_keys($select)) {
      self::$error = array('code' => 202,
        'message' => 'Try to select unexisting keys from table "' . $this->table . '"');
      return false;
    }

    $where = ($options['where']) ? $options['where'] : false;
    $order = ($options['order']) ? $options['order'] : false;
    $limit = ($options['limit']) ? $options['limit'] : false;

    if ($where && !$this->check_table_keys(array_keys($where))) {
      self::$error = array('code' => 202,
        'message' => 'Try to select unexisting keys from table "' . $this->table . '"');
      return false;
    }

    if ($order && !$this->check_table_keys($order[0])) {
      self::$error = array('code' => 202,
        'message' => 'Try to order by unexisting keys from table "' . $this->table . '"');
      return false;
    }

    $result = $this->get_where_array($this->data['rows'], $where);

    if ($select != '*') {
      $result = $this->get_select_array($result, $select);
    }

    $result = $this->get_order_array($result, $order);

    $result = $this->get_limit_array($result, $limit);

    return $result;
  }

  /**
   * Insert
   */
  public function insert($data)
  {
    self::$error = array('code' => 0, 'message' => '');

    $this->data = self::getJSON($this->file, true);

    if (self::check_array(array_keys($data), true)) {
      self::$error = array('code' => 104,
        'message' => 'Somthing wrong width parameters: "' . implode(',', array_keys($data)) . '"');
      return false;
    }

    if (!self::check_table_keys(array_keys($data))) {
      self::$error = array('code' => 202,
        'message' => 'Try to insert unexisting keys; Table "' . $this->table . '"');
      return false;
    }

    $default_values = $this->data['settings']['default_values'];

    foreach ($this->data['settings']['keys'] as $key) {
      if (!isset($data[$key])) {
        $data[$key] = $default_values[$key] ? $default_values[$key] : '';
      }
    }

    $last_increment = isset($this->data['settings']['last_increment']) ? $this->data['settings']['last_increment'] + 1 : 1;
    $increment = $this->data['settings']['auto_increment'];
    $data[$increment] = $last_increment;

    $this->data['rows'][] = $data;
    $this->data['settings']['last_increment']++;
    $this->last_insert_id = $last_increment;
    
    return self::setJSON($this->file, $this->data);
  }

  /**
   * Update data
   */
  public function update($data, $where)
  {
    self::$error = array('code' => 0, 'message' => '');

    $this->data = self::getJSON($this->file, true);

    if (!self::check_table_keys(array_keys($data))) {
      self::$error = array('code' => 202,
        'message' => 'Try to update unexisting keys; Table "' . $this->table . '"');
      return false;
    }

    if ($where) {

      if (self::check_array(array_keys($where), true)) {
        self::$error = array('code' => 104,
          'message' => 'Somthing wrong width parameters: "' . implode(',', array_keys($where)) . '"');
        return false;
      }

      if (!self::check_table_keys(array_keys($where))) {
        self::$error = array('code' => 202,
          'message' => 'Attribute "where" consist of unexisting keys for update table "' . $this->table . '"');
        return false;
      }
    }

    for ($i = 0; $i < count($this->data['rows']); $i++) {
      foreach ($data as $key => $value) {
        if ($this->check_where($this->data['rows'][$i], $where)) {
          $this->data['rows'][$i][$key] = $value;
        }
      }
    }

    return self::setJSON($this->file, $this->data);
  }

  /**
   * Delete data
   */
  public function delete($where)
  {
    self::$error = array('code' => 0, 'message' => '');

    $this->data = self::getJSON($this->file, true);

    if (self::check_array(array_keys($where), true)) {
      self::$error = array('code' => 104,
        'message' => 'Somthing wrong width parameters: "' . implode(',', array_keys($where)) . '"');
      return false;
    }

    if (!$this->check_table_keys(array_keys($where))) {
      self::$error = array('code' => 202,
        'message' => 'Attribute "where" consist of unexisting keys for select from table "' . $this->table . '"');
      return false;
    }

    $this->data['rows'] = $this->get_where_array($this->data['rows'], $where, true);

    return self::setJSON($this->file, $this->data);

  }

  /**
   * Alter table. add or drop columns.
   */
  public function alter($todo, $keys)
  {
    self::$error = array('code' => 0, 'message' => '');

    $todo = strtolower($todo);

    if ($todo == 'add') {
      $result = $this->add_column($keys);
    } elseif ($todo == 'drop') {
      $result = $this->drop_column($keys);
    } else {
      self::$error = array('code' => 103, 'message' => 'Unknown propery "' . $todo . '";');
      return false;
    }

    return $result;
  }

  /**
   * Truncate.
   */
  public function truncate()
  {
    self::$error = array('code' => 0, 'message' => '');

    $this->data['rows'] = array();
    $this->data['settings']['last_increment'] = 0;

    return self::setJSON($this->file, $this->data);
  }

  /**
   * Get last insert id
   */
  public function last_insert_id()
  {
    return $this->last_insert_id;
  }

  /**
   * Exists
   */
  public static function exists($table)
  {
    $path = self::$path . $table . '.json';
    return file_exists($path);
  }

  /**
   * Get JSON
   */
  private static function getJSON($file, $lock = false)
  {
    if (!file_exists($file)) return false;

    $i = 0;

    while (!($data = file_get_contents($file)) && ($i < 10)) {
      usleep(10000);
      $i++;
    }

    if (!$data) {
      throw new Exception('JSONDB: Can\'t read file data (' . $file . ')');
    }

    if (!$json = json_decode($data, true)) {
      throw new Exception('JSONDB: Can\'t parse file data (' . $file . ')');
    }

    if ($lock) {
      self::$handle = fopen($file, "w");
      $i = 0;
      while (!($res = flock(self::$handle, LOCK_EX)) && ($i < 10)) {
        usleep(10000);
        $i++;
      }
      if (!$res) {
        throw new Exception('JSONDB: Can\'t set file-lock (' . $file . ')');
      }
    }

    return $json;
  }

  /**
   * Set JSON
   */
  private static function setJSON($file, $json)
  {
    if (!is_array($json)) return false;

    $json = json_encode($json, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);

    if (!self::$handle) {
      return file_put_contents($file, $json);
    }

    if (!fwrite(self::$handle, $json)) {
      throw new Exception('JSONDB: Can\'t write data to file (' . $file . ')');
    }

    fclose(self::$handle);
    self::$handle = null;    

    return true;
  }

  /**
   * Set JSON
   */
  static function trim_array($array)
  {
    $data = array();

    foreach ($array as $key => $value) {
      $key = trim($key);
      $value = trim($value);
      $data[$key] = $value;
    }

    return $data;
  }

  /**
   * Check Array
   */
  private static function check_array($array, $flag = false)
  {
    $is_empty = false;

    if (!is_array($array)) {
      $array = array($array);
    }

    foreach ($array as $key => $value) {
      $value = trim($value);
      if (empty($value)) {
        unset($array[$key]);
        $is_empty = true;
      }
    }

    if (!$flag) {
      return array_values($array);
    } else {
      return $is_empty;
    }
  }

  /**
   * Check table keys
   */
  private function check_table_keys($keys)
  {

    if ($keys == '*') return true;

    $table_keys = $this->data['settings']['keys'];
    if (!is_array($keys)) $keys = array($keys);

    foreach ($keys as $key) {
      if ($key == '*') return true;

      if ($key == 'rand()') return true;

      if (!in_array($key, $table_keys)) return false;
    }

    return true;
  }

  /**
   * Check where arrey
   */
  private function check_where($row, $where)
  {

    if (empty($where)) return true;

    $error = array(true);

    foreach ($where as $key => $value) {
      if (!is_array($value)) {
        if ($row[$key] != $value) {
          $error[] = false;
        }
      } else {
        foreach ($value as $val) {
          $ea = false;
          if ($row[$key] == $val) {
            $ea = true;
            break;
          }
        }
        $error[] = $ea;
      }
    }

    return !in_array(false, $error);
  }

  /**
   * Select to array
   */
  private function select2array($select)
  {

    if (!is_array($select)) $select = explode(',', $select);

    for ($i = 0; $i < count($select); $i++) {
      $select[$i] = trim($select[$i]);

      if ($select[$i] == '*') return '*';

      if (empty($select[$i])) unset($select[$i]);
    }

    return $select;
  }

  /**
   * Get where array
   */
  private function get_where_array($data, $where, $reverse = false)
  {

    if (!$where) return $data;

    $where_data = array();
    $reverse_array = array();
    $i = 0;

    foreach ($data as $row) {
      $result = false;
      foreach ($where as $key => $value) {
        $check = self::check_where($row, $where);
        if ($check) $result = true;
      }
      if ($result) {
        $where_data[$i] = $row;
        $i++;
      } else {
        $reverse_array[] = $row;
      }
    }
    return $reverse ? $reverse_array : $where_data;
  }

  /**
   * Get select array
   */
  private function get_select_array($data, $select)
  {
    $select_data = array();
    $i = 0;

    foreach ($data as $row) {
      foreach ($select as $key) {
        if (!empty($key)) {
          $select_data[$i][$key] = $row[$key];
        }
      }
      $i++;
    }

    return $select_data;
  }

  /**
   * Get order array
   */
  private function get_order_array($data, $order)
  {

    if (!$order || !count($data)) return $data;

    $key = false;
    $how = false;
    $order_array = array();
    $order_data = array();

    if (is_array($order)) {
      if (count($order) == 2) {
        $key = $order[0];
        $how = $order[1];
        if (empty($key) && empty($how)) return $data;
      } else {
        $how = $order[0];
      }
    } else {
      $how = $order;
    }

    if (empty($key)) {
      if ($how == 'rand()') {
        shuffle($data);
        return $data;
      } else {
        return $data;
      }
    }

    foreach ($data as $id => $row) {
      $order_array[$id] = $row[$key];
    }

    if ($how == 'asc') {
      asort($order_array);
    } elseif ($how == 'desc') {
      arsort($order_array);
    }

    foreach ($order_array as $id => $row) {
      $order_data[$id] = $data[$id];
    }

    return $order_data;
  }

  /**
   * Get limit array
   */
  private function get_limit_array($data, $limit)
  {

    if (!$limit) return $data;

    if (is_array($limit)) {
      $min = $limit[0];
      $max = $limit[1];
    } else {
      $min = $limit;
    }

    if ($max > count($data)) $max = count($data);

    if ($max) {
      $data = array_slice($data, $min, $max);
    } else {
      $data = array_slice($data, 0, $min);
    }

    return $data;
  }

  /**
   * Add column
   */
  private function add_column($keys)
  {

    $this->data = self::getJSON($this->file, true);

    if (!is_array($keys)) $keys = explode(',', $keys);

    $increment = $this->data['settings']['auto_increment'];
    $default_values = array();
    $add_keys = array();

    foreach ($keys as $key => $item) {
      if (is_array($item)) {
        $add_keys[] = trim($key);
        if ($item['auto_increment'] && !$increment) {
          $increment = true;
          $auto_increment = $key;
        }
        if ($default_value = $item['default']) {
          $default_values[$key] = $default_value;
        }
      } else {
        $add_keys[] = trim($item);
      }
    }

    if (self::check_array($add_keys, true)) {
      self::$error = array('code' => 104,
        'message' => 'Somthing wrong width parameters: "' . implode(',', $add_keys) . '"');
      return false;
    }

    if ($this->check_table_keys($add_keys)) {
      self::$error = array('code' => 201,
        'message' => 'Addins keys are already exist; Table: "' . $this->table . '"');
      return false;
    }

    $this->data['settings']['keys'] = array_merge($this->data['settings']['keys'], $add_keys);

    if (!is_array($this->data['settings']['default_values'])) {
      $this->data['settings']['default_values'] = array();
    }

    $this->data['settings']['default_values'] = array_merge($this->data['settings']['default_values'], $default_values);

    for ($i = 0; $i < count($this->data['rows']); $i++) {
      foreach ($add_keys as $key) {
        $this->data['rows'][$i][$key] = empty($default_values[$key]) ? '' : $default_values[$key];
      }
    }

    return self::setJSON($this->file, $this->data);
  }

  /**
   * Drop column
   */
  private function drop_column($keys)
  {

    $this->data = self::getJSON($this->file, true);

    if (!is_array($keys)) $keys = self::trim_array(explode(',', $keys));
    $new_data = array();

    if (self::check_array($keys, true)) {
      self::$error = array('code' => 104,
        'message' => 'Somthing wrong width parameters: "' . implode(',', $keys) . '"');
      return false;
    }

    if (!$this->check_table_keys($keys)) {
      self::$error = array('code' => 202,
        'message' => 'Try to drop an unexisting column from table "' . $this->table . '"');
      return false;
    }

    foreach ($keys as $key) {
      if ($number = array_search($key, $this->data['settings']['keys'])) {
        unset($this->data['settings']['keys'][$number]);
      }
      if ($this->data['settings']['auto_increment'] == $key) {
        $this->data['settings']['auto_increment'] = false;
      }
      if (isset($this->data['settings']['default_values'][$key])) {
        unset($this->data['settings']['default_values'][$key]);
      }
    }

    foreach ($this->data['rows'] as $row) {
      foreach ($keys as $key) {
        unset($row[$key]);
      }
      $new_data[] = $row;
    }

    $this->data['rows'] = $new_data;

    return self::setJSON($this->file, $this->data);
  }

}

?>