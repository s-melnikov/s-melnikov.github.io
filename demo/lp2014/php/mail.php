<?php

$email = "rbg-gambit@mail.ru, betonomeshalka-rbg-ru@yandex.ru";
$from = "rbggambit@scorpius.timeweb.ru";

function f($s, $k, $d = null) {
  if (isset($s[$k])) return $s[$k];
  return $d;
}

function p($k, $d = null) {
  return f($_POST, $k, $d);
}

function send_email($from, $to, $subject, $message) {

  $headers  = 'MIME-Version: 1.0' . "\r\n";
  $headers .= 'Content-type: text/html; charset=utf-8' . "\r\n";
  $headers .= 'From: ' . $from . "\r\n";

  return mail($to, $subject, $message, $headers);
}

$respond = array();

$subject = p("_subject_", "Заказ на сайте " . $_SERVER["REMOTE_ADDR"]);
$content = $subject . "<br/><br/>";

if (p("name")) {
  $content .= "Имя: " . p("name") . "<br/>";
}

if (p("tel")) {
  $content .= "Телефон: " . p("tel") . "<br/>";
}

if (p("email")) {
  $content .= "Маил: " . p("email") . "<br/>";
}

if (p("item")) {
  $content .= "Название товара: " . p("item") . "<br/>";
}

$respond['email'] = $email;
$respond['subject'] = $subject;
$respond['content'] = $content;

if (send_email($from, $email, $subject, $content) ) {
  $respond['status'] = 'ok';
} else {
  $respond['status'] = 'error';
}

print json_encode($respond);
