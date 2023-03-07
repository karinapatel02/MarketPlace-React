<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

class GetUser
{
    protected $db;

    public function __construct($db)
    {
        $this->db = $db;
    }

    function isValid()
    {
        $res = validateTokenFromHeader();
        if ($res) {
            $data = $res['data'];
            if (
                isset($data['uid']) &&
                $user = $this->fetchUser($data['uid'])
            ) :
                return [
                    "success" => 1,
                    "user" => $user
                ];
            else :
                return [
                    "success" => 0,
                    "message" => $res['message'],
                ];
            endif;
        } else {
            return [
                "success" => 0,
                "message" => "Token not found in request"
            ];
        }
    }

    protected function fetchUser($uid)
    {
        try {
            $getUser = "SELECT * FROM `User` WHERE `uid`=:uid";
            $usr = $this->db->prepare($getUser);
            $usr->bindValue(':uid', $uid, PDO::PARAM_STR);
            $usr->execute();
            if ($usr->rowCount()) :
                return $usr->fetch(PDO::FETCH_ASSOC);
            else :
                return false;
            endif;
        } catch (PDOException $e) {
            return null;
        }
    }
}
