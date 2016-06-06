/*global $*/

console.log("Loading " + window.location);
var colours = ["yellow","orange","green","pink","red","blue","grey","purple"];
var name="unknown";
$(document).ready(function() {
	console.log("Document loaded, waiting for maps")
	var svgDoc = document.getElementById("floor");
	$("#random").click(function() {
		var paths = svgDoc.contentDocument.getElementsByTagName("path");
		randomizeFloor(paths);
		notifyChange(paths);
	})
	svgDoc.addEventListener("load",function(){
		console.log("Map loaded, initializing");
		init(svgDoc.contentDocument);
    });
})
function newFloor(name,json) {
	var floor = new Object();
	floor.name=name;
	floor.json = json;
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
	var floor = new Object();
	floor.name=name;
	floor.json = json;
	$.ajax({
    type: "POST",
    url: window.location.pathname, 
    data: {floor,_method:"PATCH"},
    datatype:"html",
    success: function(data) {
        // console.log("Floor [" + name + "] updated with json " + json);
    },
    async:   true
  });  
}
function getFloor(paths,level) {
	var rtn=true;
	$.ajax({
		type: "get",
		url: window.location.pathname + "?json=1",
		success: function(response) {
			console.log(response);
			var rooms = JSON.parse(response.json);
			name = response.name;
			if (response.level!=level) {
				rtn=false;
			}
			for (var i=0;i<paths.length;i++) {
				paths[i].setAttribute("fill",rooms[i])
			}
		},
		async:   true
	});  
}

function notifyChange(paths) {
	var colours = {}
	for (var i=0;i<paths.length;i++) {
		colours[i] = paths[i].getAttribute("fill");
	}
	editFloor(JSON.stringify(colours));
}
function randomizeFloor(paths) {
	for (var i=0;i<paths.length;i++) {
		paths[i].setAttribute("fill",colours[Math.floor(Math.random()*colours.length)])
	}
}

function init(svgDoc,level) {
	console.log("Initializing " + window.location.pathname);
	console.log(svgDoc)
	var paths = svgDoc.getElementsByTagName("path");
	getFloor(paths)
	for (var i=0;i<paths.length;i++) {
		paths[i].addEventListener("click",function(v){
			var current = v.toElement.getAttribute("fill");
			var next = colours.indexOf(current);
			v.toElement.setAttribute("fill",colours[next%colours.length+1]);
			notifyChange(paths);
		});
		paths[i].addEventListener("contextmenu",function(v){
			var current = v.toElement.getAttribute("fill");
			var next = colours.indexOf(current);
			next=next==-1?colours.length-1:next-1;
			v.toElement.setAttribute("fill",colours[next]);
			notifyChange(paths);
			v.preventDefault();
			v.stopPropagation();
			return false;
		})
	}
	svgDoc.addEventListener("contextmenu",function(v){
		v.preventDefault();
		v.stopPropagation();
		return false;
	})
}
