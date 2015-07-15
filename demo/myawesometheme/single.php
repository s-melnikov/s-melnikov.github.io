<?php
/**
 * The template for displaying all single posts.
 *
 * @package MyAwesomeTheme
 */

get_header(); ?>

<section class="main">
	<div class="container">
		<div class="row">
			<div class="col-xs-17">
				
				<?php while ( have_posts() ) : the_post(); ?>

					<?php get_template_part( 'template-parts/content', 'single' ); ?>

					<?php the_post_navigation(); ?>

					<?php
						// If comments are open or we have at least one comment, load up the comment template.
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

<?php get_footer() ?>
