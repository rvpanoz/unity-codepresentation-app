<?php
require_once '../startup.php';

function dispatchHook($event){
  global $config,$dispatcher;

  switch($event) {
    case 'beforeDispatch':

    break;
  }
}

$dispatcher=new DISPATCHER();
$dispatcher->hook='dispatchHook';
$dispatcher->handle();
