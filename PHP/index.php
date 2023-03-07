<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
include("DbConnect.php");
include("login.php");
include("register.php");
include("getUser.php");
include("util.php");
include("business.php");
include("student.php");
include("club.php");
include("product.php");
include("ad.php");
include("profile.php");
include("student_dash.php");
include("business_dash.php");
include("businessprofile.php");
include("cart.php");

$conn = new DbConnect();
$db = $conn->connect();
$method = $_SERVER['REQUEST_METHOD'];
$path = array();
preg_match_all('/\/([a-z]|[0-9]|[A-Z])+/', $_SERVER["REQUEST_URI"], $path);

if (sizeof($path) < 1) {
    $err = array(
        "error" => array(
            "status" => "404",
            "message" => "Bad URL"
        )
    );

    echo json_encode($err);
    exit();
}

$login = new Login($db);
$user = new GetUser($db);
$register = new Register($db);
$business = new Business($db);
$student = new Student($db);
$club = new Club($db);
$product = new Product($db);
$ad = new Ad($db);
$profile = new Profile($db);
$sdash = new StudentDash($db);
$bdash = new BusinessDash($db);
$bprofile = new BusinessProfile($db);
$cart = new Cart($db);

$response = [];
$path = explode("/", $_SERVER['REQUEST_URI']);
$destination = $path[2];
$exploded = explode("?", $destination);
$resource = $exploded[0];
if ($method != 'OPTIONS') {
    if ($resource == 'login') {
        $response = $login->loginUser();
    } else if ($resource == 'getUser') {
        $response = $user->isValid();
    } else if ($resource == 'register') {
        $response = $register->registerUser();
    } else if ($resource == 'createClub') {
        $response = $club->createClub();
    } else if ($resource == 'deleteClub') {
        $response = $club->deleteClub(); 
    } else if ($resource == 'addProduct') {
        $response = $product->addProduct(); 
    } else if ($resource == 'joinClub') {
        $response = $club->addClubMember(); 
    } else if ($resource == 'getClubById') {
        $response = $club->getClub(); 
    } else if ($resource == 'addAd') {
        $response = $ad->addAd(); 
    } else if ($resource == 'getProduct') {
        $response = $product->getProduct(); 
    } else if ($resource == 'getBussUsers') {
        $response = $business->getBusinessUsers();
    } else if ($resource == 'delUser') {
        $response = $business->delUser();
    } else if ($resource == 'getStuUsers') {
        $response = $student->getStuUsers();
    } else if ($resource == 'getCounts') {
        $response = $student->getAllCounts();
    } else if ($resource == 'profile') {
        $response = $profile->getProfile();
    } else if ($resource == 'editprofile') {
        $response = $profile->editProfile();
    } else if ($resource == 'deleteprofile') {
        $response = $profile->deleteProfile();
    } else if ($resource == 'studentdash') {
        $response = $sdash->getDash();
    } else if ($resource == 'businessdash') {
        $response = $bdash->getDash();
    } else if ($resource == 'businessprofile') {
        $response = $bprofile->getProfile();
    } else if ($resource == 'editbusinessprofile') {
        $response = $bprofile->editProfile();
    } else if ($resource == 'deletebusinessprofile') {
        $response = $bprofile->deleteProfile();
    } else if ($resource == 'getOrder') {
        $response = $cart->getOrder();
    } else if ($resource == 'orderTotal') {
        $response = $cart->orderTotal();
    } else if ($resource == 'updatePassword') {
        $response = $login->update();
    } else if ($resource == 'getAddByUser') {
        $response = $ad->getAdByUser();
    } else if ($resource == 'getAds') {
        $response = $ad->getAds();
    } else if ($resource == 'deleteAd') {
        $response = $ad->deleteAd();
    } else if ($resource == 'getOrderhistory') {
        $response = $cart->getOrderhistory();
    } else if ($resource == 'addToCart') {
        $response = $cart->addToCart();
    } else if ($resource == 'getProdById') {
        $response = $product->getProdByUser();
    } else if ($resource == 'deleteProduct') {
        $response = $product->deleteProduct();
    } else if ($resource == 'getAllProducts') {
        $response = $product->getAllProducts(); 
    } else if ($resource == 'deleteProductCart') {
        $response = $cart->deleteProductCart(); 
    }
} else {
    $response = sendResponse(0, 404, 'Page Not Found!');
}
echo encode($response);
?>