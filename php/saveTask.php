<?php
$task = (json_encode($_POST["task"]));

$myfile = fopen("../data/savedTasks.json", "w");
fwrite($myfile, $task);
fclose($myfile);