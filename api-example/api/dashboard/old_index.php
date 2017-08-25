<?php

map(['GET', 'POST'], '/collection/<uid>/fields', function($params) {
  $error = null;
  $col_uid = $params['uid'];
  if (request('to_delete')) {
    $result = jdb_select('collections', $col_uid);
    jdb_delete('collections', $col_uid);
    jdb_drop('collections/'.$col_uid);
    redirect(base_url('collections', 200, true));
  }
  $col_name = request('name');
  $col_description = request('description');
  if ($col_name) {
    jdb_update('collections', [
      'name' => $col_name,
      'description' => $col_description
    ], $col_uid);
  }
  $collection = jdb_select('collections', $col_uid)[0];
  $field_id = request('field_id');
  $field_name = request('field_name');
  $field_type = request('field_type');
  if ($field_id) {
    $isset = false;
    foreach ($collection['fields'] as $field) {
      if ($field['id'] == $field_id) $isset = true;
    }
    if ($isset) {
      $error = 'Field with identifier ['.$field_id.'] already exists.';
    } else {
      $collection['fields'][] = [
        'name' => $field_name,
        'id' => $field_id,
        'type' => $field_type
      ];
      jdb_update('collections', [
        'fields' => $collection['fields']
      ], $col_uid);
      redirect(base_url('collection/'.$col_uid.'/fields'));
    }
  }
  print phtml('fields', [
    'error' => $error,
    'collection' => $collection,
    'field_id' => $field_id,
    'field_name' => $field_name,
    'field_type' => $field_type
  ]);
});

map('GET', '/content', function() {
  $collections = jdb_select('collections');
  print phtml('content', [
    'error' => null,
    'collections' => $collections,
    'collection' => null,
    'items' => null
  ]);
});

map('GET', '/content/<uid>', function($params) {
  $error = null;
  $uid = $params['uid'];
  $collections = jdb_select('collections');
  $collection = jdb_select('collections', $uid);
  $collection = $collection[0];
  $items = jdb_select('collections/'.$uid);
  print phtml('content', [
    'error' => $error,
    'collections' => $collections,
    'collection' => $collection,
    'items' => $items
  ]);
});

map(['GET', 'POST'], '/content/<uid>/item', function($params) {
  $error = null;
  $uid = $params['uid'];
  $collections = jdb_select('collections');
  $collection = jdb_select_one('collections', $uid);
  print phtml('item', [
    'error' => $error,
    'collections' => $collections,
    'collection' => $collection
  ]);
});

dispatch();