<?php
/**
 * MyAwesomeTheme functions and definitions
 *
 * @package MyAwesomeTheme
 */

if ( ! function_exists( 'myawesometheme_setup' ) ) :
/**
 * Sets up theme defaults and registers support for various WordPress features.
 *
 * Note that this function is hooked into the after_setup_theme hook, which
 * runs before the init hook. The init hook is too late for some features, such
 * as indicating support for post thumbnails.
 */
function myawesometheme_setup() {
	/*
	 * Make theme available for translation.
	 * Translations can be filed in the /languages/ directory.
	 * If you're building a theme based on MyAwesomeTheme, use a find and replace
	 * to change 'myawesometheme' to the name of your theme in all the template files
	 */
	load_theme_textdomain( 'myawesometheme', get_template_directory() . '/languages' );

	// Add default posts and comments RSS feed links to head.
	add_theme_support( 'automatic-feed-links' );

	/*
	 * Let WordPress manage the document title.
	 * By adding theme support, we declare that this theme does not use a
	 * hard-coded <title> tag in the document head, and expect WordPress to
	 * provide it for us.
	 */
	add_theme_support( 'title-tag' );

	/*
	 * Enable support for Post Thumbnails on posts and pages.
	 *
	 * @link http://codex.wordpress.org/Function_Reference/add_theme_support#Post_Thumbnails
	 */
	add_theme_support( 'post-thumbnails' );

	// This theme uses wp_nav_menu() in one location.
	register_nav_menus( array(
		'primary' => esc_html__( 'Primary Menu', 'myawesometheme' ),
	) );

	/*
	 * Switch default core markup for search form, comment form, and comments
	 * to output valid HTML5.
	 */
	add_theme_support( 'html5', array(
		'search-form',
		'comment-form',
		'comment-list',
		'gallery',
		'caption',
	) );

	/*
	 * Enable support for Post Formats.
	 * See http://codex.wordpress.org/Post_Formats
	 */
	add_theme_support( 'post-formats', array(
		'aside',
		'image',
		'video',
		'quote',
		'link',
	) );

	// Set up the WordPress core custom background feature.
	add_theme_support( 'custom-background', apply_filters( 'myawesometheme_custom_background_args', array(
		'default-color' => 'ffffff',
		'default-image' => '',
	) ) );
}
endif; // myawesometheme_setup
add_action( 'after_setup_theme', 'myawesometheme_setup' );

/**
 * Set the content width in pixels, based on the theme's design and stylesheet.
 *
 * Priority 0 to make it available to lower priority callbacks.
 *
 * @global int $content_width
 */
function myawesometheme_content_width() {
	$GLOBALS['content_width'] = apply_filters( 'myawesometheme_content_width', 640 );
}
add_action( 'after_setup_theme', 'myawesometheme_content_width', 0 );

/**
 * Register widget area.
 *
 * @link http://codex.wordpress.org/Function_Reference/register_sidebar
 */
function myawesometheme_widgets_init() {
	register_sidebar(array(
		'name'          => esc_html__('Боковая панель на главной странице', 'myawesometheme'),
		'id'            => 'sidebar-front',
		'description'   => '',
		'before_widget' => '<div id="%1$s" class="panel about_me widget %2$s"><div class="panel-body">',
		'after_widget'  => '</div></div>',
		'before_title'  => '<div class="title widget-title"><span>',
		'after_title'   => '</span></div>',
	));

	register_sidebar(array(
		'name'          => esc_html__('Боковая панель в блоге', 'myawesometheme'),
		'id'            => 'sidebar-blog',
		'description'   => '',
		'before_widget' => '<div id="%1$s" class="panel widget %2$s"><div class="panel-body">',
		'after_widget'  => '</div></div>',
		'before_title'  => '<div class="title widget-title"><span>',
		'after_title'   => '</span></div>',
	));

	register_sidebar(array(
		'name'          => esc_html__('Боковая панель', 'myawesometheme'),
		'id'            => 'sidebar',
		'description'   => '',
		'before_widget' => '<div id="%1$s" class="panel widget %2$s"><div class="panel-body">',
		'after_widget'  => '</div></div>',
		'before_title'  => '<div class="title widget-title"><span>',
		'after_title'   => '</span></div>',
	));
}
add_action('widgets_init', 'myawesometheme_widgets_init');

/**
 * Enqueue scripts and styles.
 */
function myawesometheme_scripts() {
	wp_enqueue_style( 'myawesometheme-style', get_stylesheet_uri() );
	wp_enqueue_script( 'myawesometheme-jquery', get_template_directory_uri() . '/js/jquery-2.1.3.min.js' );
	wp_enqueue_script( 'myawesometheme-bootstrap', get_template_directory_uri() . '/js/bootstrap.min.js');
	wp_enqueue_script( 'myawesometheme-common', get_template_directory_uri() . '/js/common.js');
}

add_action( 'wp_enqueue_scripts', 'myawesometheme_scripts' );

/**
 * Implement the Custom Header feature.
 */
require get_template_directory() . '/inc/custom-header.php';

/**
 * Custom template tags for this theme.
 */
require get_template_directory() . '/inc/template-tags.php';

/**
 * Custom functions that act independently of the theme templates.
 */
require get_template_directory() . '/inc/extras.php';

/**
 * Customizer additions.
 */
require get_template_directory() . '/inc/customizer.php';

/**
 * Load Jetpack compatibility file.
 */
require get_template_directory() . '/inc/jetpack.php';
