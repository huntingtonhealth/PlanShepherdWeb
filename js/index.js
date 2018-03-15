//////////////////////
///Helper Functions///
//////////////////////

// Function to update Place Data (County, State, Rating Area) from PlanShepherd API
function getPlaceData(zip){
	var request = new XMLHttpRequest();
	var url = "http://localhost:3000/home/update_zip?zip=" + zip
		
//readyState Listener for API request (makes work wait for API call to finish)
	request.onreadystatechange = function() {
    	if (this.readyState === 4 && this.status === 200) {
        	var response = JSON.parse(this.responseText);
        	getElements(response);
    	};
	};
		
//Open and send request
	request.open("GET", url, true);
	request.send();
	
};

// Function to convert Date of Birth entry to Age
function getAge(dob) {
    var today = new Date();
    var birthDate = new Date(dob);
    var age = today.getFullYear() - birthDate.getFullYear();
	var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
         age--;
     };
	 
	return age;
};

//////////////////////////
///Dynamic Page Updates///
//////////////////////////

// Creates dropdown for county selection and updates local storage variables
document.getElementById("qsZip").onblur = function() {
	
	//call getPlaceData function above
	response = getPlaceData(document.getElementById("qsZip").value)
	
    getElements = function(response) {
		var respData = response.data;
		var content = '<select id="dropdown">'
		
		// create a new dropdown entry for each county in zip code
		for (var i = 0; i < respData.length; i++) {
			content += ('<option value="' + i + '">' + respData[i].county_name + '</option>')
		};		
		content += "</select>";
		
		//update local storage variables
		localStorage.setItem("qsState", respData[0].state_code);
		localStorage.setItem("qsCounty", respData[0].county);
		localStorage.setItem("qsRatingArea", respData[0].rating_area);	
		
		// dynamically show dropdown
		document.getElementById("countydrop").innerHTML = content;
					
	};
};

// Updates local storage variables when the dropdown is changed
document.getElementById("countydrop").onchange = function() {
	response = getPlaceData(document.getElementById("qsZip").value)
	
	getElements = function(response) {
		var respData = response.data;
		var selVal = document.getElementById("dropdown").value
		
		localStorage.setItem("qsState", respData[selVal].state_code);
		localStorage.setItem("qsCounty", respData[selVal].county);
		localStorage.setItem("qsRatingArea", respData[selVal].rating_area);	
		
	};
};

/////////////////////
///Submit Function///
/////////////////////

function quickSearchSubmit() {
	// Getting the values of your text input
    var qsZip = document.getElementById("qsZip").value;
    var qsAge = getAge(document.getElementById("qsDOB").value);
		
	if (document.getElementById("qsSmoke").checked) {
		var qsSmoke = "Yes";
	} else {
		var qsSmoke = "No";
	}
	if (document.getElementById("qsDental").checked) {
		var qsDental = "Yes";
	} else {
		var qsDental = "No";
	}	

    // Storing the values above into localStorage
    localStorage.setItem("qsZip", qsZip);		
    localStorage.setItem("qsAge", qsAge);
    localStorage.setItem("qsSmoke", qsSmoke);
    localStorage.setItem("qsDental", qsDental);
	
	// Load new page
	window.location.href = "quicksearch.html";
	
	return true;
};

function navigateSubmit() {
	// Getting the values of your text input
	
	// Load new page
	window.location.href = "navigate.html";
	
	return true;
};