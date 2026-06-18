<?php
$lines = file('resources/views/welcome.blade.php');
$style = $lines[17]; 
if (!is_dir('public/css')) mkdir('public/css', 0777, true);
file_put_contents('public/css/welcome.css', trim($style));
echo "Done\n";
