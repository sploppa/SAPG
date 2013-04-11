/*
* Author: Marco Kuiper (http://www.marcofolio.net/)
*/
google.load("jquery", "1.3.1");
google.setOnLoadCallback(function(){	
	$(document).ready(function() {
		// Set default to "#steuerung"

		// change div on click
	    $(".header .tabs").click(function() {
	    	if($(this).hasClass("active")){
	    		$(this).removeClass("active");
	    		
	    		//$("#menu").removeClass("hide");
	    		//$("#menu").addClass("show");
	    		$(".actions").slideUp();
	    	}else{
	    		$(".header .tabs").removeClass("active");
	      		$(this).addClass("active");
	      		
	    		//$("#menu").removeClass("show");
	    		//$("#menu").addClass("hide");
	    		
	    		$(".actions").slideDown();
	      	}
	    });
	});
});

