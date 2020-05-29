jQuery( function ( $ ) {

	$( 'tr.type-penci_slider' ).parent().sortable( {
		axis                : 'y',
		placeholder         : 'ui-state-highlight',
		forcePlaceholderSize: true,
		update              : function ( event, ui ) {
			var theOrder = $( this ).sortable( 'toArray' );
			var nonce = $( this ).closest( 'form#posts-filter' ).children( '#_wpnonce' ).attr( 'value' );
			var data = {
				action              : 'penci_update_slide_order',
				postType            : 'penci_slider',
				order               : theOrder,
				penci_meta_box_nonce: nonce
			};

			$.post( ajaxurl, data );
		}
	} ).disableSelection();

	//shifty fix for the title column header in the home slider section
	if ( $( 'td.post-title' ).parent().hasClass( 'type-penci_slider' ) ) {
		$( 'th#title, th.column-title' ).html( '<span>Actions</span>' );
	}

} );