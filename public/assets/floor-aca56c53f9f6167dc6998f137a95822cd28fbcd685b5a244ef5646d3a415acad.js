/*global $*/

console.log("Loading " + window.location);
var colours = ["yellow","orange","green","pink","red","blue","grey","purple"];
var debouncer = false;
// var debounce = setInterval(function() {
// 	if (debouncer) {
// 		return;
// 	}
$(document).ready(function() {
	
	var svgDoc = document.getElementById("floor2");
	svgDoc.addEventListener("load",function(){
		init(svgDoc.contentDocument);
    });
})
// 	var svgDoc = $("#floor2");
// 	console.log(svgDoc);
// 	if (svgDoc == undefined) {
// 		// console.log(svgDoc);
// 	} else {
// 		init(svgDoc.contentDocument);
// 	}
// },100)
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
function editFloor(name,json) {
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
function getFloor(paths) {
  $.ajax({
    type: "get",
    url: window.location.pathname + "?json=1", // should be mapped in routes.rb
    success: function(data) {
    	var rooms = JSON.parse(data.json);
		for (var i=0;i<paths.length;i++) {
			paths[i].setAttribute("fill",rooms[paths[i].id])
		}
	},
    async:   true
  });  
}
function notifyChange(paths) {
	var colours = {}
	for (var i=0;i<paths.length;i++) {
		colours[paths[i].id] = paths[i].getAttribute("fill");
	}
	editFloor("Floor wat",JSON.stringify(colours));
}
function init(svgDoc) {
	console.log("Initializing " + window.location.pathname);
	console.log(svgDoc)
	// clearInterval(debounce);
	// debouncer=true;
	var paths = svgDoc.getElementsByTagName("path");
	getFloor(paths);
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
