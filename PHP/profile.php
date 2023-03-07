<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
error_reporting(E_ALL);
ini_set('display_errors', 1);

class Profile
{
    protected $db;

    public function __construct($db)
    {
        $this->db = $db;
    }

    function getProfile()
    {
        $response = [];
        $id = $_GET['id'];
        try {

            $sql = "SELECT * from User, Student WHERE User.uid = '" . $id . "' AND User.uid=Student.uid;";
            $stmt = $this->db->prepare($sql);
            $stmt->execute();
            if ($stmt->rowCount()) :
                $deet =  $stmt->fetch(PDO::FETCH_ASSOC);
                $response = [
                    'success' => 1,
                    'message' => 'deets secured.',
                    'deets' => $deet,
                ];
            else :
                $response = sendResponse(0, 422, 'no data from Student');
            endif;
            $this->getSchoolByID($deet['school_id'], $response);
            $this->getProductsById($id, $response);
            $this->getClubsById($id, $response);
            $this->getSchools($response);
        } catch (PDOException $e) {
            $response = sendResponse(0, 500, $e->getMessage());
        }

        return $response;
    }

    function getSchoolById($schoolid, &$response)
    {
        $sql = "SELECT name from School WHERE school_id = '" . $schoolid . "';";
        $stmt = $this->db->prepare($sql);
        $stmt->execute();
        if ($stmt->rowCount()) :
            $school =  $stmt->fetch(PDO::FETCH_ASSOC);
            $response['school'] = $school;
        else :
            $response['message'] = $response['message'] . ' no school';
        endif;
    }

    function getProductsById($id, &$response)
    {
        $sql = "SELECT * from Product WHERE uid = '" . $id . "';";
        $stmt = $this->db->prepare($sql);
        $stmt->execute();
        if ($stmt->rowCount()) :
            $prod =  $stmt->fetchAll(PDO::FETCH_ASSOC);
            $response['products'] = $prod;
        else :
            $response['message'] = $response['message'] . ' no data from product';
        endif;
    }

    function getClubsById($id, &$response)
    {
        $sql = "SELECT * from Club WHERE uid = '" . $id . "';";
        $stmt = $this->db->prepare($sql);
        $stmt->execute();
        if ($stmt->rowCount()) :
            $club =  $stmt->fetchAll(PDO::FETCH_ASSOC);
            $response['club'] = $club;
        else :
            $response['message'] = $response['message'] . ' no data from club';
        endif;
    }

    function getSchools(&$response) {
        $sql = "SELECT * from School;";
        $stmt = $this->db->prepare($sql);
        $stmt->execute();
        if ($stmt->rowCount()) :
            $schools =  $stmt->fetchAll(PDO::FETCH_ASSOC);
            $response['schools'] = $schools;
        else :
            $response['message'] = $response['message'] . ' no data from schools';
        endif;
    }

    function editProfile()
    {
        $data = json_decode(file_get_contents("php://input"));
        $response = [];
        $id = trim($data->uid);
        $uname = trim($data->uname);
        $fname = trim($data->fname);
        $lname = trim($data->lname);
        $email = trim($data->email);
        $phone = trim($data->phone);
        $city = trim($data->city);
        $state = trim($data->state);
        $major = trim($data->major);
        $school = trim($data->school);

        try {
            $sql = "UPDATE `User`, `Student` SET User.fname='$fname', User.lname='$lname', User.username='$uname', User.email='$email', User.phone_number='$phone', Student.city='$city', Student.state='$state', Student.major='$major', Student.school_id='$school' WHERE User.uid='$id' AND User.uid=Student.uid;";
            $stmt = $this->db->prepare($sql);
            if ($stmt->execute()) {
                $response = sendResponse(1, 201, 'Details Updated.');
            } else {
                $response = sendResponse(0, 500, 'Details Failed to Update');
            }
        } catch (PDOException $e) {
            $response = sendResponse(0, 500, $e->getMessage());
        }
        return $response;
    }

    function deleteProfile()
    {

        try {
            if (isset($_GET["id"])) {
                $id = $_GET['id'];
            };
            $response = [];
            $sql = "SET FOREIGN_KEY_CHECKS=0; DELETE User, Student FROM User, Student WHERE User.uid=Student.uid AND User.uid='$id'; SET FOREIGN_KEY_CHECKS=1;";
            $stmt = $this->db->prepare($sql);
            if ($stmt->execute()) {
                $response = sendResponse(1, 201, 'Deleted.');
            } else {
                $response = sendResponse(0, 500, 'Failed to Delete.');
            }
        } catch (PDOException $e) {
            $response = sendResponse(0, 500, $e->getMessage());
        }
        return $response;
    }
}
