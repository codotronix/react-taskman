<?php
$task = $_POST["task"];
//var_dump($task);

if (filesize("../data/savedTasks.json") <= 0) {
    $myfile = fopen("../data/savedTasks.json", "r+");
    $tasks = array();
    array_push($tasks, $task);
    fwrite($myfile, json_encode($tasks));
    echo(json_encode($tasks));
    fclose($myfile);
} else {
    $myfile = fopen("../data/savedTasks.json", "r");
    $existingTasks = json_decode(fread($myfile, filesize("../data/savedTasks.json")));
    var_dump($existingTasks);
    array_push($existingTasks, $task);
    fclose($myfile);
    $myfile = fopen("../data/savedTasks.json", "w");
    fwrite($myfile, json_encode($existingTasks));
    echo(json_encode($existingTasks));
    fclose($myfile);
}
//$existingTasks = json_decode(fread($myfile), filesize("../data/savedTasks.json"));
//array_push($existingTasks, $task);
//echo(json_encode($existingTasks));


//var_dump(filesize("../data/savedTasks.json"));