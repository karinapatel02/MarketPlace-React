<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

class Cart
{
    protected $db;

    public function __construct($db)
    {
        $this->db = $db;
    }

    function addToCart()
    {
        $data = json_decode(file_get_contents("php://input"));
        $response = [];
        $oid = getuuid();
        $pid = trim($data->pid);
        $uid = trim($data->uid);
        // $pid = '089279-e7c-987-49a-6f59f3';
        // $uid = '252197279-7';
        $date = date('Y-m-d H:i:s');
        $isComplete = '0';
        $quantity = 1;
        $total = '0';
        try {
            $res = validateTokenFromHeader();
            if ($res && $res['isValid']) {
                $isOrderExists = "SELECT * FROM `Order` WHERE `uid`=:uid AND `isComplete`=:isComplete";
                $isOrderExistsStmt = $this->db->prepare($isOrderExists);
\               $isOrderExistsStmt->bindValue(':uid', $uid, PDO::PARAM_STR);
                $isOrderExistsStmt->bindValue(':isComplete', $isComplete, PDO::PARAM_STR);
                $isOrderExistsStmt->execute();
                if ($isOrderExistsStmt->rowCount()) :
                    // $response = sendResponse(0, 422, 'You are already have an open Order!');
                    $order = $isOrderExistsStmt->fetch(PDO::FETCH_ASSOC);
                    $id = $order['oid'];
                    $isProductExists = "SELECT * FROM `Product_order` WHERE `pid`=:pid AND `oid`=:id";
                    $isProductExistsStmt = $this->db->prepare($isProductExists);
                    $isProductExistsStmt->bindValue(':pid', $pid, PDO::PARAM_STR);
                    $isProductExistsStmt->bindValue(':id', $id, PDO::PARAM_STR);
                    $isProductExistsStmt->execute();
                    if ($isProductExistsStmt->rowCount()) :
                        try {
                            $prod = $isProductExistsStmt->fetch(PDO::FETCH_ASSOC);
                            $q = $prod['quantity'];
                            $q = $q + 1;
                            $updateProductOrder = "UPDATE `Product_order` SET `quantity`=:q WHERE `pid`= :pid AND `oid`=:id;";
                            $updateProductOrderStmt = $this->db->prepare($updateProductOrder);
                            $updateProductOrderStmt->bindValue(':pid', $pid, PDO::PARAM_STR);
                            $updateProductOrderStmt->bindValue(':id', $id, PDO::PARAM_STR);
                            $updateProductOrderStmt->bindValue(':q', $q, PDO::PARAM_STR);
                            $updateProductOrderStmt->execute();
                            $response = sendResponse(1, 201, 'You have successfully added the product to Cart!');
                        } catch (PDOException $e2) {
                            $response = sendResponse(0, 500, $e2->getMessage());
                        }
                    else :
                        $insertProductOrder = "INSERT INTO `Product_order`(`pid`, `oid`, `quantity`) VALUES (?,?,?)";
                        $this->db->prepare($insertProductOrder)->execute([$pid, $id, $quantity]);
                        $response = sendResponse(1, 201, 'You have successfully added the product to Cart!');
                    endif;
                else :
                    $insertSql = "INSERT INTO `Order`(`oid`, `uid`, `date`,`isComplete`, `total`) VALUES (?,?,?,?,?)";
                    $this->db->prepare($insertSql)->execute([$oid, $uid, $date, $isComplete, $total]);
                    $response = sendResponse(1, 201, 'You have successfully added the product to Cart!');
                    $insertProductOrder = "INSERT INTO `Product_order`(`pid`, `oid`, `quantity`) VALUES (?,?,?)";
                    $this->db->prepare($insertProductOrder)->execute([$pid, $oid, $quantity]);
                    $response = sendResponse(1, 201, 'You have successfully added the product to Cart!');
                endif;
            }
        } catch (PDOException $e) {
            $response = sendResponse(0, 500, $e->getMessage());
        }

        return $response;
    }

    function getOrder()

    {

        $data = json_decode(file_get_contents("php://input"));
        $response = [];
        $uid = trim($data->uid);
        // $pid = trim($data->pid);
        $isComplete = '0';
        try {

            $res = validateTokenFromHeader();
            if ($res && $res['isValid']) {

                $getOrder = "SELECT o.`oid`, o.`uid`, o.`date`, p.`pid`, o.`total` as total, o.`isComplete`,po.`quantity` as quantity, p.`name` as productname, p.`category`, p.`price` as productprice, p.`description`, p.`stock`, p.`image` FROM `Order` as o, `Product_order` as po, `Product` as p where o.`isComplete`=:isComplete AND o.`uid`=:uid and o.`oid`=po.`oid` and po.`pid`=p.`pid`";
                $Order = $this->db->prepare($getOrder);
                $Order->bindValue(':isComplete', $isComplete, PDO::PARAM_BOOL);
                $Order->bindValue(':uid', $uid, PDO::PARAM_STR);
                // $Order->bindValue(':oid', $oid, PDO::PARAM_STR);
                // $Order->bindValue(':pid', $pid, PDO::PARAM_STR);
                $Order->execute();
                if ($Order->rowCount()) :

                    return [
                        "success" => 1,
                        "res" => $Order->fetchAll(PDO::FETCH_ASSOC)
                    ];

                endif;
            }
        } catch (PDOException $e) {

            $response = sendResponse(0, 500, $e->getMessage());
        }

        return $response;
    }

    function OrderTotal()
    {
        $data = json_decode(file_get_contents("php://input"));
        $response = [];
        $uid = trim($data->uid);
        $total = trim($data->total);
        $isComplete = '1';
        try {
            $res = validateTokenFromHeader();
            if ($res && $res['isValid']) {
                $isOrderComplete = "SELECT `isComplete` FROM `Order` WHERE `uid`=:uid and `isComplete`=:isComplete";
                $isOrderCompleteStmt = $this->db->prepare($isOrderComplete);
                $isOrderCompleteStmt->bindValue(':uid', $uid, PDO::PARAM_STR);
                $isOrderCompleteStmt->bindValue(':isComplete', $isComplete, PDO::PARAM_BOOL);
                $isOrderCompleteStmt->execute();
                if ($isOrderCompleteStmt->rowCount()) :
                    $response = sendResponse(0, 422, 'Your Order has already been Completed!');
                else :
                    $updateOrder = "UPDATE `Order` SET `total`=:total, `isComplete`=:isComplete  WHERE `uid`=:uid";
                    $Order = $this->db->prepare($updateOrder);
                    $Order->bindValue(':total', $total, PDO::PARAM_STR);
                    $Order->bindValue(':isComplete', $isComplete, PDO::PARAM_STR);
                    $Order->bindValue(':uid', $uid, PDO::PARAM_STR);
                    $Order->execute();
                    if ($Order->execute()) {
                        $response = sendResponse(1, 201, 'Order Placed!');
                    } else {
                        $response = sendResponse(0, 500, 'Failed to Place the Order.');
                    }
                endif;
            }
        } catch (PDOException $e) {
            $response = sendResponse(0, 500, $e->getMessage());
        }

        return $response;
    }
    function getOrderhistory()

    {

        $data = json_decode(file_get_contents("php://input"));
        $response = [];
        $uid = trim($data->uid);
        // $pid = trim($data->pid);
        $isComplete = '1';
        try {

            $res = validateTokenFromHeader();
            if ($res && $res['isValid']) {

                $getOrderhistory = "SELECT * FROM `Order` WHERE `uid`=:uid AND `isComplete`=:isComplete";
                $Orderhistory = $this->db->prepare($getOrderhistory);
                $Orderhistory->bindValue(':isComplete', $isComplete, PDO::PARAM_BOOL);
                $Orderhistory->bindValue(':uid', $uid, PDO::PARAM_STR);
                // $Order->bindValue(':pid', $pid, PDO::PARAM_STR);
                $Orderhistory->execute();
                if ($Orderhistory->rowCount()) :

                    return [
                        "success" => 1,
                        "res" => $Orderhistory->fetchAll(PDO::FETCH_ASSOC)
                    ];

                endif;
            }
        } catch (PDOException $e) {

            $response = sendResponse(0, 500, $e->getMessage());
        }

        return $response;
    }


    // function deleteProductCart()
    // {

    //     $data = json_decode(file_get_contents("php://input"));
    //     $response = [];
    //     $uid = trim($data->uid);
    //     $pid = trim($data->pid);
    //     $isComplete = '0';
    //     try {
    //         $res = validateTokenFromHeader();
    //         if ($res && $res['isValid']) {

    //             $deleteSql = "DELETE po FROM `Product_order` as po,`Order` as o WHERE o.`uid`=:uid AND po.`pid`=:pid AND o.`isComplete`=:isComplete and po.`oid` = o.`oid`";
    //             $delStmt = $this->db->prepare($deleteSql);
    //             $delStmt->bindValue(':uid', $uid, PDO::PARAM_STR);
    //             $delStmt->bindValue(':pid', $pid, PDO::PARAM_STR);
    //             $delStmt->bindValue(':isComplete', $isComplete, PDO::PARAM_BOOL);
    //             $delStmt->execute();
    //             $response = sendResponse(1, 201, 'Product removed Successfully!');
    //         }
    //     } catch (PDOException $e) {
    //         $response = sendResponse(0, 500, $e->getMessage());
    //     }

    //     return $response;
    // }

    function deleteProductCart()
    {
        $data = json_decode(file_get_contents("php://input"));
        $response = [];
        $pid = trim($data->pid);
        $uid = trim($data->uid);
        $isComplete = '0';
        try {
            $deleteSql = "DELETE po FROM `Product_order` as po,`Order` as o WHERE o.`uid`=:uid AND po.`pid`=:pid AND o.`isComplete`=:isComplete and po.`oid` = o.`oid`";
            $delStmt = $this->db->prepare($deleteSql);
            $delStmt->bindValue(':uid', $uid, PDO::PARAM_STR);
            $delStmt->bindValue(':pid', $pid, PDO::PARAM_STR);
            $delStmt->bindValue(':isComplete', $isComplete, PDO::PARAM_BOOL);
            $delStmt->execute();
            $response = sendResponse(1, 201, 'Product sccessfully Removed!');
        } catch (PDOException $e) {
            $response = sendResponse(0, 500, $e->getMessage());
        }
        return $response;
    }
}
