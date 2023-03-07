<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

class Product
{
    protected $db;

    public function __construct($db)
    {
        $this->db = $db;
    }

    function addProduct()
    {

        $data = json_decode(file_get_contents("php://input"));
        $response = [];
        $name = trim($data->productname);
        $uid = trim($data->uid);
        $category = trim($data->category);
        $description = trim($data->description);
        $price = trim($data->price);
        $stock = trim($data->quantity);
        $image = trim($data->img);
        try {
            $isProductExists = "SELECT `pid` FROM `Product` WHERE `name`=:name";
            $isProductExistsStmt = $this->db->prepare($isProductExists);
            $isProductExistsStmt->bindValue(':name', $name, PDO::PARAM_STR);
            $isProductExistsStmt->execute();
            if ($isProductExistsStmt->rowCount()) :
                $response = sendResponse(0, 422, 'This Product already exists!');
            else :
                $pid = getuuid();
                $insertSql = "INSERT INTO `Product`(`pid`, `uid`, `name`, `category`, `price`, `description`, `stock`, `image`) VALUES  (?,?,?,?,?,?,?,?)";
                $this->db->prepare($insertSql)->execute([$pid, $uid, $name, $category, $price, $description, $stock, $image]);
                $response = sendResponse(1, 201, 'You have successfully added a product!');
            endif;
        } catch (PDOException $e) {
            $response = sendResponse(0, 500, $e->getMessage());
        }
        return $response;
    }

    function getAllProducts()
    {
        $response = [];
        try {
            $res = validateTokenFromHeader();
            if ($res && $res['isValid']) {
                $getProd = "SELECT * FROM `Product`";
                $prod = $this->db->prepare($getProd);
                $prod->execute();
                if ($prod->rowCount()) :
                    return [
                        "success" => 1,
                        "res" => $prod->fetchAll(PDO::FETCH_ASSOC)
                    ];
                endif;
            }
        } catch (PDOException $e) {
            $response = sendResponse(0, 500, $e->getMessage());
        }
        return $response;
    }

    function getProdByUser()
    {
        $data = json_decode(file_get_contents("php://input"));
        $response = [];
        $uid = trim($data->uid);
        try {
            $res = validateTokenFromHeader();
            if ($res && $res['isValid']) {
                $getProdByUser = "SELECT * FROM `Product` where `uid`=:uid";
                $prods = $this->db->prepare($getProdByUser);
                $prods->bindValue(':uid', $uid, PDO::PARAM_STR);
                $prods->execute();
                if ($prods->rowCount()) :
                    return [
                        "success" => 1,
                        "res" => $prods->fetchAll(PDO::FETCH_ASSOC)
                    ];
                endif;
            }
        } catch (PDOException $e) {
            $response = sendResponse(0, 500, $e->getMessage());
        }
        return $response;
    }

    function getProduct()
    {
        $data = json_decode(file_get_contents("php://input"));
        $response = [];
        $pid = trim($data->productid);
        try {
            $res = validateTokenFromHeader();
            if ($res && $res['isValid']) {
                $getProduct = "SELECT * FROM Product where `pid`=:pid";
                $p = $this->db->prepare($getProduct);
                $p->bindValue(':pid', $pid, PDO::PARAM_STR);
                $p->execute();
                if ($p->rowCount()) :
                    return [
                        "success" => 1,
                        "res" => $p->fetch(PDO::FETCH_ASSOC)
                    ];
                endif;
            }
        } catch (PDOException $e) {
            $response = sendResponse(0, 500, $e->getMessage());
        }
        return $response;
    }

    function deleteProduct()
    {
        $data = json_decode(file_get_contents("php://input"));
        $response = [];
        $pid = trim($data->pid);
        try {
            $deleteSql = "DELETE FROM `Product` WHERE `pid`=:pid";
            $delStmt = $this->db->prepare($deleteSql);
            $delStmt->bindValue(':pid', $pid, PDO::PARAM_STR);
            $delStmt->execute();
            $response = sendResponse(1, 201, 'Product sccessfully Deleted!');
        } catch (PDOException $e) {
            $response = sendResponse(0, 500, $e->getMessage());
        }
        return $response;
    }
}
