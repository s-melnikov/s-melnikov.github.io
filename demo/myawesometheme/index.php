<?php
/**
 * The main template file.
 *
 * This is the most generic template file in a WordPress theme
 * and one of the two required files for a theme (the other being style.css).
 * It is used to display a page when nothing more specific matches a query.
 * E.g., it puts together the home page when no home.php file exists.
 * Learn more: http://codex.wordpress.org/Template_Hierarchy
 *
 * @package MyAwesomeTheme
 */

get_header() ?>

<section class="main">
	<div class="container">
		<div class="row">
			<div class="col-xs-17">
				
				<?php if ( have_posts() ) : ?>

					<?php while ( have_posts() ) : the_post(); ?>

						<?php

							/*
							 * Include the Post-Format-specific template for the content.
							 * If you want to override this in a child theme, then include a file
							 * called content-___.php (where ___ is the Post Format name) and that will be used instead.
							 */
							get_template_part('template-parts/content', get_post_format());
						?>

					<?php endwhile; ?>
					

					<?php the_posts_navigation(); ?>

				<?php else : ?>
					
					<?php get_template_part( 'template-parts/content', 'none' ); ?>

				<?php endif; ?>	
					
			</div>						
			<div class="col-xs-7 sidebar">

				<?php get_sidebar(); ?>

			</div>
			
		</div>
	</div>	

</section>

<?php get_footer() ?>