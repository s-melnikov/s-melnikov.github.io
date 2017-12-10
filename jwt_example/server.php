<?php

define("JWT_SECRET", "Lorem ipsum dolor sit amet!");

if ($token = getallheaders()["Authorization"]) {

} else {
  if ($request_body = file_get_contents("php://input")) {
    if ($request_body = json_decode($request_body)) {
      if (isset($request_body["email"]) && isset($request_body["password"])) {
        if ($request_body["email"] === "test@test.com" &&
          $request_body["password"] === "123") {
          $user = [
            'first_name' => 'John',
            'last_name' => 'Doe'
          ]
          json([ 'token' => jwt_encode($user, JWT_SECRET) ]);
        }
      }
    }
  }
}

function json($data) {
  header('Content-type: application/json');
  print json_encode($data);
}

function decode($jwt, $key = null, $verify = false) {
  $partials = explode('.', $jwt);
  if (count($partials) != 3) {
    return false;
  }
  list($header_base64, $payload_base64, $crypto_base64) = $partials;
  try {
    $header = json_decode(base64_decode($header_base64), true);
  } catch (Exception $e) { return false; }
  try {
    $payload = json_decode(base64_decode($payload_base64), true);
  } catch (Exception $e) { return false; }
  $signing = base64_decode($crypto_base64);
  if ($verify) {
    if (empty($header['alg'])) {
      return false;
    }
    if ($signing != jwt_sign("$header_base64.$payload_base64", $key, $header['alg'])) {
      return false;
    }
    return true;
  }
  return $payload;
}

function jwt_encode($payload, $key, $algo = 'HS256') {
  $header = ['typ' => 'JWT', 'alg' => $algo];
  $segments = [
    base64_encode(json_encode($header)),
    base64_encode(json_encode($payload))
  ];
  $signing_input = implode('.', $segments);
  $signature = jwt_sign($signing_input, $key, $algo);
  $segments[] = base64_encode($signature);
  return implode('.', $segments);
}

function jwt_sign($msg, $key, $method = 'HS256') {
  $methods = [
    'HS256' => 'sha256',
    'HS384' => 'sha384',
    'HS512' => 'sha512'
  ];
  if (empty($methods[$method])) {
    throw new DomainException('Algorithm not supported');
  }
  return hash_hmac($methods[$method], $msg, $key, true);
}

