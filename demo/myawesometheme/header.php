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
						<form class="search" method="s">
							<input type="text" id="search" name="s">
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