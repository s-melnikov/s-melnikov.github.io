<?php
/**
 * The template used for displaying page content in page.php
 *
 * @package MyAwesomeTheme
 */

?>
	
<?php if (is_front_page()): ?>
	<!-- Caorusel_Section-->
	<div class="s_slide_wrap">
		<div id="carousel_second" class="carousel">
			<!-- Indicators -->
			<ol class="carousel-indicators">
				<li data-target="#carousel_second" data-slide-to="0" class="active">
					<p>
						Масличная гора может быть включена в список объектов национального наследия
					</p>
				</li>
				<li data-target="#carousel_second" data-slide-to="1">
					<p>
						В пригороде Иерусалима горит кустарник: к тушению огня привлечена пожарная авиация
					</p>
				</li>
				<li data-target="#carousel_second" data-slide-to="2">
					<p>
						В Еврейском университете пройдет полуторачасовая забастовка
					</p>
				</li>
			</ol>

			<!-- Wrapper for slides -->
			<div class="carousel-inner" role="listbox">
				<div class="item active" style="background-image: url(/ksenia_wp/wp-content/uploads/2015/07/s_slide_1.jpg)">
					<div class="carousel-caption"></div>
				</div>
				<div class="item" style="background-image: url(/ksenia_wp/wp-content/uploads/2015/07/s_slide_2.jpg)">
					<div class="carousel-caption"></div>
				</div>
				<div class="item" style="background-image: url(/ksenia_wp/wp-content/uploads/2015/07/s_slide_3.jpg)">
					<div class="carousel-caption"></div>
				</div>
			</div>
		</div>
	</div>
	<div class="gallery_wrap">
		<!-- Nav tabs -->
		<ul class="nav nav-tabs nav-justified" role="tablist">
			<li role="presentation" class="active"><a href="#home" aria-controls="home" role="tab" data-toggle="tab">Фото</a></li>
			<li role="presentation"><a href="#profile" aria-controls="profile" role="tab" data-toggle="tab">Видео</a></li>
		</ul>

		<!-- Tab panes -->
		<div class="tab-content tab-bg">
			<div role="tabpanel" class="tab-pane active" id="home">
				<div class="gal_foto">
					<div class="big_foto">
						<img src="/ksenia_wp/wp-content/uploads/2015/07/gallery_foto_1.jpg">
						<div class="gallery_caption">
							<p>Побережье Тель-Авива</p>
						</div>
					</div>
					<div class="all_fotos">
						<div class="row">
							<div class="col-xs-8">
								<img src="/ksenia_wp/wp-content/uploads/2015/07/gallery_foto_1.jpg">
								<p>Побережье Тель-Авива</p>
							</div>
							<div class="col-xs-8">
								<img src="/ksenia_wp/wp-content/uploads/2015/07/gallery_foto_1.jpg">
								<p>Побережье Тель-Авива</p>
							</div>
							<div class="col-xs-8">
								<img src="/ksenia_wp/wp-content/uploads/2015/07/gallery_foto_1.jpg">
								<p>Побережье Тель-Авива</p>
							</div>
						</div>
						<div class="row">
							<div class="col-xs-8">
								<img src="/ksenia_wp/wp-content/uploads/2015/07/gallery_foto_1.jpg">
								<p>Побережье Тель-Авива</p>
							</div>
							<div class="col-xs-8">
								<img src="/ksenia_wp/wp-content/uploads/2015/07/gallery_foto_1.jpg">
								<p>Побережье Тель-Авива</p>
							</div>
							<div class="col-xs-8">
								<img src="/ksenia_wp/wp-content/uploads/2015/07/gallery_foto_1.jpg">
								<p>Побережье Тель-Авива</p>
							</div>
						</div>
						<div class="row">
							<div class="col-xs-8">
								<img src="/ksenia_wp/wp-content/uploads/2015/07/gallery_foto_1.jpg">
								<p>Побережье Тель-Авива</p>
							</div>
							<div class="col-xs-8">
								<img src="/ksenia_wp/wp-content/uploads/2015/07/gallery_foto_1.jpg">
								<p>Побережье Тель-Авива</p>
							</div>
							<div class="col-xs-8">
								<img src="/ksenia_wp/wp-content/uploads/2015/07/gallery_foto_1.jpg">
								<p>Побережье Тель-Авива</p>
							</div>
						</div>										
					</div>
				</div>
			</div>
			<div role="tabpanel" class="tab-pane" id="profile">
				<div class="gal_video">
					<div class="big_video">
						<iframe width="695" height="521" src="https://www.youtube.com/embed/7vZLkFwc6c0" frameborder="0" allowfullscreen></iframe>
					</div>
					<div class="all_fotos">
						<div class="row">
							<div class="col-xs-8">
								<iframe width="100%" height="175" src="https://www.youtube.com/embed/7vZLkFwc6c0" frameborder="0" allowfullscreen></iframe>
								<p>Побережье Тель-Авива</p>
							</div>
							<div class="col-xs-8">
								<iframe width="100%" height="175" src="https://www.youtube.com/embed/7vZLkFwc6c0" frameborder="0" allowfullscreen></iframe>
								<p>Побережье Тель-Авива</p>
							</div>
							<div class="col-xs-8">
								<iframe width="100%" height="175" src="https://www.youtube.com/embed/7vZLkFwc6c0" frameborder="0" allowfullscreen></iframe>
								<p>Побережье Тель-Авива</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
<?php endif ?>

<div class="panel">
	<div class="panel-body">
		<article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>

			<?php the_content(); ?>
				<?php
					wp_link_pages( array(
						'before' => '<div class="page-links">' . esc_html__('Pages:', 'myawesometheme' ),
						'after'  => '</div>',
				));
			?>

			<div class="entry-footer">
				<?php edit_post_link('Редактировать', '<span class="edit-link">', '</span>' ); ?>
			</div>
		</article>
	</div>
</div>