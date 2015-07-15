<?php
/**
 * The template for displaying all pages.
 *
 * This is the template that displays all pages by default.
 * Please note that this is the WordPress construct of pages
 * and that other 'pages' on your WordPress site will use a
 * different template.
 *
 * @package MyAwesomeTheme
 */

get_header(); ?>

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

<section class="main">
	<div class="container">
		<div class="row">
			<div class="col-xs-17">
				<?php while ( have_posts() ) : the_post(); ?>
					<?php get_template_part( 'template-parts/content', 'page' ); ?>
					<?php
						if ( comments_open() || get_comments_number() ) :
							comments_template();
						endif;
					?>
				<?php endwhile; // End of the loop. ?>
			</div>	

			<div class="col-xs-7 sidebar">
				<?php get_sidebar(); ?>
			</div>
		</div>
	</div>	

</section>

<?php get_footer(); ?>
