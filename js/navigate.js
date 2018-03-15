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

//////////////////////
///Modal Navigation///
//////////////////////
var modalNo = 1;

// Establish event Listener
if (document.body.addEventListener){
    document.body.addEventListener('click', naviButtons, false);
}
else{
    document.body.attachEvent('onclick', naviButtons);//for IE
}

function naviButtons(e){
    e = e || window.event;
    var target = e.target || e.srcElement;
   
// If clicked button is of class 'next', go to the next modal.
	if (target.className.match(/next/))
    {

// Make current modal disappear
		var curModalStr = "modal" + modalNo;
		var curModal = document.getElementById(curModalStr);
		curModal.style.transition = "all 1s";
		curModal.style.opacity = 0;		

// Bump all modals to the left			
		for (var i = 1; i <= 4; i++) {
			var modalStr = "modal" + i;
			var modal = document.getElementById(modalStr);
			modal.style.transition = "all 1s";
			modal.style.transform = "translateX(-" + modalNo*100 + "%)";
		}

// Increment the modal number		
		modalNo++;

// Make current modal appear		
		var curModalStr = "modal" + modalNo;
		var curModal = document.getElementById(curModalStr);
		curModal.style.transition = "all 1s";
		curModal.style.opacity = 1;		
				
    } 
	
// If clicked button is of class 'back', go to the previous modal.	
	else if (target.className.match(/back/))
	{

// Make current modal disappear
		var curModalStr = "modal" + modalNo;
		var curModal = document.getElementById(curModalStr);
		curModal.style.transition = "all 1s";
		curModal.style.opacity = 0;		
		
// Bump all modals to the right							
		for (var i = 1; i <= 4; i++) {
			var nextModalStr = "modal" + i;
			var nextModal = document.getElementById(nextModalStr);
			nextModal.style.transition = "all 1s";
			nextModal.style.transform = "translateX(-" + (modalNo-2)*100 + "%)";
		}

// De-increment the modal number
		modalNo--;
		
// Make current modal appear
		var curModalStr = "modal" + modalNo;
		var curModal = document.getElementById(curModalStr);
		curModal.style.transition = "all 1s";
		curModal.style.opacity = 1;		
		
	}
	
	return false;
}

//////////////////////////
///Dynamic Page Updates///
//////////////////////////

// Creates dropdown for county selection and updates local storage variables
document.getElementById("naviZip").onblur = function() {
	
	//call getPlaceData function above
	response = getPlaceData(document.getElementById("naviZip").value)
	
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

// Add Spouse/Partner button
var partner = document.getElementById("partner");
var partnerClick = document.getElementById("partnerbutton");

partnerClick.onclick = function() {
	content = "Name: <input type='text' id='partName' class='partName' name='partName'> Date of Birth: <input type='date' id='partDOB' class='partDOB' name='partDOB'> Smoker? <select id='partSmoke' class='partSmoke' name=partSmoke'><option value='No'>No</option><option value='Yes'>Yes</option></select><hr />";
	
	partner.innerHTML = content;
}

// Add first Spouse/Partner button
var dep = document.getElementById("depTable");
var depClick = document.getElementById("depbutton");

depClick.onclick = function() {
	
	
	content = "Name: <input type='text' id='depName' class='depName' name='depName' > Date of Birth: <input type='date' id='depDOB' class='depDOB' name='depDOB'> Smoker? <select id='depSmoke' class='depSmoke' name=depSmoke'><option value='No'>No</option><option value='Yes'>Yes</option></select>";
		
    depAdd = document.createElement('div');
	depAdd.innerHTML = content;

	// Append it
	dep.appendChild(depAdd, dep.firstChild);

}

/////////////////////
///Submit Function///
/////////////////////

function naviSubmit() {
	formArray = $("#naviForm").serializeArray();
	
	ppArray = new Array();
	ppArray.push(formArray[0]);
	ppArray.push({
		name: "naviState",
		value: localStorage.getItem("qsState")
	});
	ppArray.push({
		name: "naviCounty",
		value: localStorage.getItem("qsCounty")
	});
	ppArray.push({
		name: "naviRatingArea",
		value: localStorage.getItem("qsRatingArea")
	});
	ppArray.push(formArray[1]);
	ppArray.push(formArray[2]);
	ppArray.push(formArray[3]);
	// Load new page
	//window.location.href = "navresults.html";
	
	return true;
};
