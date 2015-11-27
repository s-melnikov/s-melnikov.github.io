<?php

$frm_name  = "Superbanners";
$recepient = "youmail@ya.ru";
$sitename  = "Superbanners";
$subject   = "Новая заявка с сайта \"$sitename\"";

$email = trim($_POST["email"]);
$message = trim($_POST["message"]);

$message = "
E-mail: $email <br>
Сообщение: $message
";

$result = mail($recepient, $subject, $message, "From: $frm_name <$email>" . "\r\n" . "Reply-To: $email" . "\r\n" . "X-Mailer: PHP/" . phpversion() . "\r\n" . "Content-type: text/html; charset=\"utf-8\"");

