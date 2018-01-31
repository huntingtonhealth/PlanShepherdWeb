window.onload = function(){
	
	var request = new XMLHttpRequest();
		
	var url = "http://localhost:3000/plans/quickscreen?zip=" + localStorage.getItem("qsZip") + "&county=22071&state=LA&ratingarea=1&age=29&tobacco=" + localStorage.getItem("qsSmoke") + "&dental=" + localStorage.getItem("qsDental")
	
	document.getElementById("content").innerHTML = url
	
	request.onreadystatechange = function() {
	      if (this.readyState === 4 && this.status === 200) {
	        var response = this.responseText;
	        getElements(response);
	      }
	    }
		
	request.open("GET", url, true);
	request.send();
	
    getElements = function(response) {
		console.log(response);
    }
	
};