<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

class Club
{
    protected $db;

    public function __construct($db)
    {
        $this->db = $db;
    }

    function createClub()
    {

        $data = json_decode(file_get_contents("php://input"));
        $response = [];
        $name = trim($data->clubname);
        $uid = trim($data->uid);
        $desc = trim($data->desc);
        $date = date('Y-m-d H:i:s');
        try {
            $res = validateTokenFromHeader();
            if ($res && $res['isValid']) {

                $isClubExists = "SELECT `name` FROM `Club` WHERE `name`=:name";
                $isClubExistsStmt = $this->db->prepare($isClubExists);
                $isClubExistsStmt->bindValue(':name', $name, PDO::PARAM_STR);
                $isClubExistsStmt->execute();
                if ($isClubExistsStmt->rowCount()) :
                    $response = sendResponse(0, 422, 'This Club Name already in use!');
                else :
                    $club_id = getuuid();
                    $insertSql = "INSERT INTO `Club`(`club_id`, `uid`, `name`, `date`, `description`) VALUES (?,?,?,?,?)";
                    $this->db->prepare($insertSql)->execute([$club_id, $uid, $name, $date, $desc]);
                    $response = sendResponse(1, 201, 'You have successfully created a club.');
                    $this->addCreator($uid, $club_id, $date, $response);
                endif;
            }
        } catch (PDOException $e) {
            $response = sendResponse(0, 500, $e->getMessage());
        }

        return $response;
    }

    function addCreator($uid, $club_id, $date, &$response)
    {
        try {
            $insertSql = "INSERT INTO `Club_member`(`club_id`, `uid`, `joindate`) VALUES (?,?,?)";
            $stmt = $this->db->prepare($insertSql);
            $stmt->execute([$club_id, $uid, $date]);
            $response['message'] = $response['message'] . ' You are added to Club';
        } catch (PDOException $e) {
            $response = sendResponse(0, 500, $e->getMessage());
        }
    }

    function deleteClub()
    {

        $data = json_decode(file_get_contents("php://input"));
        $response = [];
        $clubid = trim($data->clubid);
        $uid = trim($data->uid);
        try {
            $res = validateTokenFromHeader();
            if ($res && $res['isValid']) {

                $deleteSql = "DELETE FROM `Club` WHERE `club_id`=:clubid AND `uid`=:uid";
                $delStmt = $this->db->prepare($deleteSql);
                // Check this delete bindValue syntax Probably we might have to right another bindValue as there are 2 where conditions.
                $delStmt->bindValue(':clubid', $clubid, ':uid', $uid, PDO::PARAM_STR);
                $delStmt->execute();
                $response = sendResponse(1, 201, 'Club sccessfully Deleted!');
            }
        } catch (PDOException $e) {
            $response = sendResponse(0, 500, $e->getMessage());
        }

        return $response;
    }

    function addClubMember()
    {
        $data = json_decode(file_get_contents("php://input"));
        $response = [];
        $clubid = trim($data->clubid);
        $uid = trim($data->uid);
        $date = date('Y-m-d H:i:s');
        try {
            $res = validateTokenFromHeader();
            if ($res && $res['isValid']) {
                $isUserExists = "SELECT `uid` FROM `Club_member` WHERE `uid`=:uid";
                $isUserExistsStmt = $this->db->prepare($isUserExists);
                $isUserExistsStmt->bindValue(':uid', $uid, PDO::PARAM_STR);
                $isUserExistsStmt->execute();
                if ($isUserExistsStmt->rowCount()) :
                    $response = sendResponse(0, 422, 'You are already an member of club!');
                else :
                    $insertSql = "INSERT INTO `Club_member`(`club_id`, `uid`, `joindate`) VALUES (?,?,?)";
                    $this->db->prepare($insertSql)->execute([$clubid, $uid, $date]);
                    $response = sendResponse(1, 201, 'You have successfully added to the club!');
                endif;
            }
        } catch (PDOException $e) {
            $response = sendResponse(0, 500, $e->getMessage());
        }

        return $response;
    }

    function getClub()

    {

        $data = json_decode(file_get_contents("php://input"));
        $response = [];
        $clubid = trim($data->clubId);
        // $clubid='MMK';
        try {

            $res = validateTokenFromHeader();
            if ($res && $res['isValid']) {

                $getClub = "SELECT * FROM Club where `club_id`='" . $clubid . "';";
                $club = $this->db->prepare($getClub);
                // $club->bindValue(':clubid', $clubid, PDO::PARAM_STR);
                $club->execute();
                if ($club->rowCount()) :
                    $details = $club->fetch(PDO::FETCH_ASSOC);
                    $response = [
                        "success" => 1,
                        "message" => 'got club',
                        "clubdeets" => $details,
                    ];
                endif;

                $this->getMembers($clubid, $response);
            }
        } catch (PDOException $e) {

            $response = sendResponse(0, 500, $e->getMessage());
        }

        return $response;
    }

    function getMembers($clubid, &$response)
    {
        try {
            $sql = "SELECT u.`uid`, u.`fname`, u.`lname`, cm.`uid`, cm.`club_id` FROM `Club_member` AS cm, `User` AS u WHERE cm.`uid`=u.`uid` AND cm.`club_id`='" . $clubid . "';";
            $stmt = $this->db->prepare($sql);
            $stmt->execute();
            if ($stmt->rowCount()) :
                $members =  $stmt->fetchAll(PDO::FETCH_ASSOC);
                $response['members'] = $members;
            else :
                $response['message'] = $response['message'] . ' no members';
            endif;
        } catch (PDOException $e) {
            $response = sendResponse(0, 500, $e->getMessage());
        }
    }
}
