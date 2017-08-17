<?php

$start_time = microtime(true);

define('DEBUG', true);

require '../jdb.php';
require 'helpers.php';

echo "<pre>";

echo "\n<span style='color:#444'># EXISTS \n";

test('jdb_exists()', function() {
  assert(jdb_exists('.test'), '#1');
  assert(!jdb_exists('users'), '#2');
});

echo "\n<span style='color:#444'># CREATE \n";

test('jdb_create()', function() {
  jdb_create('users');
  assert(jdb_exists('users'), '#1');
});

echo "\n<span style='color:#444'># SETTINGS \n";

test('jdb_settings()', function() {
  $settings = jdb_settings('users');
  assert(is_array($settings) && count($settings) === 2, '#1');
  $created = jdb_settings('users', 'created');
  assert(is_string($created), '#2');
  jdb_settings('users', 'foo', 'bar');
  $foo = jdb_settings('users', 'foo');
  assert($foo === 'bar', '#3');
});

echo "\n<span style='color:#444'># INSERT \n";

test('jdb_insert()', function() {
  $json = file_get_contents('users.dump.json');
  $data = json_decode($json, true);
  foreach ($data as $key => $user) {
    $uid = jdb_insert('users', $user);
    assert(is_string($uid) && strlen($uid) === 23, '#' . $key);
  }
  $json = file_get_contents('storage/users.json');
  $data = json_decode($json, true);
  assert(is_array($data['settings']), '#101');
  assert(is_array($data['items'][0]), '#102');
});

echo "\n<span style='color:#444'># SELECT \n";

test('jdb_select()', function() {
  $result = jdb_select('users');
  assert(count($result) === 50, '#1');
});

test('jdb_select(uid)', function() {
  $result = jdb_select('users');
  $uid = $result[0]['_uid'];
  $result = jdb_select('users', $uid);
  assert(is_array($result), '#1');
  assert($result[0]['_uid'] === $uid, '#2');
});

test('jdb_select(where)', function() {
  $where = ['gender' => 'male'];
  $result = jdb_select('users', $where);
  assert(count($result) === 25, '#1');
});

test('jdb_select(callback)', function() {
  $where = function($user) {
    return strpos($user['location.street'], 'road') !== false;
  };
  $result = jdb_select('users', $where);
  assert(count($result) === 14, '#1');
});

echo "\n<span style='color:#444'># UPDATE \n";

test('jdb_update()', function() {
  $update = ['registered' => time()];
  $result = jdb_update('users', $update);
  assert($result === 50, '#1');
});

test('jdb_update(uid)', function() {
  $result = jdb_select('users');
  $uid = $result[0]['_uid'];
  $time = time() - 1000;
  $update = ['registered' => $time];
  $result = jdb_update('users', $update, $uid);
  assert($result === 1, '#1');
  $result = jdb_select('users', $uid);
  assert($result[0]['registered'] === $time, '#2');
});

test('jdb_update(where)', function() {

  $update = ['gender' => 'm'];
  $where = ['gender' => 'male'];
  $result = jdb_update('users', $update, $where);
  assert($result === 25, '#1');
  $where = ['gender' => 'm'];
  $result = jdb_select('users', $where);
  assert(count($result) === 25, '#2');
});

test('jdb_update(callback)', function() {
  $result = jdb_update('users', function(&$user) {
    if (strpos($user['location.street'], 'road') !== false) {
      $user['location.street'] = strtoupper($user['location.street']);
    }
    return $user;
  });
  assert($result == 50, '#1');
});

echo "\n<span style='color:#444'># DELETE \n";

test('jdb_delete(uid)', function() {
  $users = jdb_select('users');
  $uid = $users[0]['_uid'];
  jdb_delete('users', $uid);
  $users = jdb_select('users');
  assert(count($users) === 49, '#1');
  $users = jdb_select('users', $uid);
  assert(count($users) === 0, '#2');
});

test('jdb_delete(where)', function() {
  jdb_delete('users', ['gender' => 'm']);
  $users = jdb_select('users');
  assert(count($users) === 24, '#1');
  $users = jdb_select('users', ['gender' => 'm']);
  assert(count($users) === 0, '#2');
});

test('jdb_delete(callback)', function() {
  jdb_delete('users', function($user) {
    return $user['name.last'] === 'romero';
  });
  $users = jdb_select('users');
  assert(count($users) === 23, '#1');
  $users = jdb_select('users', ['name.last' => 'romero']);
  assert(count($users) === 0, '#2');
});

test('jdb_delete()', function() {
  jdb_delete('users');
  $users = jdb_select('users');
  assert(count($users) === 0, '#1');
});

echo "\n<span style='color:#444'># DROP \n";

test('jdb_drop()', function() {
  jdb_drop('users');
  assert(!jdb_exists('users'), '#1');
});

test_summary();

$memory =  readableSize(memory_get_usage(true));
$total_time = readableTime(microtime(true) - $start_time);
echo "<span style='color:#dcdcdc'>Execute time {$total_time}".PHP_EOL;
echo "Memory usage {$memory}".PHP_EOL;

?>