<?php
/**
 * Jetpack Review Link - Adds a 5-star review link to the plugin row meta.
 *
 * @package automattic/jetpack
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit( 0 );
}

/**
 * Class to handle the review link in plugin row meta.
 */
class Jetpack_Review_Link {

	/**
	 * Initialize the review link functionality.
	 *
	 * @return void
	 */
	public static function init() {
		add_filter( 'plugin_row_meta', array( __CLASS__, 'add_review_link' ), 10, 2 );
	}

	/**
	 * Add a 5-star review link to the plugin row meta.
	 *
	 * @param array  $plugin_meta An array of the plugin's metadata.
	 * @param string $plugin_file Path to the plugin file relative to the plugins directory.
	 *
	 * @return array
	 */
	public static function add_review_link( $plugin_meta, $plugin_file ) {
		if ( $plugin_file !== 'jetpack/jetpack.php' ) {
			return $plugin_meta;
		}

		$u    = get_current_user_id();
		$site = get_site_url();

		$plugin_meta[] = '<a href="https://jetpack.com/redirect?source=jetpack-plugin-review&site=' . esc_attr( $site ) . '&u=' . esc_attr( $u ) . '" target="_blank" rel="noopener noreferrer" title="' . esc_attr__( 'Rate Jetpack on WordPress.org', 'jetpack' ) . '" style="color: #ffb900">'
			. str_repeat( '<span class="dashicons dashicons-star-filled" style="font-size: 16px; width:16px; height: 16px"></span>', 5 )
			. '</a>';

		return $plugin_meta;
	}
}
