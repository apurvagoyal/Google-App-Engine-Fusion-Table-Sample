
function onClickFilterButton()
{

var e=document.getElementById('rating');
var rating=e.value;
alert(rating);
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
