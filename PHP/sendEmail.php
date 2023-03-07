<?php
error_reporting(E_ALL ^ E_NOTICE ^ E_DEPRECATED ^ E_STRICT);
require_once "Mail.php";
class sendEmail {
   function send($toAddr) {
      $host = "";
      $username = "";
      $password = "";
      $port = "";
      $email_from = "";
      $email_subject = "";
      $email_body = "";
      $email_address = "";
      // echo $toAddr;
      $headers = ['From' => $email_from, 'To' => $toAddr, 'Subject' => $email_subject, 'Reply-To' => $email_address];
      $smtp = Mail::factory('smtp', array ('host' => $host, 'port' => $port, 'auth' => true, 'username' => $username, 'password' => $password));
      $mail = $smtp->send($toAddr, $headers, $email_body);

      if (PEAR::isError($mail)) {
         echo "<p>" . $mail->getMessage() . "</p>";
      } 
      // else {
      //    echo "<p>Message successfully sent!</p>";
      // }
   }
}
?>