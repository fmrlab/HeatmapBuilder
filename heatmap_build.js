function initMap() {
        

	var mapCenterPoint = new google.maps.LatLng(37.7479, -84.2947);

	gMap = new google.maps.Map(document.getElementById('map'), {
		zoom: 8,
		center: mapCenterPoint,
		mapTypeId: google.maps.MapTypeId.ROADMAP
	});
        pointsOnMap();
        
}

function pointsOnMap(){
    var spacing = 1;/*55.438*/
    var pointList = generateAllPointsInsideArea([37.6000, -84.1000], spacing);
    var boundingBoxList = generateBoundingBoxes(pointList, spacing);
    //var no_points = boundingBoxList.length;
    var no_points = pointList.length;
    if(spacing > 1){
        for(var i = 0; i<no_points; i++){
            var cityCircle = new google.maps.Circle({
                strokeColor: '#FF0000',
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: '#FF0000',
                fillOpacity: 0.8,
                map: gMap,
                center: {lat: pointList[i][0], lng: pointList[i][1]},
                radius: 100
            });
        }
    }
    


    for(var i = 0; i<no_points; i++){
        var rectangle = new google.maps.Rectangle({
            strokeColor: '#FF0000',
            strokeOpacity: 0.8,
            strokeWeight: 1,
            fillColor: '#FF0000',
            fillOpacity: 0.35,
            map: gMap,
            bounds: {
                north: boundingBoxList[i][2],
                south: boundingBoxList[i][0],
                east: boundingBoxList[i][3],
                west: boundingBoxList[i][1]
            }
        });
    }
    
}