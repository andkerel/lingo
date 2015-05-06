<?php

ini_set('display_errors', 1);
require_once('TwitterAPIExchange.php');

include("../../../connection/twitter_lingo_config.php");

/** Perform a GET request and echo the response **/
/** Note: Set the GET field BEFORE calling buildOauth(); **/
$url = 'https://api.twitter.com/1.1/search/tweets.json';
$requestMethod = 'GET';

$getfieldLondon = '?q=test&geocode=51.5286416,-0.1015987,1000km&lang=en&count=100';


$twitter = new TwitterAPIExchange($settings);
$response =  $twitter->setGetfield($getfieldLondon)
    ->buildOauth($url, $requestMethod)
    ->performRequest();

//decode json for php manipulation
$respArray = json_decode($response);

//prepare keys for output values
$keyArray = array("timestamp", "text", "screen_name", "user_name");

//prepare global array
$totalArray = array();

foreach($respArray->statuses as $items)
    {
        //grab needed variables
        $timestamp = $items->created_at;
        $text = $items->text;
        $screen_name = $items->user->screen_name;
        $user = $items->user->name;

        //convert to array
        $infoArray = array($timestamp, $text, $screen_name, $user);
        //combine to create key value pairs
        $slimArray = array_combine($keyArray, $infoArray);

        //combine all in loop
        global $totalArray;
        array_push($totalArray, $slimArray);

    }

//back to JSON for AJAX output
$respJSON = json_encode($totalArray);

//emit JSON response
echo $respJSON;

?>

