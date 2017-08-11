<?php

function save_sntry($name) {
}

class Collection {

  private $name = null;
  private $uid = null;
  private $error = null;

  public function __construct($name) {
    $this->name = $name;
  }

  public function save_entry($data) {
    $schema = JDB::settings($this->name, 'schema');
    foreach ($schema['fields'] as $field) {
      $field_name = $field['name'];
      if ($field['required'] && !isset($data[$field_name])) {
        $this->error = [
          'code' => 'empty_required_field',
          'text' => 'Field ['.$field_name.'] is required.'
        ];
        return false;
      }
      if ($field['uniq']) {
        $where = [];
        $where[$field_name] = $data[$field_name];
        if (count(JDB::select($this->name, $where))) {
          $this->error = [
            'code' => 'uniq_field_exists',
            'text' => 'Record  ['.$field_name.'] is required.'
          ];
          return false;
        }
      }
    }
    $this->uid = JDB::insert($this->name, $data);
    return $this->uid;
  }

  public function getError($name = null) {
    if (!$this->error) return null;
    return $name ? $this->error[$name] : "[".$this->error['code']."]: ".$this->error['text'];
  }

  static function create($name, $schema) {
    if (!is_string($name)) {
      throw new RuntimeException(
        "Store name must be a string.", 500
      );
    }
    if (!is_array($schema)) {
      throw new RuntimeException(
        "Store schema must be an array.", 500
      );
    }
    if (JDB::exists($name)) {
      throw new RuntimeException(
        "Store with name '{$name}' is alredy exists.", 500
      );
    }

    if (!JDB::create($name)) return false;

    JDB::settings($name, 'shema', $schema);

    return true;
  }
}