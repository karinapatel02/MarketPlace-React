<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

class Student
{
    protected $db;

    public function __construct($db)
    {
        $this->db = $db;
    }

    function getStuUsers()
    {
        $response = [];
        try {
            $res = validateTokenFromHeader();
            if ($res && $res['isValid']) {
                $getStuUser = "SELECT u.uid, CONCAT(u.fname, ',', u.lname) AS name, u.email, u.phone_number, s.city, s.state, s.major, sc.name AS school FROM User as u, Student as s, School as sc where u.uid = s.uid and s.school_id = sc.school_id";
                $users = $this->db->prepare($getStuUser);
                $users->execute();
                if ($users->rowCount()) :
                    $response = [
                        "success" => 1,
                        "res" => $users->fetchAll(PDO::FETCH_ASSOC),
                    ];
                endif;
            }
        } catch (PDOException $e) {
            $response = sendResponse(0, 500, $e->getMessage());
        }
        return $response;
    }

    function getAllCounts()
    {
        $response = [];
        try {
            $res = validateTokenFromHeader();
            if ($res && $res['isValid']) {
                $getUserCounts = "SELECT role_type AS role,count(role_type) as count FROM `User` WHERE role_type IN ('student', 'business_owner') GROUP BY role_type";
                $users = $this->db->prepare($getUserCounts);
                $users->execute();
                if ($users->rowCount()) :
                    $response = [
                        "success" => 1,
                        "res" => $users->fetchAll(PDO::FETCH_ASSOC),
                    ];
                    $getClubCounts = "SELECT count(*) as count FROM `Club`";
                    $clubs = $this->db->prepare($getClubCounts);
                    $clubs->execute();
                    if ($clubs->rowCount()) {
                        $response['clubs'] = $clubs->fetchAll(PDO::FETCH_ASSOC);
                        $clubPcts = "select t1.name, t2.total, t2.pct from Club as t1 join (SELECT club_id, COUNT(*) AS Total , CONCAT((COUNT(*) / (SELECT COUNT(*) FROM Club_member LIMIT 5)) * 100,'','%') as pct FROM Club_member GROUP BY club_id LIMIT 5) as t2 on t1.club_id = t2.club_id ORDER BY t2.total DESC";
                        $chart = $this->db->prepare($clubPcts);
                        $chart->execute();
                        if ($chart->rowCount()) {
                            $response['cchart'] = $chart->fetchAll(PDO::FETCH_ASSOC);
                        }
                        $getSchoolCounts = "SELECT count(*) as count FROM `School`";
                        $schools = $this->db->prepare($getSchoolCounts);
                        $schools->execute();
                        if ($schools->rowCount()) {
                            $response['schools'] = $schools->fetchAll(PDO::FETCH_ASSOC);
                        }
                        $getPieCounts = "SELECT COALESCE(`state`, 'Others') as name, count(*) as value FROM `Student` GROUP BY `state`";
                        $pie = $this->db->prepare($getPieCounts);
                        $pie->execute();
                        if ($pie->rowCount()) {
                            $response['pie1'] = $pie->fetchAll(PDO::FETCH_ASSOC);
                        }
                        $getPie2Counts = "SELECT COALESCE(`major`, 'Others') as name, count(*) as value FROM `Student` GROUP BY `major`";
                        $pie2 = $this->db->prepare($getPie2Counts);
                        $pie2->execute();
                        if ($pie2->rowCount()) {
                            $response['pie2'] = $pie2->fetchAll(PDO::FETCH_ASSOC);
                        }
                    }
                endif;
            }
        } catch (PDOException $e) {
            $response = sendResponse(0, 500, $e->getMessage());
        }
        return $response;
    }
}
