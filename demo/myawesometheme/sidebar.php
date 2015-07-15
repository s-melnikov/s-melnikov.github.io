<?php
/**
 * The sidebar containing the main widget area.
 *
 * @package MyAwesomeTheme
 */
?>

<?php if (is_front_page()): ?>
	<?php dynamic_sidebar('sidebar-front') ?>
<?php elseif(get_post_type() == 'post'): ?>
	<?php dynamic_sidebar('sidebar-blog') ?>
<?php else: ?>
	<?php dynamic_sidebar('sidebar') ?>
<?php endif ?>

