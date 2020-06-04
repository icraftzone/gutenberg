/**
 * External dependencies
 */
import deepFreeze from 'deep-freeze';

/**
 * Internal dependencies
 */
import {
	blockManagement,
	downloadableBlocks,
	errorNotices,
	hasPermission,
} from '../reducer';
import { installedItem, downloadableBlock } from './fixtures';

describe( 'state', () => {
	describe( 'downloadableBlocks()', () => {
		it( 'should update state to reflect active search', () => {
			const initialState = {};
			const filterValue = 'Awesome Block';

			const state = downloadableBlocks( initialState, {
				type: 'FETCH_DOWNLOADABLE_BLOCKS',
				filterValue,
			} );

			expect( state[ filterValue ].isRequesting ).toEqual( true );
		} );

		it( 'should update state to reflect search results have returned', () => {
			const query = downloadableBlock.title;
			const initialState = {
				[ query ]: {
					isRequesting: true,
				},
			};

			const state = downloadableBlocks( initialState, {
				type: 'RECEIVE_DOWNLOADABLE_BLOCKS',
				filterValue: query,
				downloadableBlocks: [ downloadableBlock ],
			} );

			expect( state[ query ].isRequesting ).toEqual( false );
		} );

		it( "should set user's search term and save results", () => {
			const query = downloadableBlock.title;
			const state = downloadableBlocks(
				{},
				{
					type: 'RECEIVE_DOWNLOADABLE_BLOCKS',
					filterValue: query,
					downloadableBlocks: [ downloadableBlock ],
				}
			);
			expect( state ).toHaveProperty( query );
			expect( state[ query ].results ).toHaveLength( 1 );
		} );

		it( 'should set query to reflect its pending status', () => {
			const filterValue = 'Awesome Block';

			// Simulate a second call.
			const stateAfterRequest = downloadableBlocks(
				{},
				{
					type: 'FETCH_DOWNLOADABLE_BLOCKS',
					filterValue,
				}
			);

			expect( stateAfterRequest[ filterValue ].isRequesting ).toEqual(
				true
			);

			const stateAfterResponse = downloadableBlocks(
				{},
				{
					type: 'RECEIVE_DOWNLOADABLE_BLOCKS',
					filterValue,
					downloadableBlocks: [],
				}
			);

			expect( stateAfterResponse[ filterValue ].isRequesting ).toEqual(
				false
			);
		} );
	} );

	describe( 'blockManagement()', () => {
		it( 'should start with an empty installedBlockTypes List', () => {
			const state = blockManagement( undefined, {
				type: 'NOOP_TYPE',
			} );
			expect( state.installedBlockTypes ).toEqual( [] );
		} );

		it( 'should add item to the installedBlockTypesList', () => {
			const initialState = deepFreeze( { installedBlockTypes: [] } );
			const state = blockManagement( initialState, {
				type: 'ADD_INSTALLED_BLOCK_TYPE',
				item: installedItem,
			} );

			expect( state.installedBlockTypes ).toHaveLength( 1 );
		} );

		it( 'should remove item from the installedBlockTypesList', () => {
			const initialState = deepFreeze( {
				installedBlockTypes: [ installedItem ],
			} );
			const state = blockManagement( initialState, {
				type: 'REMOVE_INSTALLED_BLOCK_TYPE',
				item: installedItem,
			} );

			expect( state.installedBlockTypes ).toHaveLength( 0 );
		} );
	} );

	describe( 'hasPermission()', () => {
		it( 'should update permissions appropriately', () => {
			const state = hasPermission( true, {
				type: 'SET_INSTALL_BLOCKS_PERMISSION',
				hasPermission: false,
			} );

			expect( state ).toEqual( false );
		} );
	} );

	describe( 'errorNotices()', () => {
		it( 'should set an error notice', () => {
			const initialState = deepFreeze( {} );
			const state = errorNotices( initialState, {
				type: 'SET_ERROR_NOTICE',
				blockId: 'block/has-error',
				notice: 'Error',
			} );

			expect( state ).toEqual( {
				'block/has-error': 'Error',
			} );
		} );

		it( 'should set a second error notice', () => {
			const initialState = deepFreeze( {
				'block/has-error': 'Error',
			} );
			const state = errorNotices( initialState, {
				type: 'SET_ERROR_NOTICE',
				blockId: 'block/another-error',
				notice: 'Error',
			} );

			expect( state ).toEqual( {
				'block/has-error': 'Error',
				'block/another-error': 'Error',
			} );
		} );

		it( 'should clear an existing error notice', () => {
			const initialState = deepFreeze( {
				'block/has-error': 'Error',
			} );
			const state = errorNotices( initialState, {
				type: 'SET_ERROR_NOTICE',
				blockId: 'block/has-error',
				notice: false,
			} );

			expect( state ).toEqual( {
				'block/has-error': false,
			} );
		} );

		it( 'should clear a nonexistent error notice', () => {
			const initialState = deepFreeze( {
				'block/has-error': 'Error',
			} );
			const state = errorNotices( initialState, {
				type: 'SET_ERROR_NOTICE',
				blockId: 'block/no-error',
				notice: false,
			} );

			expect( state ).toEqual( {
				'block/has-error': 'Error',
				'block/no-error': false,
			} );
		} );
	} );
} );
