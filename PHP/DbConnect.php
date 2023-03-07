<?php

/**
 * Database Connection
 */
class DbConnect
{
	public function connect()
	{
		# Enter your database connection credentials here.
		$servername = '';
		$dbname = '';
		$username = '';
		$password = '';
		try {
			$conn = new PDO("mysql:host=$servername;dbname=$dbname;charset=utf8", $username, $password);
			$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
			return $conn;
		} catch (\Exception $e) {
			echo "Database Error: " . $e->getMessage();
		}
	}
}
