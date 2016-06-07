/*global $*/
console.log("Loading " + window.location);
var colours = ["yellow","orange","green","pink","red","blue","grey","purple"];
var name="unknown";
var prevTimeout=0;
$(document).ready(function() {
	console.log("Document loaded, waiting for maps");
	var svgDoc = document.getElementById("floor");
	$("#btn_clear").click(function() {
		if (confirm("Are you sure you want to clear this floor?")) {
			var paths = svgDoc.contentDocument.getElementsByTagName("path");
			editFloor("");
			for (var i=0;i<paths.length;i++) {
				paths[i].setAttribute("fill","");
			}
		}
	});
	$("#btn_random").click(function() {
		var paths = svgDoc.contentDocument.getElementsByTagName("path");
		randomizeFloor(paths);
		notifyChange(paths);
	});
	svgDoc.addEventListener("load",function(){
		console.log("Map loaded, initializing");
		init(svgDoc.contentDocument);
    });
});
function newFloor(name,level,json) {
	var floor = new Object();
	floor.name=name;
	floor.level=level;
	floor.json=json;
	$.ajax({
		type: "POST",
		url: "/floors",
		data: {floor},
		datatype:"html",
		success: function(data) {
			// console.log("New floor [" + name + "] created with json " + json);
		},
		async:   true
	});  
}
function editFloor(json) {
	clearTimeout(prevTimeout);
	$("#loadicon_img").css("display","block");
	var floor = new Object();
	floor.name=name;
	floor.json = json;
	$.ajax({
    type: "POST",
    url: window.location.pathname.replace("/edit",""), 
    data: {floor,_method:"PATCH"},
    datatype:"html",
    success: function(data) {
    	prevTimeout = setTimeout(function() {
    		$("#loadicon_img").css("display","none");
    	},1);
        // console.log("Floor [" + name + "] updated with json " + json);
    },
    async:   true
  });  
}
function getFloor(paths) {
	$.ajax({
		type: "get",
		url: window.location.pathname.replace("/edit","") + "?json=1",
		success: function(response) {
			console.log(response);
			name = response.name;
			if (response.json.length<5) {
				return;
			}
			var rooms = JSON.parse(response.json);
			//Level inequality check was here, not sure why
			for (var i=0;i<paths.length;i++) {
				paths[i].setAttribute("fill",rooms[i]);
			}
		},
		async:   true
	});  
}

function notifyChange(paths) {
	var colours = {};
	for (var i=0;i<paths.length;i++) {
		colours[i] = paths[i].getAttribute("fill");
	}
	editFloor(JSON.stringify(colours));
}
function randomizeFloor(paths) {
	for (var i=0;i<paths.length;i++) {
		paths[i].setAttribute("fill",colours[Math.floor(Math.random()*colours.length)]);
	}
}

function init(svgDoc,level) {
	console.log("Initializing " + window.location.pathname.replace("/edit",""));
	console.log(svgDoc);
	var paths = svgDoc.getElementsByTagName("path");
	getFloor(paths);
	for (var i=0;i<paths.length;i++) {
		paths[i].addEventListener("click",function(v){
			if (window.location.pathname.endsWith("edit")){
				var current = v.toElement.getAttribute("fill");
				var next = colours.indexOf(current);
				v.toElement.setAttribute("fill",colours[next%colours.length+1]);
				notifyChange(paths);
			} else {
				$("#noteditwarning").css("display","inline");
				setTimeout(function() {$("#noteditwarning").css("display","none")},2000);
			}
		});
		paths[i].addEventListener("contextmenu",function(v){
			if (window.location.pathname.endsWith("edit")){
				var current = v.toElement.getAttribute("fill");
				var next = colours.indexOf(current);
				next=next==-1?colours.length-1:next-1;
				v.toElement.setAttribute("fill",colours[next]);
				notifyChange(paths);
				v.preventDefault();
				v.stopPropagation();
				return false;
			} else {
				$("#noteditwarning").css("display","inline");
				setTimeout(function() {$("#noteditwarning").css("display","none")},2000);
			}
		});
	}
	svgDoc.addEventListener("contextmenu",function(v){
		v.preventDefault();
		v.stopPropagation();
		return false;
	});
}