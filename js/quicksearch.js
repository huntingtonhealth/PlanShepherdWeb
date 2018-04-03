//////////////////////////
/// Page Load Function ///
//////////////////////////
window.onload = function(){
		
	var request = new XMLHttpRequest();
		
	var url = "http://localhost:3000/plans/quickscreen?zip=" + localStorage.getItem("qsZip") + "&county=" + localStorage.getItem("qsCounty") + "&state=" + localStorage.getItem("qsState") + "&ratingarea=" + localStorage.getItem("qsRatingArea") + "&age=" + localStorage.getItem("qsAge") + "&tobacco=" + localStorage.getItem("qsSmoke") + "&dental=" + localStorage.getItem("qsDental")
	
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
		
		//add recommended table class
		var recPlanTab = document.getElementById("recPlanData");
		var recPlan = new String();
		recPlan += render(respData[0]);
		
		//append to html div
	    planAdd = document.createElement('div');
		planAdd.innerHTML = recPlan;
		recPlanTab.appendChild(planAdd, recPlanTab.firstChild);
		
		//add each subsequent table
		var nextPlanTabs = document.getElementById("nextPlanData");
		
		for (var i = 1; i < respData.length; i++) {
			var nextPlan = new String();
			nextPlan += "<div class='other-result col-lg-12 text-center mt-2 mb-2'>";
			nextPlan += render(respData[i]);
			nextPlan += "</div>"
			
		    planAdd = document.createElement('div');
			planAdd.innerHTML = nextPlan;
			nextPlanTabs.appendChild(planAdd, nextPlanTabs.firstChild);
		};
    };	
};

function render(planData){
	resp = new String();
	
	if (localStorage.getItem("qsSmoke") == "No") {
		rate = planData.individualrate
		yrRate = planData.individualrate*12;
	} else {
		rate = planData.individualtobaccorate
		yrRate = planData.individualtobaccorate*12;
	}
	
	
	var mded = planData.mehbdedinntier1individual
	var mmoop = planData.mehbinntier1individualmoop
	var tded = planData.tehbdedinntier1individual
	var tmoop = planData.tehbinntier1individualmoop
	
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
	
	
	resp += ("<table class='results-table col-lg-12 mt-2'>" +
				"<tr><td colspan='12' class='text-left'><h3><b>" + planData.planmarketingname + "</b></h3><hr /></td></tr>" +
				"<tr><td colspan='3' class='text-left'><h5><u>Monthly Premium</u></h5>" +
					"<h5 class='inline'>$" + rate + "</h5> per month </td>" +
					"<td colspan='3' class='text-left'><h5><u>Deductible</u></h5>" +
					"<h5 class='inline'>" + ded + "</h5></td>" +
					"<td colspan='3' class='text-left'><h5><u>Maximum Out of Pocket</u></h5>" +
				    "<h5 class='inline'>" + moop + "</h5> per year </td>" +
					"<td colspan='3' class='text-right'><h5><u>Estimated Yearly Expense</u></h5>" +
				    "<h5 class='inline'>" + yrRate.toFixed(2) + "</h5> in 2019 </td></tr>" +
				"<tr><td colspan='12'><br /></td></tr>" +
				"<tr><td colspan='4'><h6><u>Plan Type</u></h6><h6>" + planData.plantype + "</h6></td>" +
					"<td colspan='4'><h6><u>Metal Level</u></h6><h6>" + planData.metallevel + "</h6></td>" +
					"<td colspan='4'><h6><u>Is HSA Eligible?</u></h6><h6>" + planData.ishsaeligible + "</h6></td></tr>" +
				"<tr><td colspan='12' class='text-right'><button class='m-2'>See More About This Plan</button></td></tr>" +
			"</table>");
	return resp;
}