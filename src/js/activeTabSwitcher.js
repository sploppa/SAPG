/*
* Author: Marco Kuiper (http://www.marcofolio.net/)
*/
google.load("jquery", "1.3.1");
google.setOnLoadCallback(function(){
	$("#menu_tabs table tr td").click(function(e) {
		e.preventDefault();
		
		$("#menu_tabs table tr td").each(function() {
			$(this).removeClass("active");	
		});
		
		$(this).addClass("active");
		
		$("h3").html($(this).attr("title"));
		
			if($("#ctrl").hasClass("active")){
				$("#steuerung").show();
				$("#doseSetting").show();
		   		$(".menu_dosen_table").show();
			}else{
				$("#steuerung").hide();
				$("#doseSetting").hide();
		 	 	$(".menu_dosen_table").hide();
			}
	});
	
	$(".menu_dosen_table tr td").click(function(e){
		e.preventDefault();
		
		$(".menu_dosen_table tr td").each(function() {
			$(this).removeClass("active");	
		});
		
		$(this).addClass("active");
		
		$("h3").html($(this).attr("title"));
		
			if($("#ctrl").hasClass("active")){
				$("#steuerung").show();
				$("#doseSetting").show();
		   		$(".menu_dosen_table").show();
			}else{
				$("#steuerung").hide();
				$("#doseSetting").hide();
		 	 	$(".menu_dosen_table").hide();
			}
	});
	
	$(document).ready(function() {
		// Set default to "#steuerung"
		$(".actions div").hide();
		$("#steuerung").show();
		$("#doseSetting").show();

		// change div on click
	    $("td.tabs a").click(function() {
	        $(".actions div").hide();
	        $($(this).attr("href")).show();
			if($("#ctrl").hasClass("active")){
				$("#steuerung").show();
				$("#doseSetting").show();
		   		$(".menu_dosen_table").show();
			}else{
				$("#steuerung").hide();
				$("#doseSetting").hide();
		 	 	$(".menu_dosen_table").hide();
			}
	    });
	});
});

