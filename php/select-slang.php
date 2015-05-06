<?php

    include ('../../../connection/connection.php');

    $pdo = new PDO($dsn, $dbusername, $dbpassword);


    $stmt = $pdo -> prepare("SELECT * FROM `slang_words`;");

    $stmt->execute();

    $slangArray = array();

    while($row = $stmt->fetch()) {

        global $slangArray;
        array_push($slangArray, $row["slang_word"]);

    }

    $noDuplicates = array_unique($slangArray);

    $removeBlanks = array_filter($noDuplicates);

    $singleWords = array();

    foreach($removeBlanks as $single) {
        global $singleWords;
        array_push($singleWords, $single);
    }

    $JSONslang = json_encode($singleWords);

    echo $JSONslang;



?>