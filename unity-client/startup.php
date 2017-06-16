<?php

$libPath=getenv('unity_lib_path') or $libPath=$_SERVER['unity_lib_path'];
$libUrl=getenv('unity_lib_url') or $libUrl=$_SERVER['unity_lib_url'];
if (!$libPath or !$libUrl) die("lib paths not set in environment. set in apache conf, htaccess, environment or manually");

require_once $libPath . '/libc/unity/runtimes/startup.php';
require_once dirname(__FILE__) . '/config.php';

empty($runtime) and $runtime='';
empty($login) and $login=FALSE;
$config=new MYCONFIG($runtime,$login);
$config->run();
!empty($encoding) and mb_internal_encoding($encoding);
//RPC::$jsonOpts=JSON_NUMERIC_CHECK | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES;
