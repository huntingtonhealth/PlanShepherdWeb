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

// Function to screen family for premium subsidy/CSR/Medicaid eligibility
function callFPLService(nIndivs, callback){
	
	var request = new XMLHttpRequest();
	
	var url = "http://localhost:3000/fpls/index?familySize=" + nIndivs;

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
		console.log("FPL Serv Complete");
		callback(respData);
		return true;
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
	 
	var strAge = age.toString();
	if (age <= 14) {
		strAge = "0-14";
	}
	 
	return strAge;
};

// Count individuals in the group
function countIndivs() {
	indivCt = 1;
	if (document.getElementById("partDOB")) {
		indivCt += 1;
	}
	if (document.getElementById("depDOB")) {
		document.querySelectorAll('.depDOB').length;
	}
	return indivCt;
}

//////////////////////
///Modal Navigation///
//////////////////////
window.onload = function(){
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
			for (var i = 1; i <= 10; i++) {
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
			for (var i = 1; i <= 10; i++) {
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
	// If clicked button is to skip the medical info module, go to the next module
		else if (target.className.match(/medInfoSkip/))
		{
			var curModalStr = "modal" + modalNo;
			var curModal = document.getElementById(curModalStr);
			curModal.style.transition = "all 1s";
			curModal.style.opacity = 0;		
		
	// Bump all modals to the right	3 times
			for (var i = 1; i <= 10; i++) {
				var nextModalStr = "modal" + i;
				var nextModal = document.getElementById(nextModalStr);
				nextModal.style.transition = "all 1s";
				nextModal.style.transform = "translateX(-" + (modalNo+3)*100 + "%)";
			}

	// De-increment the modal number
			modalNo += 4;
		
	// Make current modal appear
			var curModalStr = "modal" + modalNo;
			var curModal = document.getElementById(curModalStr);
			curModal.style.transition = "all 1s";
			curModal.style.opacity = 1;			
		}
		
		return false;
	}
};

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

//Dynamic Update for Income Screening
document.getElementById("income").onblur = function() {
	
	var indivCt = countIndivs();
	var famIncome = parseInt(document.getElementById("income").value);
	callFPLService(indivCt, function(fplResp){
		
		// get correct 100% FPL Level and create APTC table
		if (localStorage.getItem("qsState") == "AK") {
			var fpl = fplResp[0].alaska;
		} else if (localStorage.getItem("qsState") == "HI") {
			var fpl = fplResp[0].hawaii;
		} else {
			var fpl = fplResp[0].contiguous;
		};
		
		// get expansion status
		nonExpStates = ["AL", "FL", "GA", "ID", "KS", "ME", "MS", "MO", "NE", "NC", "OK", "SC", "SD", "TN", "TX", "UT", "VA", "WI", "WY"];
		var medExp = new Boolean();
		if (nonExpStates.indexOf(localStorage.getItem("qsState")) == -1) {
			medExp = true;
		} else {
			medExp = false;
		};
		
		//Calculate APTC Amount
		maxSpend = new Array();
		maxSpend.push({
			bracketMin: 0,
			bracketMax: 1.38,
			bracketMinPerc: 2.0,
			bracketMaxPerc: 2.0
		})
		maxSpend.push({
			bracketMin: 1.38,
			bracketMax: 1.55,
			bracketMinPerc: 3.0,
			bracketMaxPerc: 4.0
		})
		maxSpend.push({
			bracketMin: 1.55,
			bracketMax: 2.05,
			bracketMinPerc: 4.0,
			bracketMaxPerc: 6.3
		})
		maxSpend.push({
			bracketMin: 2.05,
			bracketMax: 2.55,
			bracketMinPerc: 6.3,
			bracketMaxPerc: 8.05
		})
		maxSpend.push({
			bracketMin: 2.55,
			bracketMax: 3.05,
			bracketMinPerc: 8.05,
			bracketMaxPerc: 9.5
		})
		maxSpend.push({
			bracketMin: 3.05,
			bracketMax: 4.05,
			bracketMinPerc: 9.5,
			bracketMaxPerc: 9.5
		});
		
		fplPerc = famIncome / fpl;
		
		for (i = 0; i < maxSpend.length; i++) {
			if (fplPerc > maxSpend[i].bracketMin && fplPerc <= maxSpend[i].bracketMax) {
				if (maxSpend[i].bracketMinPerc == maxSpend[i].bracketMaxPerc) {
					appPerc = maxSpend[i].bracketMinPerc;	
				} else {
				appPerc = maxSpend[i].bracketMinPerc + ((fplPerc - maxSpend[i].bracketMin) / (maxSpend[i].bracketMax - maxSpend[i].bracketMin)) * (maxSpend[i].bracketMaxPerc - maxSpend[i].bracketMinPerc);
				};
			}
		}

		premiumMax = (famIncome * (appPerc / 100)) / 12;
		console.log(premiumMax.toFixed(2));
				
		//Logic for Expansion States
		// <138, 138-255, 255-405, 405+
		if (medExp == true) {
			if (famIncome <= fpl*1.38) {
				alert("Based on your home state and your family's income, the government should pay the full cost of your medical insurance through the Medicaid program. Log onto your state health department website or visit a local office to apply.");
			} else if (famIncome > fpl*1.38 && famIncome <= fpl*2.55) {
				alert("Based on your home state and your family's income, the government should pay part of the cost of your medical insurance. You should pay no more than " + premiumMax.toFixed(2) + " per month for your insurance. Additionally, your insurer is required to reduce your costs if/when you see the doctor.")
			} else if (famIncome > fpl*2.44 && famIncome <= fpl*4.05) {
				alert("Based on your home state and your family's income, the government should pay part of the cost of your medical insurance. You should pay no more than " + premiumMax.toFixed(2))
			} else {
				alert("Unfortunately, based on your home state and family's income, it does not appear that you are eligible for any government programs to help you pay for the cost of medical care.")
			};
			
		//Logic for non-expansion states
		} else {
			if (famIncome <= fpl*1.05) {
				alert("Unfortunately, because your state officials chose not to expand the Medicaid program, it does not appear that you are eligible for any government programs to help you pay for the cost of medical care.")
			} else if (famIncome > fpl*1.05 && famIncome <= fpl*2.55) {
				alert("Based on your home state and your family's income, the government should pay part of the cost of your medical insurance. You should pay no more than " + premiumMax.toFixed(2) + " per month for your insurance. Additionally, your insurer is required to reduce your costs if/when you see the doctor.")
			} else if (famIncome > fpl*2.44 && famIncome <= fpl*4.05) {
				alert("Based on your home state and your family's income, the government should pay part of the cost of your medical insurance. You should pay no more than " + premiumMax.toFixed(2))
			} else {
				alert("Unfortunately, based on your home state and family's income, it does not appear that you are eligible for any government programs to help you pay for the cost of medical care.")
			};
		};
		
	});		
};

/////////////////////
///Submit Function///
/////////////////////

function naviSubmit() {
	formIterator = 0;
	
	// This section includes a 4-layer callback function
	// buildResps takes formArray data and makes API calls using the QS Service, returns 2d array with plan data by individual dims
	// QS service makes API call and returns individual-level plan data
	// parseArray takes 2d array from buildResps and compiles into family-level data
	// display parses the family-level data and displays to the user.
	formArray = $("#naviForm").serializeArray();
	parseArray(formArray);
	
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
			//deductible and max out of pocket
			if (indivCt > 1){
				var mded = availablePlans[i].mehbdedinntier1familypergroup
				var mmoop = availablePlans[i].mehbinntier1familypergroupmoop
				var tded = availablePlans[i].tehbdedinntier1familypergroup
				var tmoop = availablePlans[i].tehbinntier1familypergroupmoop
			} else {
				var mded = availablePlans[i].mehbdedinntier1individual
				var mmoop = availablePlans[i].mehbinntier1individualmoop
				var tded = availablePlans[i].tehbdedinntier1individual
				var tmoop = availablePlans[i].tehbinntier1individualmoop
			}
			
			if (tded) {
				ded = tded
			} else {
				ded = mded
			}
			
			if (tmoop) {
				moop = tmoop
			} else {
				moop = mmoop
			}
			
			//premium rate
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
				planmarketingname: availablePlans[i].planmarketingname,
				rate: rateSum.toFixed(2),
				deductible: ded.split(" ")[0] + ".00",
				coins1: availablePlans[i].tehbdedinntier1coinsurance,
				coins2: availablePlans[i].tehbdedinntier2coinsurance,
				moop: moop.split(" ")[0] + ".00",
				plantype: availablePlans[i].plantype,
				metallevel: availablePlans[i].metallevel,
				hsa: availablePlans[i].ishsaeligible
			});
			
		};
	
		//add recommended table class
		var recPlanTab = document.getElementById("tabledata");
		var recPlan = new String();
	    recPlan += "<div class='results col-lg-12 text-center mt-5 mb-5 bc-blue-trans'>" +
				"<div class='text-left mt-2'><h5><i>Our top recommended plan for your is:</i></h5></div>" +
				"<div class='first-result col-lg-12 text-center mt-2 mb-2' id='recPlanData'>";
		recPlan += render(displayData[0]);
		recPlan += "</div><div class='text-left'><h5><i>Other plans for you include:</i></h5></div><div id='nextPlanData'></div>";
		
		//append to html div
		recPlanTab.innerHTML = "";
	    planAdd = document.createElement('div');
		planAdd.innerHTML = recPlan;
		recPlanTab.appendChild(planAdd, recPlanTab.firstChild);
		
		//add each subsequent table
		var nextPlanTabs = document.getElementById("nextPlanData");
		
		for (var i = 1; i < displayData.length; i++) {
			var nextPlan = new String();
			nextPlan += "<div class='other-result col-lg-12 text-center mt-2 mb-2'>";
			nextPlan += render(displayData[i]);
			nextPlan += "</div>";
			
			//add final div closure in last table (for "results" div set above)
			if (i == displayData.length - 1){
				nextPlan += "</div>";
			};
			
		    planAdd = document.createElement('div');
			planAdd.innerHTML = nextPlan;
			nextPlanTabs.appendChild(planAdd, nextPlanTabs.firstChild);
		};
		
	});
};

function render(planData){
	
	resp = new String();
	yrRate = planData.rate*12;
	
	resp += ("<table class='results-table col-lg-12 mt-2'>" +
				"<tr><td colspan='12' class='text-left'><h3><b>" + planData.planmarketingname + "</b></h3><hr /></td></tr>" +
				"<tr><td colspan='3' class='text-left'><h5><u>Monthly Premium</u></h5>" +
					"<h5 class='inline'>$" + planData.rate + "</h5> per month </td>" +
					"<td colspan='3' class='text-left'><h5><u>Deductible</u></h5>" +
					"<h5 class='inline'>" + planData.deductible + "</h5></td>" +
					"<td colspan='3' class='text-left'><h5><u>Maximum Out of Pocket</u></h5>" +
				    "<h5 class='inline'>" + planData.moop + "</h5> per year </td>" +
					"<td colspan='3' class='text-right'><h5><u>Estimated Yearly Expense</u></h5>" +
				    "<h5 class='inline'>" + yrRate.toFixed(2) + "</h5> in 2019 </td></tr>" +
				"<tr><td colspan='12'><br /></td></tr>" +
				"<tr><td colspan='4'><h6><u>Plan Type</u></h6><h6>" + planData.plantype + "</h6></td>" +
					"<td colspan='4'><h6><u>Metal Level</u></h6><h6>" + planData.metallevel + "</h6></td>" +
					"<td colspan='4'><h6><u>Is HSA Eligible?</u></h6><h6>" + planData.hsa + "</h6></td></tr>" +
				"<tr><td colspan='12' class='text-right'><button class='m-2'>See More About This Plan</button></td></tr>" +
			"</table>");
	return resp;
}