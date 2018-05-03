

// WMS layer visualization tool
// Ville Ilkka, Finnish Meteorological Institution 2017-


                                                                                                              
var fmi = fmi || {}; 

(function(wmsGraph, undefined) {

    // No (well, mostly) nonsense JavaScript accepted in this neighborhood
    // "use strict";
     
    var debug   = true;    
    var map     = "";
    var layer   = "";
    var opacity = 100;

    // add your server here:
    var dataSource = "http://smartmet.bahamasweather.org.bs:8080/";

    wmsGraph.debug = function(str) {
        if(debug == true) {
            console.log(str);
        }
    }


    // -------------------------------------------------------------
    // get data source from 
    // e.g. http://smartmet.fmi.fi/
    // -------------------------------------------------------------

    $(function(){
        $( "#source-select" ).change(function() {
            wmsGraph.setDataSource();
        });
    })

    wmsGraph.setDataSource = function() {
        dataSource = document.getElementById("source-select").value;
        // remove old map container
        map.off();
        map.remove();
        wmsGraph.initMap();
    }

    wmsGraph.handleAltDataSource = function() {
        $("#get-source").click(function setCustomDataSource() {
            var server = document.getElementById("alt-source").value;
            server = wmsGraph.isValidURL(server);
            if(server !== "") {
                dataSource = document.getElementById("alt-source").value;
                // remove old map container
                map.off();
                map.remove();
                wmsGraph.initMap();
                wmsGraph.debug("Changed datasource to: " + dataSource);
            }

        });
    }



    // -------------------------------------------------------------
    // check whether server url is actually a valid url 
    // -------------------------------------------------------------

    wmsGraph.isValidURL = function(str) {
        // todo
        if(!str.startsWith("http://", 7) || !str.startsWith("https://", 8)) {
            console.log(str);
            str = "http://" + str;
        }

        return str
    }



    // -------------------------------------------------------------
    // set up map instance 
    // -------------------------------------------------------------

    wmsGraph.initMap = function() {
        var mymap = L.map('mapid').setView([25,-70], 6);
        L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
            attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
            maxZoom: 18,
            id: 'mapbox.outdoors',
            accessToken: 'pk.eyJ1IjoibmFra2ltIiwiYSI6ImNqNWYzNzVvaDB3YmUyeHBuOWdwZnM0bHMifQ.QZCKhwf3ET5ujEeZ6_8X_Q'
        }).addTo(mymap);
        wmsGraph.getData();
        map = mymap;
    }



    // -------------------------------------------------------------
    // get all available layers
    // -------------------------------------------------------------

    wmsGraph.getData = function(){
        $.ajax({
            url: 'getdata.php',
            type: 'GET',
            dataType: 'json',
            data: {
                server: dataSource,
            },
            error: function(error) {
                wmsGraph.debug('An error has occurred:');
                wmsGraph.debug(error);
            },
            success: function(data) {
                wmsGraph.debug('Data parsed and loaded');
                wmsGraph.generateLayerNamesList(data);
            }      
        }); 
    }



    // -------------------------------------------------------------
    // populate layer selection div with layer names
    // -------------------------------------------------------------

    wmsGraph.generateLayerNamesList = function(data) {
        
        var layernames = document.getElementById('all-available-layers');
        var basemaps = {};
        var i=0;
        var time = "";
        var timestamps = "";
        for(i=0; i<data.length; i++) {

            
            var timestamps = data[i]["dimension"];
            if(timestamps.length < 50) {
                time = timestamps.split('/');
                timestamp = time[0];
            } else {
                time = timestamps.split(',');
                timestamp = time[1];
            }
            
            basemaps[data[i]['name']] = new L.tileLayer.wms(dataSource + 'wms', {
                layers: data[i]['name'],
                //TIME: timestamp,
                version: '1.3.0',
                transparent: '0.1',
                //service: 'WMS',
                //request: 'GetMap',
                format: 'image/png',
                srs: "EPSG:3857",
                transparent: true
            });
            
        }
        L.control.layers(basemaps,null,{collapsed:true}).addTo(map);
        
        map.on('baselayerchange', function(e) {
            layer = e['layer'];
            wmsGraph.getLegend(e['name']);
        
            // set layer opacity  
            layer.setOpacity(opacity/100);
        });
        wmsGraph.debug(map);
        wmsGraph.debug(L);
    }



    // -------------------------------------------------------------
    // change layer opacity
    // -------------------------------------------------------------

    var slider = document.getElementById("opacity-range");
    var output = document.getElementById("opacity-value");
    output.innerHTML = slider.value + " %"; // Display the default slider value
    opacity = slider.value;

    // Update the current slider value (each time you drag the slider handle)
    slider.oninput = function() {
        if(layer){
            opacity = this.value;
            layer.setOpacity(this.value/100);
            output.innerHTML = this.value + " %";
        }
    }



    // -------------------------------------------------------------
    // get layer legend image
    // -------------------------------------------------------------

    wmsGraph.getLegend = function (name) {
        var div = document.getElementById('legend-container');
        div.innerHTML = '';
        
        var img = document.createElement("img");
        // img.src = "http://data.fmi.fi/fmi-apikey/fd2a6bd5-0236-4524-bc08-2af7cbb803e2/wms?service=WMS&request=GetLegendGraphic&version=1.3.0&sld_version=1.1.0&style=&format=image%2Fpng&layer=" + name;
        img.src = dataSource + "wms?service=WMS&request=GetLegendGraphic&version=1.3.0&sld_version=1.1.0&style=&format=image%2Fpng&layer=" + name;
        div.appendChild(img);
    }


}(fmi.wmsGraph = fmi.wmsGraph || {}));
