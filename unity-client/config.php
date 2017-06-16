<?php

class MYCONFIG extends CONFIG{

  function __construct($runtime='bs',$login=FALSE) {
    parent::__construct($runtime,$login);

    $this->session="yowsUnity";
    $this->sessionPrefix = "SESS";
    $this->serverPath = dirname(__FILE__) . '/server';
    $this->incPaths[]=$this->serverPath;
    $this->livereload=true;
    // $this->proxy = 'slgproxy.slg.gr:8080';
  }
}
