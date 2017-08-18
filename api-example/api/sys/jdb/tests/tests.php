<?php

$start_time = microtime(true);
$table_name = "test_" . $start_time;

define('DEBUG', true);

require '../jdb.php';
require 'helpers.php';

echo "<pre>";

echo "\n<span style='color:#444'># EXISTS \n";

test('exists()', function() use ($table_name) {
  assert(JDB::exists('.test'), '#1');
  assert(!JDB::exists($table_name), '#2');
});

echo "\n<span style='color:#444'># CREATE \n";

test('create()', function() use ($table_name) {
  JDB::create($table_name);
  assert(JDB::exists($table_name), '#1');
});

echo "\n<span style='color:#444'># SETTINGS \n";

test('meta()', function() use ($table_name) {
  $table = JDB::table($table_name);
  $meta = $table->meta();
  assert(is_array($meta) && count($meta) === 2, '#1');
  $created = $table->meta('created');
  assert(is_string($created), '#2');
  $table->meta('foo', 'bar');
  $foo = $table->meta('foo');
  assert($foo === 'bar', '#3');
});

echo "\n<span style='color:#444'># INSERT \n";

test('push()', function() use ($table_name) {
  $table = JDB::table($table_name);
  $json = file_get_contents('users.dump.json');
  $data = json_decode($json, true);
  foreach ($data as $key => $user) {
    $uid = $table->push($user);
    assert(is_string($uid) && strlen($uid) === 20, '#' . $key);
  }
  $json = file_get_contents('storage/'.$table_name.'.json');
  $data = json_decode($json, true);
});

echo "\n<span style='color:#444'># SELECT \n";

test('find()', function() use ($table_name) {
  $table = JDB::table($table_name);
  $result = $table->find();
  assert(count($result) === 50, '#1');
});

test('find(uid)', function() use ($table_name) {
  $table = JDB::table($table_name);
  $result = $table->find();
  $uid = $result[0]['uid'];
  $result = $table->find($uid);
  assert(is_array($result), '#1');
  assert($result[0]['uid'] === $uid, '#2');
});

test('find(where)', function() use ($table_name) {
  $table = JDB::table($table_name);
  $where = ['gender' => 'male'];
  $result = $table->find($where);
  assert(count($result) === 25, '#1');
});

test('find(callback)', function() use ($table_name) {
  $table = JDB::table($table_name);
  $where = function($user) {
    return strpos($user['location.street'], 'road') !== false;
  };
  $result = $table->find($where);
  assert(count($result) === 14, '#1');
});

test('find_one()', function() use ($table_name) {
  $table = JDB::table($table_name);
  $result = $table->find_one();
  assert(is_string($result['uid']), '#1');
});

echo "\n<span style='color:#444'># UPDATE \n";

test('update()', function() use ($table_name) {
  $table = JDB::table($table_name);
  $update = ['registered' => time()];
  $result = $table->update($update);
  assert($result === 50, '#1');
});

test('update(uid)', function() use ($table_name) {
  $table = JDB::table($table_name);
  $result = $table->find();
  $uid = $result[0]['uid'];
  $time = time() - 1000;
  $update = ['registered' => $time];
  $result = $table->update($update, $uid);
  assert($result === 1, '#1');
  $result = $table->find($uid);
  assert($result[0]['registered'] === $time, '#2');
});

test('update(where)', function() use ($table_name) {
  $table = JDB::table($table_name);
  $update = ['gender' => 'm'];
  $where = ['gender' => 'male'];
  $result = $table->update($update, $where);
  assert($result === 25, '#1');
  $where = ['gender' => 'm'];
  $result = $table->find($where);
  assert(count($result) === 25, '#2');
});

test('update(callback)', function() use ($table_name) {
  $table = JDB::table($table_name);
  $result = $table->update(function(&$user) {
    if (strpos($user['location.street'], 'road') !== false) {
      $user['location.street'] = strtoupper($user['location.street']);
    }
  });
  assert($result == 50, '#1');
});

echo "\n<span style='color:#444'># DELETE \n";

test('delete(uid)', function() use ($table_name) {
  $table = JDB::table($table_name);
  $users = $table->find();
  $uid = $users[0]['uid'];
  $table->delete($uid);
  $users = $table->find();
  assert(count($users) === 49, '#1');
  $users = $table->find($uid);
  assert(count($users) === 0, '#2');
});

test('delete(where)', function() use ($table_name) {
  $table = JDB::table($table_name);
  $table->delete(['gender' => 'm']);
  $users = $table->find();
  assert(count($users) === 24, '#1');
  $users = $table->find(['gender' => 'm']);
  assert(count($users) === 0, '#2');
});

test('delete(callback)', function() use ($table_name) {
  $table = JDB::table($table_name);
  $table->delete(function($user) {
    return $user['name.last'] === 'romero';
  });
  $users = $table->find();
  assert(count($users) === 23, '#1');
  $users = $table->find(['name.last' => 'romero']);
  assert(count($users) === 0, '#2');
});

test('delete()', function() use ($table_name) {
  $table = JDB::table($table_name);
  $table->delete();
  $users = $table->find();
  assert(count($users) === 0, '#1');
});

echo "\n<span style='color:#444'># DROP \n";


test_summary();

$memory =  readableSize(memory_get_usage(true));
$total_time = readableTime(microtime(true) - $start_time);
echo "<span style='color:#dcdcdc'>Execute time {$total_time}".PHP_EOL;
echo "Memory usage {$memory}".PHP_EOL;

?>