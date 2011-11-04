var map;
var layer;
var infoWindow;
var service;
var queryWindow;

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
   var content='<div id="container" style="width:300px">'+
   '<div id="info" style="background-color:#FFA500;">'
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
   content=content+'</div>';
   var headerText='<div id="radiusdiv" style=background-color:#EEEEEE;clear:both;text-align:center;"'+
      '<h3> <b>Show Me </b></h3></div>';
	  content=content+headerText;
   var showSchoolText='<div id="school" style=background-color:#FFD700;height:300px;width:100px;float:left;">'+
   '<h4> Schools</h4>'+
   '<label for="schoolType">School Type</label></br>'+
    '<select id="schooltype">' +
   '<option value="public">Public</option></br>' +
   '<option value="charter">Charter</option></br>' +
   '<option value="private">Private</option></br>' +
   '<option value="private-charter-public">All</option></br>' +
   '</select></br>'+
     '<label for="schoollevel">School Level</label></br>'+
     '<select id="schoollevel">' +
   '<option value="elementary-schools">Elementary</option></br>' +
   '<option value="middle-schools">Middle</option></br>' +
   '<option value="high-schools">High</option></br>' +
   '</select></br></div>';
   content=content+showSchoolText;
   var otherOptionsText='<div id="other options" style="background-color:#EEEEEE;height:300px;width:200px;float:left;">' +
   '<h4> Other Options</h4>'+
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
   '</div>';
   content=content+otherOptionsText;
   var radiusText='<div id="radiusdiv" style=background-color:#FFA500;clear:both;text-align:center;"'+
   '<label for="radius"> within Radius (miles)</label></br>'+
    '<select id="radius">' +
   '<option value="5">5</option></br>' +
   '<option value="10">10</option></br>' +
   '<option value="15">15</option></br>' +
   '<option value="20">20</option></br>' +
   '<option value="25">25</option></br>' +
   '</select></br>'+
   '<button type="button" id="shownearby"  onClick="shownearby(' + e.latLng.lat() + ',' + e.latLng.lng() + ')"/>Show</button></div>';
   content=content+radiusText+'</div>';
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
var radius=document.getElementById('radius');

var request={
location: latlng,
radius: (radius.options[radius.selectedIndex].value)*1609.344,
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

infoWindow.close();
google.maps.event.addListener(marker,'click',function(){
var request;
for(i=0;i<results.length;i++)
{
if(results[i].geometry.location==this.position)
{
request={reference:results[i].reference};
}
}

if(request!=null)
{

service.getDetails(request,function(place1,status)
{

if(!infoWindow)
   {
	infoWindow=new google.maps.InfoWindow();
	
   }
   var content2='<div id="t">'+
   '<h3>Details</h3>'+
   '<b>Name: </b>'+place1.name +'<br>'+
   '<b>Url: Click to see website</b><a href="' + place1.url+'"> Url</a><br>'+
   '<b>Address: </b>'+place1.formatted_address+'<br>'+
   '<b>Phone: </b>'+place1.formatted_phone_number+'<br>'+
   '<b>Rating: </b>'+place1.rating;
   
   infoWindow.setOptions(
	   {content: content2,
	   position:place1.geometry.location
	   }
   );
   infoWindow.open(map);
});
}



});


}


}


});
}

function createFilterButton()
{

}

function getPlaceTypes()
{
var placetypes=[];



placetypes.push("school");


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




 

