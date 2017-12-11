<?php

define('JWT_SECRET', 'Lorem ipsum dolor sit amet!');

if ($token = getallheaders()['Authorization']) {
  list($token) = sscanf($token, 'Bearer %s');
  if (jwt_decode($token, JWT_SECRET, true)) {
    return json([
      'items' => [
        ['name' => 'The Shawshank Redemption', 'genre' => ['Crime', 'Drama'], 'release' => '14 October 1994'],
        ['name' => 'The Godfather', 'genre' => ['Crime', 'Drama'], 'release' => '24 March 1972'],
        ['name' => 'Schindler\'s List', 'genre' => ['Biography', 'Drama', 'History'], 'release' => '4 February 1994'],
        ['name' => 'Se7en', 'genre' => ['Crime', 'Drama', 'Mystery'], 'release' => '22 September 1995']
      ]
    ]);
  }
  return json(['error' => 'TOKEN_INVALID']);
} else {
  if ($request_body = file_get_contents('php://input')) {
    if ($request_body = json_decode($request_body, true)) {
      if (isset($request_body['email']) && isset($request_body['password'])) {
        if ($request_body['email'] === 'test@test.com' &&
          $request_body['password'] === '123') {
          $user = [
            'first_name' => 'John',
            'last_name' => 'Doe'
          ];
          return json([ 'token' => jwt_encode($user, JWT_SECRET) ]);
        }
        return json(['error' => 'USER_NOT_EXISTS']);
      }
    }
    return json(['error' => 'INVALID_REQUEST_BODY']);
  }
}

return json(['error' => 'EMPTY_REQUEST']);

function json($data) {
  header('Content-type: application/json');
  print json_encode($data);
}

function jwt_decode($jwt, $key = null, $verify = false) {
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

