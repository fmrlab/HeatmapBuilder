var gDirectionsService;
var gNumberOfPoints = 6;
var gTotalNoOfMapPoints;
var gCallback;
var mapPoints;
var pointBoundingBox;
var startPoint = 0;
var endPoint = 2;
var gMap;
var gDrawingManager;
var infowindow;
function initMap() {


    var mapCenterPoint = new google.maps.LatLng(37.7479, -84.2947);
    infowindow = new google.maps.InfoWindow();

    gMap = new google.maps.Map(document.getElementById('map'), {
        zoom: 8,
        center: mapCenterPoint,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    });
    gDirectionsService = new google.maps.DirectionsService();
    // gDrawingManager =  new google.maps.drawing.DrawingManager({
    //     drawingMode: google.maps.drawing.OverlayType.POLYLINE,
    //     drawingControl: true,
    //     drawingControlOptions: {
    //       position: google.maps.ControlPosition.TOP_LEFT,
    //       drawingModes: [
    //         google.maps.drawing.OverlayType.POLYLINE
    //       ]
    //     },
    //     polylineOptions: {
    //         strokeColor: "#ff0000",
    //         editable: true,
    //         strokeWeight: 2
    //     }
    //   });
    // gDrawingManager.setMap(gMap);

    var placeService = new google.maps.places.PlacesService(gMap);
    placeService.nearbySearch({
        location: mapCenterPoint,
        radius: 40000,
        type: ['police']
    }, callback);

	//displayHeatmapLayer();
    pointsOnMap();
}
function callback(results, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      for (var i = 0; i < results.length; i++) {
        createMarker(results[i]);
      }
    }
  }

  function createMarker(place) {
    var placeLoc = place.geometry.location;
    var marker = new google.maps.Marker({
      map: gMap,
      position: place.geometry.location
    });

    google.maps.event.addListener(marker, 'click', function() {
      infowindow.setContent(place.name);
      infowindow.open(gMap, this);
    });
  }

function displayHeatmapLayer() {


	/**
	* Load Heatmap Layers. Each heatmap was made with 12 KML layers.
	* Was unable to make heatmap with single layer because it would have exceeded google limits. File would be 10MB+.
	* See more details here: https://developers.google.com/maps/documentation/javascript/kmllayer#restrictions
	**/
	var heatmapLayer;
	for(var i =0; i<11; i++){
		//heatmapLayer = new google.maps.KmlLayer('http://www2.ca.uky.edu/forestry/LoggingEPLroutes/assets/kml-data/heatmaps/test_distance/testfireHeatmap0' + '.zip', 
													//{preserveViewport: true});
		heatmapLayer = new google.maps.KmlLayer('http://www2.ca.uky.edu/forestry/LoggingEPLroutes/assets/kml-data/heatmaps/test_distance/ffireHeatmap' + i + '.zip', 
													{preserveViewport: true});
		heatmapLayer.setMap(gMap);
	}
	
	
}

function pointsOnMap() {
    var spacing = 5;/*55.438*/
    mapPoints = generateAllPointsInsideArea([37.7479, -84.2947], spacing);
    //pointBoundingBox = generateBoundingBoxes(mapPoints, spacing);
    output(mapPoints);
    //var no_points = boundingBoxList.length;
    /*var no_points = mapPoints.length;
    if (spacing > 1) {
        for (var i = 0; i < no_points; i++) {
            var cityCircle = new google.maps.Circle({
                strokeColor: '#FF0000',
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: '#FF0000',
                fillOpacity: 0.8,
                map: gMap,
                center: {lat: mapPoints[i][0], lng: mapPoints[i][1]},
                radius: 100
            });
        }
    }

    var lat = fd[0][3];
    for (var i = 0; i < fd.length; i++) {
        var cityCircle = new google.maps.Circle({
            strokeColor: '#FF0000',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#FF0000',
            fillOpacity: 0.8,
            map: gMap,
            center: {lat: parseFloat(fd[i][3]), lng: parseFloat(fd[i][4])},
            radius: 500
        });
    }*/

    // for(var i = 0; i<no_points; i++){
    //     var rectangle = new google.maps.Rectangle({
    //         strokeColor: '#FF0000',
    //         strokeOpacity: 0.8,
    //         strokeWeight: 1,
    //         fillColor: '#FF0000',
    //         fillOpacity: 0.35,
    //         map: gMap,
    //         bounds: {
    //             north: boundingBoxList[i][2],
    //             south: boundingBoxList[i][0],
    //             east: boundingBoxList[i][3],
    //             west: boundingBoxList[i][1]
    //         }
    //     });
    // }
    //generateHitmap();

}

function generateHitmap() {
    closestPoint = findClosest(mapPoints[0], gNumberOfPoints, fd);
    var totalNoPoints = endPoint-startPoint;
    /*gCallback = totalNoPoints * gNumberOfPoints;
    timeDistanceOutput = [];
    fill2DimensionsArray(timeDistanceOutput, totalNoPoints, gNumberOfPoints);
    for (var j = startPoint; j < endPoint; j++) {
        closestPoint = findClosest(mapPoints[j], gNumberOfPoints, fd);
        for (var i = 0; i < gNumberOfPoints; i++) {
            calcRoute(closestPoint[i], mapPoints[0], j - startPoint, i, timeDistanceOutput);
        }
    }*/
}

function converToRadians(x) {
    return x * Math.PI / 180;
}

function findClosest(location, points, destinations) {
    var lat = location[0]; // get user marker latitude
    var lng = location[1]; // get user marker longitude
    var R = 6371; // radius of earth in km
    var distances = [];
    var closestDist = [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1];
    var closestRoutes = [];

    closestDist.MAX_LENGTH = points;

    closestDist.addAndShift = function (number, position) {
        if (position < this.MAX_LENGTH) {
            for (var i = this.MAX_LENGTH - 1; i > position; i--) {
                this[i] = this[i - 1];
            }
            this[position] = number;
        }
    };

    for (var i = 0; i < destinations.length; i++) {
        var mlat = parseFloat(destinations[i][3]); // get possible destination latitude
        var mlng = parseFloat(destinations[i][4]); // get possible destination longitude
        var dLat = converToRadians(mlat - lat);
        var dLong = converToRadians(mlng - lng);

        // calculate distance between 2 points using haversine formula
        var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(converToRadians(lat)) * Math.cos(converToRadians(lat)) * Math.sin(dLong / 2) * Math.sin(dLong / 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c;
        distances[i] = d;

        // check if current iteration is closer than either 1st, 2nd or 3rd closest 
        for (var j = 0; j < points; j++) {
            if (closestDist[j] == -1 || d < distances[closestDist[j]]) {
                closestDist.addAndShift(i, j);
                break;
            }
        }
    }

    for (var i = 0; i < points; i++) {
        closestRoutes[i] = destinations[closestDist[i]];
    }

    return closestRoutes;
}

function calcRoute(start, end, pointnum, routeNum, output) {

    var startPoint = {lat: parseFloat(start[3]), lng: parseFloat(start[4])};
    var endPoint = {lat: end[0], lng: end[1]};
    var request = {
        origin: startPoint,
        destination: endPoint,
        travelMode: google.maps.TravelMode.DRIVING
    };

    // call google directions service
    gDirectionsService.route(request, function (result, status) {
        if (status == google.maps.DirectionsStatus.OK) {
            var time = result.routes[0].legs[0].time.text.split(" ")[0].strip();
            var distance = result.routes[0].legs[0].distance.text.split(" ")[0].strip();
            time_distance = {time: time, distance: distance, info: start}
            output[pointnum][routeNum] = time_distance;
            console.log(output);
        }
        gCallback--;
        if (gCallback == 0) {
            storeShortestRoute(output);
        }
    });
}

function storeShortestRoute(timeDistanceInfo) {
    var arrayLength = timeDistanceInfo.length;
    var newWindow = window.open("about:blank", "", "_blank");
    for (var i = 0; i < arrayLength; i++) {
        var minTime = 100000;
        var minIndex = -1;
        var minDistance = 100000;
        for (var j = 0; j < gNumberOfPoints; j++) {
            if (timeDistanceInfo[i][j].time < minTime) {
                minTime = timeDistanceInfo[i][j].time;
                minDistance = timeDistanceInfo[i][j].distance;
                minIndex = j;
            } else if (timeDistanceInfo[i][j].time == minTime && timeDistanceInfo[i][j].distance < minDistance) {
                minTime = timeDistanceInfo[i][j].time;
                minDistance = timeDistanceInfo[i][j].distance;
                minIndex = j;
            }
        }
        var strLine = mapPoints[startPoint + i][0] + ", " + mapPoints[startPoint + i][1];
        strLine = strLine + ", " + pointBoundingBox[startPoint + i][0] + ", " + pointBoundingBox[startPoint + i][1] + ", " + pointBoundingBox[startPoint + i][2] + ", " + pointBoundingBox[startPoint + i][3];
        strLine = strLine + ", " + timeDistanceInfo[i][minIndex];
        if (newWindow) {
            newWindow.document.write(strLine);
        }
    }
}

function fill2DimensionsArray(arr, rows, columns){
    for (var i = 0; i < rows; i++) {
        arr.push([0])
        for (var j = 0; j < columns; j++) {
            arr[i][j] = 0;
        }
    }
}

function output(result){
    var newWindow = window.open("about:blank", "", "_blank");
    var length = result.length;
    for(var i = 0; i<length; i++){
        var str = result[i][0];
        for(var j = 1; j<result[i].length; j++){
            str = str + ", "+result[i][j];
        }
        if (newWindow) {
            newWindow.document.write(str);
            newWindow.document.write ("<br>");
        }
    }
}