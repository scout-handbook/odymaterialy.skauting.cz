<?php

setcookie('skautis_token', "", time() - 3600);
setcookie('skautis_timeout', "", time() - 3600);
unset($_COOKIE['skautis_token']);
unset($_COOKIE['skautis_timeout']);

header('Location: https://odymaterialy.skauting.cz/');
die();
