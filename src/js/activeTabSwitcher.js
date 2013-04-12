/*
* Author: Marco Kuiper (http://www.marcofolio.net/)
*/
google.load("jquery", "1.3.1");
google.setOnLoadCallback(function(){	
	$(document).ready(function() {
		// Set default 
                      $(".actions").hide();
                      $("#steuerung").hide();
                      $("#administration").hide();
                      
                      if ((navigator.userAgent.match(/iPhone/)) || (navigator.userAgent.match(/iPod/))) {
                        $("#menu").css("bottom","1em");
                      }
                      
                      if (navigator.userAgent.match(/Android/)) {
                      }
		// change the menu header on click
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
        $(".dosen .tabs").click(function(){
                                if($(this).hasClass("active")){
                                $(this).removeClass("active");
                                
                                $("#doseSetting").hide();
                                }else{
                                $(".dosen .tabs").removeClass("active");
                                $(this).addClass("active");
                                $("#doseSetting").attr("value",$(this).attr("id"));
                                checkDosenSetting($(this).attr("id"));
                                $("#doseSetting").show();
                                }

        });
	});
});

