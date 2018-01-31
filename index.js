function quickSearchSubmit() {
	// Getting the value of your text input
    var qsZip = document.getElementById("qsZip").value;
    var qsDOB = document.getElementById("qsDOB").value;
	if (document.getElementById("qsSmoke").checked) {
		var qsSmoke = "Yes";
		console.log("Yes");
	} else {
		var qsSmoke = "No";
		console.log("No");
	}
	if (document.getElementById("qsDental").checked) {
		var qsDental = "Yes";
		console.log("Yes");
	} else {
		var qsDental = "No";
		console.log("No");
	}	

    // Storing the value above into localStorage
    localStorage.setItem("qsZip", qsZip);
    localStorage.setItem("qsDOB", qsDOB);
    localStorage.setItem("qsSmoke", qsSmoke);
    localStorage.setItem("qsDental", qsDental);
	
	window.location.href = "quicksearch.html";
	return true;
}