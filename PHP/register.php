<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

class Register
{
    protected $db;

    public function __construct($db)
    {
        $this->db = $db;
    }

    function registerUser()
    {
        $data = json_decode(file_get_contents("php://input"));
        $response = [];
        $username = trim($data->username);
        $email = trim($data->email);
        $password = trim($data->password);
        $fname = trim($data->fname);
        $lname = trim($data->lname);
        $pnumber = trim($data->pnumber);
        $role = trim($data->role);

        try {
            $isEmailExists = "SELECT `email` FROM `User` WHERE `email`=:email";
            $isEmailExistsStmt = $this->db->prepare($isEmailExists);
            $isEmailExistsStmt->bindValue(':email', $email, PDO::PARAM_STR);
            $isEmailExistsStmt->execute();
            if ($isEmailExistsStmt->rowCount()) :
                $response = sendResponse(0, 422, 'This E-mail already in use!');
            else :
                $isUserExists = "SELECT `username` FROM `User` WHERE `username`=:username";
                $isUserExistsStmt = $this->db->prepare($isUserExists);
                $isUserExistsStmt->bindValue(':username', $username, PDO::PARAM_STR);
                $isUserExistsStmt->execute();
                if ($isUserExistsStmt->rowCount()) :
                    $response = sendResponse(0, 422, 'This Username already in use!');
                else :
                    $uid = getuuid();
                    $insertSql = "INSERT INTO `User` (`uid`, `username`, `password`, `fname`, `lname`, `email`, `phone_number`, `role_type`) VALUES (?,?,?,?,?,?,?,?)";
                    $this->db->prepare($insertSql)->execute([$uid, $username, $password, $fname, $lname, $email, $pnumber, $role]);
                    if ($role == 'student') :
                        $insertStu = "INSERT INTO `Student` (`uid`, `city`, `state`, `major`, `school_id`) VALUES (?,?,?,?,?)";
                        $this->db->prepare($insertStu)->execute([$uid, NULL, NULL, NULL, NULL]);
                    else :
                        $insertBus = "INSERT INTO `Business_owner` (`uid`, `city`, `state`) VALUES (?,?,?)";
                        $this->db->prepare($insertBus)->execute([$uid, NULL, NULL]);
                    endif;
                    $response = sendResponse(1, 201, 'You have successfully registered.');
                    // include("sendEmail.php");
                    // $send = new sendEmail();
                    // $send->send($email);
                endif;
            endif;
        } catch (PDOException $e) {
            $response = sendResponse(0, 500, $e->getMessage());
        }
        return $response;
    }
}
