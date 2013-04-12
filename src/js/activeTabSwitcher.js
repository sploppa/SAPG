/*
* Author: Marco Kuiper (http://www.marcofolio.net/)
*/
google.load("jquery", "1.3.1");
google.setOnLoadCallback(function(){	
	$(document).ready(function() {
		// Set default to "#steuerung"
                      $(".actions").hide();
                      $("#steuerung").hide();
                      $("#administration").hide();
                      
                      if ((navigator.userAgent.match(/iPhone/)) || (navigator.userAgent.match(/iPod/))) {
                        alert("we've got an iDevice, Scotty");
                        $("#menu").css("bottom","1em");
                      }
                      
                      if (navigator.userAgent.match(/Android/)) {
                        alert("Droid me baby");
                      }
		// change div on click
	    $(".header .tabs").click(function() {
	    	if($(this).hasClass("active")){
	    		$(this).removeClass("active");
    
	    		$(".actions").slideUp();
	    	}else{
	    		$(".header .tabs").removeClass("active");
	      		$(this).addClass("active");
                                
                    if($(this).attr("id")=="ctrl"){
                       $("#administration").hide();
                       $("#steuerung").show();
                    }else{
                       $("#steuerung").hide();
                       $("#administration").show();
                    }
                                  $(".actions").slideDown();
	    		
	      	}
	    });
	});
});

