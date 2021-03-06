/**
 * External dependencies
 */
import React, { Component } from 'react';
import { __ } from '@wordpress/i18n';
import { connect } from 'react-redux';

/**
 * Internal dependencies
 */
import SearchFilter from './search-filter';
import { mapFilterToFilterKey, mapFilterToType } from '../lib/filters';
import { clearFilters, setFilter } from '../store/actions';
import './search-filters.scss';

class SearchFilters extends Component {
	static defaultProps = {
		showClearFiltersButton: true,
		showTitle: true,
	};

	onChangeFilter = ( filterName, filterValue ) => {
		this.props.setFilter( filterName, filterValue );
		this.props.onChange && this.props.onChange();
	};

	onClearFilters = event => {
		event.preventDefault();

		if (
			event.type === 'click' ||
			( event.type === 'keydown' && ( event.key === 'Enter' || event.key === ' ' ) )
		) {
			this.props.clearFilters();
			this.props.onChange && this.props.onChange();
		}
	};

	hasActiveFilters() {
		return Object.keys( this.props.filters ).length > 0;
	}

	renderFilterComponent = ( { configuration, results } ) =>
		results && (
			<SearchFilter
				aggregation={ results }
				configuration={ configuration }
				locale={ this.props.locale }
				onChange={ this.onChangeFilter }
				postTypes={ this.props.postTypes }
				type={ mapFilterToType( configuration ) }
				value={ this.props.filters[ mapFilterToFilterKey( configuration ) ] }
			/>
		);

	render() {
		if ( ! this.props.widget ) {
			return null;
		}

		const aggregations = this.props.results?.aggregations;
		return (
			<div className="jetpack-instant-search__search-filters">
				{ this.props.showTitle && (
					<div className="jetpack-instant-search__search-filters-title">
						{ __( 'Filter options', 'jetpack' ) }
					</div>
				) }
				{ this.props.showClearFiltersButton && this.hasActiveFilters() && (
					<a
						class="jetpack-instant-search__clear-filters-link"
						href="#"
						onClick={ this.onClearFilters }
						onKeyDown={ this.onClearFilters }
						role="button"
						tabIndex="0"
					>
						{ __( 'Clear filters', 'jetpack' ) }
					</a>
				) }
				{ this.props.widget?.filters
					?.map( configuration =>
						aggregations
							? { configuration, results: aggregations[ configuration.filter_id ] }
							: null
					)
					.filter( data => !! data )
					.filter(
						( { results } ) =>
							!! results && Array.isArray( results.buckets ) && results.buckets.length > 0
					)
					.map( this.renderFilterComponent ) }
			</div>
		);
	}
}

export default connect( null, { clearFilters, setFilter } )( SearchFilters );
