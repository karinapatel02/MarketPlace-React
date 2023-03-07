<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

class Login
{
    protected $db;

    public function __construct($db)
    {
        $this->db = $db;
    }

    function loginUser()
    {
        $data = json_decode(file_get_contents("php://input"));
        $response = [];
        $username = trim($data->username);
        $password = trim($data->password);
        try {
            $getUser = "SELECT * FROM `User` WHERE `username`=:username";
            $usr = $this->db->prepare($getUser);
            $usr->bindValue(':username', $username, PDO::PARAM_STR);
            $usr->execute();
            if ($usr->rowCount()) :
                $row = $usr->fetch(PDO::FETCH_ASSOC);
                // $isValidUser = password_verify($password, $row['password']);
                if ($password == $row['password']) :
                    $headers = array('alg' => 'HS256', 'typ' => 'JWT');
                    $payload = array('uid' => $row['uid'], 'username' => $row['username'], 'role' => $row['role_type'], 'exp' => (time() + 7200));
                    $jwt = generateJWT($headers, $payload);
                    $response = [
                        'success' => 1,
                        'message' => 'You have successfully logged in.',
                        'token' => $jwt
                    ];
                else :
                    $response = sendResponse(0, 422, 'Invalid Password!');
                endif;
            else :
                $response = sendResponse(0, 422, 'Invalid Username!');
            endif;
        } catch (PDOException $e) {
            $response = sendResponse(0, 500, $e->getMessage());
        }

        return $response;
    }

    function update()
    {
        $data = json_decode(file_get_contents("php://input"));
        $response = [];
        $username = trim($data->username);
        $password = trim($data->password);
        try {
            $getUser = "SELECT * FROM `User` WHERE `username`=:username";
            $usr = $this->db->prepare($getUser);
            $usr->bindValue(':username', $username, PDO::PARAM_STR);
            $usr->execute();
            if ($usr->rowCount()) :
                $row = $usr->fetch(PDO::FETCH_ASSOC);
                if ($password != $row['password']) :
                    $updateUser = "UPDATE `User` SET `password`=:password WHERE `uid`=:uid";
                    $usr = $this->db->prepare($updateUser);
                    $usr->bindValue(':password', $password, PDO::PARAM_STR);
                    $usr->bindValue(':uid', $row['uid'], PDO::PARAM_STR);
                    $usr->execute();
                    if ($usr->execute()) {
                        $response = sendResponse(1, 201, 'Password Updated.');
                    } else {
                        $response = sendResponse(0, 500, 'Password Failed to Update');
                    }
                else :
                    $response = sendResponse(0, 422, 'Password cannot be same!');
                endif;
            else :
                $response = sendResponse(0, 422, 'Invalid Username!');
            endif;
        } catch (PDOException $e) {
            $response = sendResponse(0, 500, $e->getMessage());
        }

        return $response;
    }
}
