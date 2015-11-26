$(function() {

	$(window).on("hashchange",function(){
		$("[href^='#']")
			.removeClass("active")
			.filter("[href='"+location.hash+"']")
			.addClass("active");
	});

	$(".popup_content").magnificPopup({
		type:'inline', 
		midClick: true
	});
	
	$(".toggle-menu").click(function() {
		$(this).toggleClass("on");
		$(".menu_modal").slideToggle();
	});
	
	/*$(".gallery-item").each(function(i) {
		$(this).find("a").attr("href", "#work_" + i);
		$(this).find(".gal-descr").attr("id", "work_" + i);
	});*/
	//Цели для Яндекс.Метрики и Google Analytics
	
	//SVG Fallback
	if(!Modernizr.svg) {
		$("img[src*='svg']").attr("src", function() {
			return $(this).attr("src").replace(".svg", ".png");
		});
	};

	//Аякс отправка форм
	//Документация: http://api.jquery.com/jquery.ajax/
	$(".form").submit(function() {
		$.ajax({
			type: "POST",
			url: "mail.php",
			data: $(this).serialize()
		}).done(function() {
			alert("Спасибо за заявку!");
			setTimeout(function() {
				$(".form").trigger("reset");
			}, 1000);
		});
		return false;
	});

	//Chrome Smooth Scroll
	
	$("img, a").on("dragstart", function(event) { event.preventDefault(); });
	
});

$(window).load(function() {

	$(".loader_inner").fadeOut();
	$(".loader").delay(400).fadeOut("slow");

});
