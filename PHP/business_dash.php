<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
error_reporting(E_ALL);
ini_set('display_errors', 1);

class BusinessDash
{
    protected $db;

    public function __construct($db)
    {
        $this->db = $db;
    }

    function getDash() {
        $response = [];
        $id = $_GET['id'];

        try{
            $sql = "SELECT * from Product WHERE uid='".$id."';";
            $stmt = $this->db->prepare($sql);
            $stmt->execute();
            if ($stmt->rowCount()) :
                $products =  $stmt->fetchAll(PDO::FETCH_ASSOC);
                $response = [
                    'success' => 1,
                    'message' => 'deets secured.',
                    'products' => $products,
                ];
            else :
                $response = sendResponse(0, 422, 'no data from products');
            endif;
            $this->getAds($id, $response);
        } catch(PDOException $e) {
            $response = sendResponse(0, 500, $e->getMessage());
        }

        return $response;
    }

    function getAds($id, &$response)
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

}