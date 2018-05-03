<?php

// read data from cetcapabilities

$serviceURL = filter_input(INPUT_GET, 'server', FILTER_SANITIZE_STRING);
//$layer      = filter_input(INPUT_GET, 'layer', FILTER_SANITIZE_STRING);
$legends    = array();

$url     = "{$serviceURL}wms?service=WMS&version=1.3.0&request=GetCapabilities";
$xmlData = file_get_contents($url);

$resultString = simplexml_load_string($xmlData);
$data = $resultString->Capability->Layer->Layer;

$results = array();

foreach($data as $layer) {
  $dataArray = array();
  if(!$layer->Style->LegendURL->OnlineResource){$dataArray["legendURL"] = $layer->Style->LegendURL->OnlineResource;}
  $dataArray["name"] = (string)$layer->Name;
  print "<pre>";
  print_r($dataArray);
  print "</pre>";
}

print json_encode($results,true);
