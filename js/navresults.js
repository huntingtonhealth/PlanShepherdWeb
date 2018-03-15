//////////////////////////
/// Page Load Function ///
//////////////////////////
window.onload = function(){
	
	indivIndex = 0
	console.log(localStorage.getItem("ppArray");
	
	//search for primary person data
	var searchZip = naviArray[indivIndex];
	var searchState = localStorage.getItem("qsState");
	var searchCounty = localStorage.getItem("qsCounty");
	var searchRatingArea = localStorage.getItem("qsRatingArea");
	var searchAge = getAge(naviArray[indivIndex + 2]);
	var searchSmoke = naviArray[indivIndex + 3];	
	var ppJSON = makeQSCall(searchZip, searchState, searchCounty, searchRatingArea, searchAge, searchSmoke);
	
};

//////////////////////
///Helper Functions///
//////////////////////
function makeQSCall(zip, state, county, ratingArea, age, smoke) {
		
	var request = new XMLHttpRequest();
		
	var url = "http://localhost:3000/plans/quickscreen?zip=" + zip + "&county=" + county + "&state=" + state + "&ratingarea=" + ratingArea + "&age=" + age + "&tobacco=" + smoke + "&dental=No";
	
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
	
	getElements = function(response) {
		data = response.data;
		console.log(data);
		return data;
	};
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