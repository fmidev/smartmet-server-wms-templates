<?php

// read data from cetcapabilities

$serviceURL = filter_input(INPUT_GET, 'server', FILTER_SANITIZE_STRING);
$dataValues = array();
$url = "{$serviceURL}wms?service=WMS&version=1.3.0&request=GetCapabilities";
$xmlData = file_get_contents($url);

$resultString = simplexml_load_string($xmlData);
$data = $resultString->Capability->Layer->Layer;

$results = array();

foreach($data as $layer) {
  $dataArray = array();
  $dataArray["title"] = (string)$layer->Title;
  $dataArray["name"] = (string)$layer->Name;
  $dataArray["abstract"] = (string)$layer->Abstract;
  $dataArray["crs"] = (string)$layer->CRS;
  $dataArray["dimension"] = (string)$layer->Dimension;
  array_push($results, $dataArray);
}

print json_encode($results,true);
