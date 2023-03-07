<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

class Business
{
    protected $db;

    public function __construct($db)
    {
        $this->db = $db;
    }

    function getBusinessUsers()
    {
        $response = [];
        try {
            $res = validateTokenFromHeader();
            if ($res && $res['isValid']) {
                $getUser = "SELECT u.uid, CONCAT(u.fname, ',', u.lname) AS name, u.email, u.phone_number, b.city, b.state FROM User as u, Business_owner as b where u.uid = b.uid";
                $usr = $this->db->prepare($getUser);
                $usr->execute();
                if ($usr->rowCount()) :
                    return [
                        "success" => 1,
                        "res" => $usr->fetchAll(PDO::FETCH_ASSOC)
                    ];
                endif;
            }
        } catch (PDOException $e) {
            $response = sendResponse(0, 500, $e->getMessage());
        }
        return $response;
    }

    function delUser()
    {
        $data = json_decode(file_get_contents("php://input"));
        $response = [];
        $id = trim($data->uid);
        try {
            $res = validateTokenFromHeader();
            if ($res && $res['isValid']) {
                $delUser = "DELETE FROM `User` WHERE `uid`=:uid";
                $usr = $this->db->prepare($delUser);
                $usr->bindValue(':uid', $id, PDO::PARAM_STR);
                $usr->execute();
                if ($usr->rowCount()) :
                    return [
                        "success" => 1
                    ];
                endif;
            }
        } catch (PDOException $e) {
            $response = sendResponse(0, 500, $e->getMessage());
        }
        return $response;
    }
}
