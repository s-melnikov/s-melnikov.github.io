<?php
/**
 * The header for our theme.
 *
 * Displays all of the <head> section and everything up till <div id="content">
 *
 * @package MyAwesomeTheme
 */

?><!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
	<title>Заголовок</title>
	<meta charset="<?php bloginfo( 'charset' ); ?>">
	<link rel="profile" href="http://gmpg.org/xfn/11">
	<link rel="pingback" href="<?php bloginfo( 'pingback_url' ); ?>">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<link rel="shortcut icon" href="favicon.png">
	<?php wp_head(); ?>
</head>
<body <?php body_class() ?>>

	<header>
		<div class="top_head_wraper">
			<div class="container">
				<div class="row">
					<div class="col-md-14 col-xs-14">
						<a href="<?php echo esc_url(home_url('/')) ?>" rel="home">
							<div class="top_logo">
								<img src="<?php echo get_template_directory_uri() ?>/img/photo.png" alt="">
							</div>
							<div class="top_text">
								<h1><?php bloginfo('name') ?></h1>
								<span><?php bloginfo('description') ?></span>
							</div>
						</a>						
					</div>
					<div class="col-md-10 col-xs-10 right">
						<ul>
							<li><a href="#" class="lang uk"><span></span></a></li>
							<li><a href="#" class="lang yi"><span></span></a></li>
							<li><a href="#" class="lang ru"><span></span></a></li>
							<li><a href="#" class="lang other"><span></span></a></li>
						</ul>
						<ul class="social">
							<li><span>Присоединиться:</span></li>
							<li><a href="#" class="fb"></a></li>
							<li><a href="#" class="tw"></a></li>
							<li><a href="#" class="yt"></a></li>
						</ul>
						<form class="search">
							<input type="text" id="search">
							<label for="search"><span class="icon-search"></span>Поиск</label>
							<button><span></span></button>
						</form>
					</div>
				</div>
			</div>
		</div>
		<nav class="main_menu">
			<div class="container">
				<?php wp_nav_menu(array('theme_location' => 'primary', 'menu_id' => 'primary-menu')); ?>
			</div>
		</nav>
	</header>

	<?php if (is_front_page()): ?>

		<!-- Caorusel -->
	<div id="carousel" class="carousel slide" data-ride="carousel">
		<!-- Indicators -->
		<ol class="carousel-indicators">
			<li data-target="#carousel" data-slide-to="0" class="active"></li>
			<li data-target="#carousel" data-slide-to="1"></li>
			<li data-target="#carousel" data-slide-to="2"></li>
		</ol>
		<!-- Wrapper for slides -->
		<div class="carousel-inner" role="listbox">
			<div class="item active" style="background-image: url(<?php echo get_site_url() ?>/wp-content/uploads/2015/07/slider_1.jpg)">
				<div class="title">
					<div class="container">
						Тель-Авив и Иерусалим ударят по карману интуристов
					</div>
				</div>
				<div class="carousel-caption">
					<div class="container">
						<p>Тель-Авив и Иерусалим дороговаты не только для местных жителей, но и для иностранцев. По данным исследования ECA International, эти города находятся на 24 и 25 месте в мире по уровню цен на все товары и услуги, которые необходимы обычному туристу из-за рубежа.</p>
						<a href="#" class="readmore">Подробнее</a>
					</div>
				</div>
			</div>
			<div class="item" style="background-image: url(<?php echo get_site_url() ?>/wp-content/uploads/2015/07/slider_2.jpg)">
				<div class="title">
					<div class="container">
						Тель-Авив и Иерусалим ударят по карману интуристов
					</div>
				</div>
				<div class="carousel-caption">
					<div class="container">
						<p>Тель-Авив и Иерусалим дороговаты не только для местных жителей, но и для иностранцев. По данным исследования ECA International, эти города находятся на 24 и 25 месте в мире по уровню цен на все товары и услуги, которые необходимы обычному туристу из-за рубежа.</p>
						<a href="#" class="readmore">Подробнее</a>
					</div>
				</div>
			</div>
			<div class="item" style="background-image: url(<?php echo get_site_url() ?>/wp-content/uploads/2015/07/slider_3.jpg)">
				<div class="title">
					<div class="container">
						Тель-Авив и Иерусалим ударят по карману интуристов
					</div>
				</div>
				<div class="carousel-caption">
					<div class="container">
						<p>Тель-Авив и Иерусалим дороговаты не только для местных жителей, но и для иностранцев. По данным исследования ECA International, эти города находятся на 24 и 25 месте в мире по уровню цен на все товары и услуги, которые необходимы обычному туристу из-за рубежа.</p>
						<a href="#" class="readmore">Подробнее</a>
					</div>
				</div>
			</div>
		</div>
		<!-- Controls -->
		<a class="left carousel-control" href="#carousel" role="button" data-slide="prev">
			<span class="icon-prev" aria-hidden="true"></span>
			<span class="sr-only">Previous</span>
		</a>
		<a class="right carousel-control" href="#carousel" role="button" data-slide="next">
			<span class="icon-next" aria-hidden="true"></span>
			<span class="sr-only">Next</span>
		</a>
	</div>
	<!-- End carousel -->

	<?php endif ?>