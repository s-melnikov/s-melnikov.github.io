var countdownEnd = new Date("18 May 2015 23:59");
var coutdownInterval;
var contactForm;

$(function(){

    coutdownInterval = (countdownEnd.getTime() - new Date().getTime()) / 1000;
    coutdownInterval = Math.floor(coutdownInterval > 0 ? coutdownInterval : 0);
    $('#countdown').FlipClock(coutdownInterval, {
        countdown: true,
        clockFace: 'DailyCounter'
    });
    $('#countdown_2').FlipClock(coutdownInterval, {
        countdown: true,
        clockFace: 'DailyCounter'
    });
    $('#countdown_3').FlipClock(coutdownInterval, {
        countdown: true,
        clockFace: 'DailyCounter'
    });

    var owl = $("#carousel");
    owl.owlCarousel({
        items : 5
    });
    $(".carousel_container .left").on("click", function() {
        owl.trigger('owl.prev');
    });
    $(".carousel_container .right").on("click", function() {        
        owl.trigger('owl.next');
    });

    $(window).on("scroll", function(){
        var scroll_top = 103;
        if ($(this).scrollTop() > scroll_top) {
            $("#main_nav .navbar").addClass("navbar-fixed-top");
        } else {
            $("#main_nav .navbar").removeClass("navbar-fixed-top");
        }
    });

    $('a[href^=#]:not([href=#])').on("click", function(e) {
        var target = $($(this).attr("href"));
        if (target.length) {
            $("#main_nav").find("li").removeClass("active");
            $(this).parent().addClass("active");
            $(window).scrollTop(target.offset().top - 40);
            e.preventDefault();
        }
    });

    $("#seo").html($("#hidden").html());

    $("[data-target=#order]").on("click", function(){
        $("#order").find("input[name=item]").val($(this).parents(".variant").find(".name").text());
    });

});

$(function(){

    var ajaxProcessing,
        ajaxUrl,
        form,
        formControl,
        subject;

    function send(ev){
        var data = {};
        formControl = form.find('input');

        for (var i = 0; i < formControl.length; i++) {
            var control = formControl.eq(i);
            data[control.attr('name')] = control.val();
        }

        data._subject_ = subject;

        if (!ajaxProcessing) {
            ajaxProcessing = true;
            console.log(data);
            $.post(ajaxUrl, data, onResponse);
        }
    }

    function onResponse(response){

        ajaxProcessing = false;
        formControl.not('[type=hidden]').each(function(){
            $(this).val("");
        });

        $("#modal_thanks").modal('show');

        if (form.parents(".modal").length)
            form.parents(".modal").modal("hide");

        if (response.status == 'error') {
            alert("Произошла ошибка, попробуйте позже.");
        }
    }

    $(function(){
        $("form[action]").on("submit", function(e){
            form = $(this);
            ajaxUrl = form.attr("action");
            subject = form.data("subject");
            send();
            e.preventDefault();
        });
    });

});