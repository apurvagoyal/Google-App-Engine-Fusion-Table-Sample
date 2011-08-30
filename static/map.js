var map;
var layer;
var infoWindow;
var service;
function initialize() {
  
    
    var myOptions = {
        zoom: 13,
        center: new google.maps.LatLng(37.5536117554, -77.4605636597),
        mapTypeId: google.maps.MapTypeId.ROADMAP,
		mapTypeControlOptions: {style: google.maps.MapTypeControlStyle.DROPDOWN_MENU
		}
    }
    map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);

	/**
  layer= new google.maps.FusionTablesLayer({
  query: {
    select: 'address',
    from: '1269105'
  }
  ,
  styles: [
	{
	markerOptions: {iconName: "small_red"}
	}]
});
**/
layer=new google.maps.FusionTablesLayer(1269105,{suppressInfoWindows:true},{styles: [
	{
	markerOptions: {iconName: "small_red"}
	}]
});
layer.setMap(map);




google.maps.event.addListener(layer,'click',function(e){

   if(!infoWindow)
   {
	infoWindow=new google.maps.InfoWindow();
	
   }
   var content='<div id="info">'+
	'<h2>Information</h2>'+
	'<b>Address: </b>';
   content=content+e.row['ADDRESS'].value +'<br>';
   var rentInfo='<b>Rent (per month): </b>'+e.row['Rent'].value+'<br>';
   content=content+rentInfo;
   var bedroomInfo='<b>Bedrooms: </b>'+e.row['Bedrooms'].value+'<br>';
   content=content+bedroomInfo;
    var ratingInfo='<b>Rating (out of 10): </b>'+e.row['Rating'].value+'<br>';
   content=content+ratingInfo;
    var reviewInfo='<b>Review: </b>'+e.row['Review'].value;
   content=content+reviewInfo ;
   var showText='<h3>Show Me Nearby</h3>'+
   '<input type="checkbox" id="schools" value="school"/>Schools</br>'+
   '<input type="checkbox" id="doctor" value="doctor"/>Doctors</br>'+
   '<input type="checkbox" id="dentist" value="dentist"/>Dentists</br>'+
   '<input type="checkbox" id="firestation" value="fire_station"/>Fire Station</br>'+
   '<input type="checkbox" id="gym" value="gym"/>Gymnasium</br>'+
   '<input type="checkbox" id="hospital" value="hospital"/>Hospital</br>'+
   '<input type="checkbox" id="library" value="library"/>Library</br>'+
   '<input type="checkbox" id="grocery" value="grocery_or_supermarket"/>Grocery</br>'+
   '<input type="checkbox" id="park" value="park"/>Park</br>'+
   '<input type="checkbox" id="pharmacy" value="pharmacy"/>Pharmacy</br>'+
   '<input type="checkbox" id="subway" value="subway_station"/>Subway Station</br>'+
   '<input type="checkbox" id="vet" value="veterinary_care"/>Veterinary Care</br>'+
   '<button type="button" id="shownearby"  onClick="shownearby(' + e.latLng.lat() + ',' + e.latLng.lng() + ')"/>Show</button>';
   content=content+showText+'</div>';
   infoWindow.setOptions(
	   {content: content,
	   position:e.latLng
	   }
   );
  
   infoWindow.open(map);
});

service=new google.maps.places.PlacesService(map);


   
}

function shownearby(latitude,longitude, places)
{
var latlng = new google.maps.LatLng(latitude,longitude);


var request={
location: latlng,
radius: 2000,
types: getPlaceTypes()
};

service.search(request, function(results, status)
{

if(status==google.maps.places.PlacesServiceStatus.OK)
{
for(i=0;i<results.length;i++)
{
var place=results[i];
var marker=new google.maps.Marker({
position: place.geometry.location,
title: place.name,
icon: place.icon,
map: map

});
}
}


});
}

function getPlaceTypes()
{
var placetypes=[];

var schools=document.getElementById('schools');
if(schools.checked){
placetypes.push(schools.value);
}

var doctor=document.getElementById('doctor');
if(doctor.checked){placetypes.push(doctor.value);}

var dentist=document.getElementById('dentist');
if(dentist.checked){placetypes.push(dentist.value);}

var firestation=document.getElementById('firestation');
if(firestation.checked){placetypes.push(firestation.value);}

var gym=document.getElementById('gym');
if(gym.checked){placetypes.push(gym.value);}

var hospital=document.getElementById('hospital');
if(hospital.checked){placetypes.push(hospital.value);}

var library=document.getElementById('library');
if(library.checked){placetypes.push(library.value);}

var grocery=document.getElementById('grocery');
if(grocery.checked){placetypes.push(grocery.value);}

var park=document.getElementById('park');
if(park.checked){placetypes.push(park.value);}

var pharmacy=document.getElementById('pharmacy');
if(pharmacy.checked){placetypes.push(pharmacy.value);}

var subway=document.getElementById('subway');
if(subway.checked){placetypes.push(subway.value);}

var vet=document.getElementById('vet');
if(vet.checked){placetypes.push(vet.value);}

return placetypes;
}

function onPlacesMarkerClick()
{


}

function onClickFilterButton()
{
var e=document.getElementById('rating');
var rating=e.value;
var bedroomControl=document.getElementById('bedroom');
var bedrooms=bedroomControl.value;
var rentControl=document.getElementById('rent');
var rent=rentControl.value;
var where;
if(rating>-1)
	{
	where="where Rating=" + rating;
	}
	
if(bedrooms>-1)
	{
	if(where==null){where="where Bedrooms=" + bedrooms;}
	else{where=where+" AND Bedrooms=" + bedrooms; }
	
	}
if(rent>-1)
{

	var rentq;
	switch(rent)
	{
		case "700":
	
			rentq="Rent<700";
			
			break;
		case "1000":
			rentq="Rent>=700 && Rent<1000";
			break;
		case "2000":
			rentq="Rent>=1000 && Rent<2000";
			break;
		case "3000":
			rentq="Rent>2000";
			break;
	
	}
	if(where==null){where="where " + rentq;}
	else{where=where+" AND (" + rentq + ")"; }
}
	if(where!=null)
	{
	
	layer.setQuery("select 'ADDRESS' from 1269105 "+where);
	}
	else
	{
	layer.setQuery("select 'ADDRESS' from 1269105");
	}
	
//
}



 

