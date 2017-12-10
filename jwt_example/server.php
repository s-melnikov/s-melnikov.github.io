<?php

if ($token = getallheaders()["Authorization"]) {

} else {
  if ($request_body = file_get_contents("php://input")) {
    if ($request_body = json_decode($request_body)) {
      if (isset())
    }
  }
}