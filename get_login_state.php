<?php
session_start();
if(isset($_SESSION['skautis_token']))
{
	echo $_SESSION['skautis_token'] . '<br>' . $_SESSION['skautis_timeout'];
}
else
{
	echo "Not logged in...";
}
