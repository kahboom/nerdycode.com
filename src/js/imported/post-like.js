jQuery( document ).ready( function ($) {
	jQuery( 'body' ).on( 'click', '.penci-post-like', function ( event ) {
		event.preventDefault();
		var $this = jQuery( this ),
			post_id = $this.data( "post_id" ),
			like_text = $this.data( "like" ),
			unlike_text = $this.data( "unlike" ),
			$selector = $this.children('.dt-share' );
			if( $this.hasClass( 'single-like-button' ) ) {
				$selector = $this.parent().find('.count-number-like');
			}
		var	$like = parseInt( $selector.text() );

		if ( $this.hasClass( 'single-like-button' ) ) {
			$selector = $( '.post-share-plike .count-number-like' );
			$this = $( '.single-like-button' );
		}

		if ( $this.hasClass( 'liked' ) ) {
			$this.removeClass( 'liked' );
			$this.prop( 'title', 'Like' );
			$selector.html( ( $like - 1 ) );
		}
		else {
			$this.addClass( 'liked' );
			$this.prop( 'title', 'Unlike' );
			$selector.html( ( $like + 1 ) );
		}

		jQuery.ajax( {
			type: "post",
			url : ajax_var.url,
			data: "action=penci-post-like&nonce=" + ajax_var.nonce + "&penci_post_like=&post_id=" + post_id
		} );
	} );
} );
