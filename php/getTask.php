<?php

$myfile = fopen("../data/savedTasks.json", "r") or die("Unable to open file!");
echo json_encode(fread($myfile,filesize("../data/savedTasks.json")));
fclose($myfile);