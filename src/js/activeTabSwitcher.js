/*
* Author: Marco Kuiper (http://www.marcofolio.net/)
*/
google.load("jquery", "1.3.1");
google.setOnLoadCallback(function(){
	// Just for demonstration purposes, change the contents/active state using jQuery
	//$("#menu_tabs ul li").click(function(e) {
	$("#menu_tabs table tr td").click(function(e) {
		e.preventDefault();
		
		$("#menu_tabs table tr td").each(function() {
			$(this).removeClass("active");	
		});
		
		$(this).addClass("active");
		
		$("h3").html($(this).attr("title"));
	});
	
	$(document).ready(function() {
		// Set default to "#steuerung"
		$(".actions div").hide();
		$("#steuerung").show();
		// change div on click
	    $("td.tabs a").click(function() {
	        $(".actions div").hide();
	        $($(this).attr("href")).show();
//	        var steuerung_left_column = $(this).attr("href") + '_left_column';
//	        var steuerung_right_column = $(this).attr("href") + '_right_column';
//	        $($(this).attr("href") + '_left_column').show();
//	        $($(this).attr("href") + '_right_column').show();
	    });
	});
});

