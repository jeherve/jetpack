/**
 * External dependencies
 */
import ReactDOM from 'react-dom';
import React from 'react';
import { registerStore } from '@wordpress/data';

/**
 * Internal dependencies
 */
import Admin from './components/admin';
import { STORE_ID, storeConfig } from './store';

registerStore( STORE_ID, storeConfig );

/**
 * The initial renderer function.
 */
function render() {
	const container = document.getElementById( 'jetpack-connection-ui-container' );

	if ( null === container ) {
		return;
	}

	ReactDOM.render( <Admin />, container );
}

render();
