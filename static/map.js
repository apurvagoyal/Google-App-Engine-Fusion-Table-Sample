var map;

function initialize() {
  
    
    var myOptions = {
        zoom: 13,
        center: new google.maps.LatLng(37.5536117554, -77.4605636597),
        mapTypeId: google.maps.MapTypeId.ROADMAP,
		mapTypeControlOptions: {style: google.maps.MapTypeControlStyle.DROPDOWN_MENU
		}
    }
    map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);

 var layer = new google.maps.FusionTablesLayer({
  query: {
    select: 'Location',
    from: '1125357'
  },
});
layer.setMap(map);

var markers=[];
google.maps.event.addListener(map,'click',function(event){
markers.push(new google.maps.Marker({
      position: event.latLng, 
      map: map,
      icon: "http://gmaps-samples.googlecode.com/svn/trunk/markers/circular/greencirclemarker.png"
    }));    
});

   
}

 

