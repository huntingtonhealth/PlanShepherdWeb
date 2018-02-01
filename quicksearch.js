window.onload = function(){
	
	var request = new XMLHttpRequest();
		
	var url = "http://localhost:3000/plans/quickscreen?zip=" + localStorage.getItem("qsZip") + "&county=22071&state=LA&ratingarea=1&age=29&tobacco=" + localStorage.getItem("qsSmoke") + "&dental=" + localStorage.getItem("qsDental")
		
	request.onreadystatechange = function() {
    	if (this.readyState === 4 && this.status === 200) {
        	var response = JSON.parse(this.responseText);
        	getElements(response);
    	};
	};
		
	request.open("GET", url, true);
	request.send();
	
    getElements = function(response) {
		console.log(response);
		var respData = response.data;
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