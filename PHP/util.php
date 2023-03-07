<?php

function getuuid($data = null)
{
    return vsprintf('%s%s-%s-%s-%s-%s%s', str_split(bin2hex(random_bytes(16)), 3));
}

function generateJWT($headers, $payload, $secret = 'marketplace')
{
    $encodedHeaders = encodeURL(json_encode($headers));

    $encodedPayload = encodeURL(json_encode($payload));

    $signature = hash_hmac('SHA256', "$encodedHeaders.$encodedPayload", $secret, true);
    $encodedSignature = encodeURL($signature);

    $jwt = "$encodedHeaders.$encodedPayload.$encodedSignature";

    return $jwt;
}

function encodeURL($str)
{
    return rtrim(strtr(base64_encode($str), '+/', '-_'), '=');
}

function isValidJWT($jwt, $secret = 'marketplace')
{
    $tokenParts = explode('.', $jwt);
    $header = base64_decode($tokenParts[0]);
    $payload = base64_decode($tokenParts[1]);
    $signature = $tokenParts[2];

    $expiration = json_decode($payload)->exp;
    $isTokenExpired = ($expiration - time()) < 0;

    $base64_url_header = encodeURL($header);
    $base64_url_payload = encodeURL($payload);
    $derivedSignature = hash_hmac('SHA256', "$base64_url_header.$base64_url_payload", $secret, true);
    $base64_url_signature = encodeURL($derivedSignature);

    $isSignatureValid = ($base64_url_signature === $signature);

    if ($isTokenExpired || !$isSignatureValid) {
        return [
            "message" => "Token is not Valid",
            "data" => "",
            "isValid" => false
        ];
    } else {
        return [
            "data" => json_decode($payload, true),
            "message" => "Successful",
            "isValid" => true
        ];
    }
}

function sendResponse($success, $status, $message, $extra = [])
{
    return array_merge([
        'success' => $success,
        'status' => $status,
        'message' => $message
    ], $extra);
}

function getAuth()
{
    $headers = null;
    if (isset($_SERVER['Authorization'])) {
        $headers = trim($_SERVER["Authorization"]);
    } else if (isset($_SERVER['HTTP_AUTHORIZATION'])) { // for getting cloud header
        $headers = trim($_SERVER["HTTP_AUTHORIZATION"]);
    }
    return $headers;
}

function validateTokenFromHeader()
{
    $authHeader = getAuth();
    $res = [];
    $matches = [];
    if (!empty($authHeader)) {
        preg_match('/Bearer\s(\S+)/', $authHeader, $matches);
    }
    if ($matches) {
        $res = isValidJWT($matches[1]);
    }
    return $res;
}

function encode($value, $options = 0) {
    $_messages = array(
        JSON_ERROR_NONE => 'No error has occurred',
        JSON_ERROR_DEPTH => 'The maximum stack depth has been exceeded',
        JSON_ERROR_STATE_MISMATCH => 'Invalid or malformed JSON',
        JSON_ERROR_CTRL_CHAR => 'Control character error, possibly incorrectly encoded',
        JSON_ERROR_SYNTAX => 'Syntax error',
        JSON_ERROR_UTF8 => 'Malformed UTF-8 characters, possibly incorrectly encoded'
    );
    $result = json_encode($value, $options);

    if($result)  {
        return $result;
    }

    throw new Exception($_messages[json_last_error()]);
}

function safeConvert($data) {
    if (is_array($data)) {
        foreach ($data as $key => $value) {
            $data[$key] = safeConvert($value);
        }
    } else if (is_string ($data)) {
        return utf8_encode($data);
    }
    return $data;
}
