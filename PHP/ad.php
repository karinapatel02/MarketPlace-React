<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

class Ad
{
    protected $db;

    public function __construct($db)
    {
        $this->db = $db;
    }

    function addAd()
    {

        $data = json_decode(file_get_contents("php://input"));
        $response = [];
        $adid = getuuid();
        $uid = trim($data->uid);
        $name = trim($data->adname);
        $desc = trim($data->desc);
        $img = trim($data->img);
        $date = date('Y-m-d H:i:s');
        try {
            $res = validateTokenFromHeader();
            if ($res && $res['isValid']) {
                $isAdExists = "SELECT `name` FROM `Advertisement` WHERE `name`=:name";
                $isAdExistsStmt = $this->db->prepare($isAdExists);
                $isAdExistsStmt->bindValue(':name', $name, PDO::PARAM_STR);
                $isAdExistsStmt->execute();
                if ($isAdExistsStmt->rowCount()) :
                    $response = sendResponse(0, 422, 'This Advertisement Name already in use!');
                else :
                        $insertSql = "INSERT INTO `Advertisement`(`ad_id`, `uid`, `name`, `content`, `date`, `image`) VALUES (?,?,?,?,?,?)";
                    $this->db->prepare($insertSql)->execute([$adid, $uid, $name, $desc, $date, $img]);
                    $response = sendResponse(1, 201, 'You have successfully created an Ad!');
                endif;
            }
        } catch (PDOException $e) {
            $response = sendResponse(0, 500, $e->getMessage());
        }

        return $response;
    }

    function getAdByUser()
    {
        $data = json_decode(file_get_contents("php://input"));
        $response = [];
        $uid = trim($data->uid);
        try {
            $res = validateTokenFromHeader();
            if ($res && $res['isValid']) {
                $getAdByUser = "SELECT * FROM `Advertisement` where `uid`=:uid";
                $ad = $this->db->prepare($getAdByUser);
                $ad->bindValue(':uid', $uid, PDO::PARAM_STR);
                $ad->execute();
                if ($ad->rowCount()) :
                    return [
                        "success" => 1,
                        "res" => $ad->fetchAll(PDO::FETCH_ASSOC)
                    ];
                endif;
            }
        } catch (PDOException $e) {
            $response = sendResponse(0, 500, $e->getMessage());
        }
        return $response;
    }

    function getAds()
    {
        $response = [];
        try {
            $res = validateTokenFromHeader();
            if ($res && $res['isValid']) {
                $getAds = "SELECT * FROM `Advertisement`";
                $ad = $this->db->prepare($getAds);
                $ad->execute();
                if ($ad->rowCount()) :
                    return [
                        "success" => 1,
                        "res" => $ad->fetchAll(PDO::FETCH_ASSOC)
                    ];
                endif;
            }
        } catch (PDOException $e) {
            $response = sendResponse(0, 500, $e->getMessage());
        }
        return $response;
    }

    function deleteAd()
    {
        $data = json_decode(file_get_contents("php://input"));
        $response = [];
        $adid = trim($data->adid);
        try {
            $deleteSql = "DELETE FROM `Advertisement` WHERE `ad_id`=:adid";
            $delStmt = $this->db->prepare($deleteSql);
            $delStmt->bindValue(':adid', $adid, PDO::PARAM_STR);
            $delStmt->execute();
            $response = sendResponse(1, 201, 'Ad sccessfully Deleted!');
        } catch (PDOException $e) {
            $response = sendResponse(0, 500, $e->getMessage());
        }
        return $response;
    }
}
