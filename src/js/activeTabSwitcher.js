/*
* Author:      Marco Kuiper (http://www.marcofolio.net/)
*/
google.load("jquery", "1.3.1");
google.setOnLoadCallback(function()
{
	// Just for demonstration purposes, change the contents/active state using jQuery
	$("#menu_tabs ul li").click(function(e) {
		e.preventDefault();
		
		$("#menu_tabs ul li").each(function() {
			$(this).removeClass("active");	
		});
		
		$(this).addClass("active");
		
		$("h3").html($(this).attr("title"));
	});
});