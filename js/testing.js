window.onload = function(){
	wrapper2();
};

function wrapper(){
	console.log("do work before");
	doTimelyWork(doWorkAfter);
}

function wrapper2() {
	console.log("do work before");
	doTimelyWork(function (){
		doMoreTimelyWork(function() {
			doWorkAfter();
		});
	});
}

function doTimelyWork(callback){
	setTimeout(function(){
		console.log("do timely work");
		callback();
	}, 500);
}

function doMoreTimelyWork(callback){
	setTimeout(function(){
		console.log("do more timely work");
		callback();
	}, 500);
}

function doWorkAfter(){
	console.log("do work after");
}

