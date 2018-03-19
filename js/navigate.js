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
	 
	var strAge = age.toString();
	if (age <= 14) {
		strAge = "0-14";
	}
	 
	return strAge;
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
	formIterator = 0;
	
	parseArray(formArray);
};
		
function display(displayData){
	console.log(displayData);
	
	var tr = "<table><tr><th>Plan Marketing Name</th><th>Individual Rate</th></tr>";
	for (var i = 0; i < displayData.length; i++) {
		tr += ("<tr>");
		tr += ("<td>" + displayData[i].planid + "</td>");
		tr += ("<td>" + displayData[i].rate + "</td>");
		tr += ("</tr>");
	};
	tr += "</table>"
	
	document.getElementById("tabledata").innerHTML = tr;
}

function parseArray(formArray) {
	respArray = buildResps(formArray, function(respArray){
		
		var indivCt = respArray.length;
		if (document.getElementById("partDOB")) {
			var partCt = 1;
			var depCt = indivCt-2;
		} else {
			var partCt = 0;
			var depCt = indivCt-1;
		};
		
		//checks to see what plans are available to all individuals
		var initPlanCt = respArray[0].length;
		var availablePlans = respArray[0];
		var displayData = new Array();
		
		for (var i=0; i < initPlanCt; i++){
			var planIds = new Array();
			for (var j = 1; j < indivCt; j++){
				famPlanCt = respArray[j].length;
				for (var k = 0; k < famPlanCt; k++){
					planIds.push(respArray[j][k].id);
				};
			};
			if (planIds.includes(availablePlans[i].id) == -1){
				availablePlans.splice(i, 1);
			};
		};
		
		//creates an array of data to be displayed and sums totals for each plan
		var availablePlansCt = availablePlans.length;
		var displayData = new Array();
		
		for (var i = 0; i < availablePlansCt; i++) {
			rateSum = parseFloat(availablePlans[i].individualrate);
			for (var j = 1; j < indivCt; j++){
				famPlanCt = respArray[j].length;
				for (var k = 0; k < famPlanCt; k++){
					if (availablePlans[i].planid == respArray[j][k].planid){
						rateSum += parseFloat(respArray[j][k].individualrate);
					}
				};
			};
			displayData.push({
				planid: availablePlans[i].planid,
				rate: rateSum.toFixed(2)
			});
		};
	
		display(displayData);
	});
};
		
////	
//Building responses for each individual
////
function buildResps(formArray, callback) {
	
	var indivCt = ((formArray.length - 1) / 3);
	var counter = 0;
	var respArray = new Array();
	
	//call service for pp
	var ppResp = callQsService(getAge(formArray[2].value), formArray[3].value, function(respData){
		counter += 1;
		respArray.push(respData);
		if (counter == indivCt) {
			callback(respArray);
			return true;
		};
	});

	//call service for partner
	if (document.getElementById("partDOB")) {
		formIterator += 1;
		var partResp = callQsService(getAge(formArray[5].value), formArray[6].value, function(respData){
			counter += 1;
			respArray.push(respData);	
			if (counter == indivCt) {
				callback(respArray);
				return true;
			};
		});
	};

	//call service for dependents
	if (document.getElementById("depDOB")) {
		var depCt = document.getElementsByClassName("depDOB").length;
		formIterator += 1;		
		var depResp1 = callQsService(getAge(formArray[3*formIterator+2].value), formArray[3*formIterator+3].value, function(respData){
			counter += 1;
			respArray.push(respData);	
			if (counter == indivCt) {
				callback(respArray);
				return true;
			};
		});
	
		if (depCt >= 2) {
			formIterator += 1;
			var depResp2 = callQsService(getAge(formArray[3*formIterator+2].value), formArray[3*formIterator+3].value, function(respData){
				counter += 1;
				respArray.push(respData);	
				if (counter == indivCt) {
					callback(respArray);
					return true;
				};
			});
		
			if (depCt >= 3) {
				formIterator += 1;				
				var depResp3 = callQsService(getAge(formArray[3*formIterator+2].value), formArray[3*formIterator+3].value, function(respData){
					counter += 1;
					respArray.push(respData);	
					if (counter == indivCt) {
						callback(respArray);
						return true;
					};
				});
			
				if (depCt >= 4) {
					formIterator += 1;					
					var depResp4 = callQsService(getAge(formArray[3*formIterator+2].value), formArray[3*formIterator+3].value, function(respData){
						counter += 1;
						respArray.push(respData);	
						if (counter == indivCt) {
							callback(respArray);
							return true;
						};
					});
				};
			};
		};
	};
};

function callQsService(age, tobacco, callback){
	
	var request = new XMLHttpRequest();
	
	var url = "http://localhost:3000/plans/quickscreen?zip=" + localStorage.getItem("qsZip") + "&county=" + localStorage.getItem("qsCounty") + "&state=" + localStorage.getItem("qsState") + "&ratingarea=" + localStorage.getItem("qsRatingArea") + "&age=" + age + "&tobacco=" + tobacco + "&dental=No";

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
		var respData = response.data;
		callback(respData);
		return true;
    };	
};