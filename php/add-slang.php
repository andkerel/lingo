<?php

    include ('../../../connection/connection.php');

	$slang = $_POST["slang"];

	$pdo = new PDO($dsn, $dbusername, $dbpassword);

	if(empty($_POST['slang'])){
		echo "You did not fill out the required fields";
	} else {

		$stmt = $pdo -> prepare("INSERT INTO `user-input` (`slang`) VALUES (?);");
		$stmt->bindParam(1, $slang, PDO::PARAM_STR);
		$stmt->execute();
		$stmt->close();

		echo "Word has been added";

	}

?>