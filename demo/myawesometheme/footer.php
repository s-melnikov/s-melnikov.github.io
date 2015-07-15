<?php
/**
 * The template for displaying the footer.
 *
 * Contains the closing of the #content div and all content after
 *
 * @package MyAwesomeTheme
 */
?>

	<footer>
		<div class="container">
			<div class="row">
				<div class="col-md-8 col-xs-8">
					<nav>
						<h3>Навигация</h3>
						<ul>
							<li><a href="_index.php">Главная</a></li>
							<li><a href="donation.php">Пожертвования</a></li>
							<li><a href="#">Присоединиться</a></li>
							<li><a href="press.php">Пресса</a></li>
							<li><a href="speeches.php">Выступления</a></li>
							<li><a href="blog.ph">Блог</a></li>
							<li><a href="about_me.php">Обо мне</a></li>
							<li><a href="bills.php">Заканопроекты</a></li>
							<li><a href="job.php">Работа в комиссиях</a></li>
						</ul>
					</nav>
				</div>
				<div class="col-md-8 col-xs-8 subscribe">
					<nav>
						<h3>Подписывайтесь</h3>
						<ul>
							<li><a href="#"><span class="icon-twitter"></span> Twitter</a></li>
							<li><a href="#"><span class="icon-facebook"></span> Facebook</a></li>
							<li><a href="#"><span class="icon-rss"></span> RSS</a></li>
						</ul>
					</nav>
				</div>
				<div class="col-md-8 col-xs-8 contacts">
					<nav>
						<h3>Контакты</h3>
						<ul>
							<li class="menu-item"><span class="icon-home"></span> <span class="block">Иерусалим, <br> 9195016, Израиль</span></li>
							<li class="menu-item"><span class="icon-tel"></span> <span class="block">Телефон: +0 00 000 000 <br>Факс:  +0 00 000 000</span></li>							
						</ul>
					</nav>
				</div>
			</div>
			<div class="copyright">Copyright © 2015 | Privacy Policy</div>
		</div> 
	</footer>

	<!--[if lt IE 9]>
	<script src="<?php echo get_template_directory_uri() ?>/libs/html5shiv/es5-shim.min.js"></script>
	<script src="<?php echo get_template_directory_uri() ?>/html5shiv/html5shiv.min.js"></script>
	<script src="<?php echo get_template_directory_uri() ?>/html5shiv/html5shiv-printshiv.min.js"></script>
	<script src="<?php echo get_template_directory_uri() ?>/respond/respond.min.js"></script>
	<![endif]-->

	<script>
	window.twttr = (function(d, s, id) {
  	var js, fjs = d.getElementsByTagName(s)[0],
    t = window.twttr || {};
	  if (d.getElementById(id)) return t;
	  js = d.createElement(s);
	  js.id = id;
	  js.src = "https://platform.twitter.com/widgets.js";
	  fjs.parentNode.insertBefore(js, fjs);	 
	  t._e = [];
	  t.ready = function(f) {
	    t._e.push(f);
	  };	 
	  return t;
	}(document, "script", "twitter-wjs"));
	</script>

	<div id="fb-root"></div>
	<script>
		(function(d, s, id) {
		  var js, fjs = d.getElementsByTagName(s)[0];
		  if (d.getElementById(id)) return;
		  js = d.createElement(s); js.id = id;
		  js.src = "//connect.facebook.net/ru_RU/sdk.js#xfbml=1&version=v2.4";
		  fjs.parentNode.insertBefore(js, fjs);
		}(document, 'script', 'facebook-jssdk'));
	</script>

	<!-- Yandex.Metrika counter --><!-- /Yandex.Metrika counter -->
	<!-- Google Analytics counter --><!-- /Google Analytics counter -->

<?php wp_footer(); ?>

</body>
</html>
