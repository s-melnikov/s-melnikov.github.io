<?php
/**
 * Template part for displaying single posts.
 *
 * @package MyAwesomeTheme
 */

?>

<div class="panel">
	<div class="panel-body">

		<article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>

			<?php the_title(sprintf('<h1 class="title"><a href="%s" rel="bookmark">', esc_url(get_permalink())), '</a></h1>'); ?>
			
			<?php # myawesometheme_posted_on(); ?>

			<div class="entry-content">
				<?php
					the_content(sprintf(
						/* translators: %s: Name of current post. */
						wp_kses( __('Continue reading %s <span class="meta-nav">&rarr;</span>', 'myawesometheme' ), array( 'span' => array( 'class' => array() ) ) ),
						the_title( '<span class="screen-reader-text">"', '"</span>', false )
					));
				?>

				<?php
					wp_link_pages( array(
						'before' => '<div class="page-links">' . esc_html__( 'Pages:', 'myawesometheme' ),
						'after'  => '</div>',
					) );
				?>
			</div>

			<div class="entry-footer">
				<?php myawesometheme_entry_footer(); ?>
			</div>
		</article>

	</div>
</div>