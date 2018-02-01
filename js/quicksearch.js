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
		
		//dynamically create table based on results
		var tr = "<table><tr><th>Plan Marketing Name</th><th>Individual Rate</th></tr>";
		for (var i = 0; i < respData.length; i++) {
			tr += ("<tr>");
			tr += ("<td>" + respData[i].planmarketingname + "</td>");
			tr += ("<td>" + respData[i].individualrate + "</td>");
			tr += ("</tr>");
		};
		tr += "</table>"
		
		document.getElementById("tabledata").innerHTML = tr;
    };	
};