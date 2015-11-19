<?php

$frm_name  = "Youname";
$recepient = "youmail@ya.ru";
$sitename  = "Название Сайта";
$subject   = "Новая заявка с сайта \"$sitename\"";

$email = trim($_POST["email"]);
$message = trim($_POST["message"]);
$formname = trim($_POST["formname"]);

$message = "
Заявка: $formname <br>
E-mail: $email <br>
Сообщение: $message
";

mail($recepient, $subject, $message, "From: $frm_name <$email>" . "\r\n" . "Reply-To: $email" . "\r\n" . "X-Mailer: PHP/" . phpversion() . "\r\n" . "Content-type: text/html; charset=\"utf-8\"");
