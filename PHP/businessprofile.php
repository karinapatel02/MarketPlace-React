<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
error_reporting(E_ALL);
ini_set('display_errors', 1);

class BusinessProfile
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

            $sql = "SELECT * from User, Business_owner WHERE User.uid = '" . $id . "' AND User.uid=Business_owner.uid;";
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
                $response = sendResponse(0, 422, 'no data from Business Owner');
            endif;

            $this->getProductsById($id, $response);
            $this->getAdsById($id, $response);

        } catch (PDOException $e) {
            $response = sendResponse(0, 500, $e->getMessage());
        }

        return $response;
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

    function getAdsById($id, &$response)
    {
        $sql = "SELECT * from Advertisement WHERE uid='".$id."';";
        $stmt = $this->db->prepare($sql);
        $stmt->execute();
        if ($stmt->rowCount()) :
            $ads =  $stmt->fetchAll(PDO::FETCH_ASSOC);
            $response['ads'] = $ads;
        else :
            $response['message'] = $response['message'] . ' no data from ads';
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

        try {
            $sql = "UPDATE `User`, `Business_owner` SET User.fname='$fname', User.lname='$lname', User.username='$uname', User.email='$email', User.phone_number='$phone', Business_owner.city='$city', Business_owner.state='$state' WHERE User.uid='$id' AND User.uid=Business_owner.uid;";
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
            $sql = "SET FOREIGN_KEY_CHECKS=0; DELETE User, Business_owner FROM User, Student WHERE User.uid=Business_owner.uid AND User.uid='$id'; SET FOREIGN_KEY_CHECKS=1;";
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