/* global SOLEDADLOCALIZE */
jQuery( function ( $ ) {
	'use strict';

	function buttonClick(){
		$( 'body' ).on( 'click', '.penci-ajax-arch .penci-ajax-more-button', function ( event ) {
			loadMorePostRun( $( this ) );
		} );
	}

	function infiniteScroll(){
		var $handle = $( '.penci-ajax-arch' ),
			$button_load = $handle.find( '.penci-ajax-more-button' );

		if ( $handle.hasClass( 'penci-infinite-scroll' ) ) {
			$( window ).on( 'scroll', function () {

				var hT = $button_load.offset().top,
					hH = $button_load.outerHeight(),
					wH = $( window ).height(),
					wS = $( this ).scrollTop();

				if ( ( wS > ( hT + hH - wH ) ) && $button_load.length ) {
					loadMorePostRun( $button_load );
				}
			} ).scroll();
		}
	}

	function loadMorePostRun( $button_load ){
		if ( $button_load.hasClass( 'loading-posts' ) ) {
			return false;
		}

		var layout = $button_load.data( 'layout' ),
			ppp = $button_load.data( 'number' ),
			mes = $button_load.data( 'mes' ),
			offset = $button_load.attr( 'data-offset' ),
			exclude = $button_load.data( 'exclude' ),
			from = $button_load.data( 'from' ),
			template = $button_load.data( 'template' ),
			archiveType = $button_load.data( 'archivetype' ),
			archiveValue = $button_load.data( 'archivevalue' );

		$button_load.addClass( 'loading-posts' );

		var dataAjax =  'offset=' + offset + '&layout=' + layout + '&from=' + from +
        '&template=' + template + '&ppp=' + ppp +
        '&archivetype=' + archiveType + '&archivevalue=' + archiveValue +
        '&action=penci_archive_more_post_ajax&nonce=' + SOLEDADLOCALIZE.nonce;

		$.ajax( {
			type    : 'POST',
			dataType: 'html',
			url     : SOLEDADLOCALIZE.url,
			data    :  dataAjax,
			success : function ( data ) {

				if( ! data ){
					$button_load.find( '.ajax-more-text' ).text( mes );
					$button_load.find( 'i' ).remove();
					$button_load.removeClass( 'loading-posts' );
					setTimeout( function () {
						$button_load.parent().remove();
					}, 1200 );

					return false;
				}

				var data_offset = parseInt( offset ) + ppp,
					$wrap_content = $button_load.parent().parent().find( '.penci-wrapper-data' );

				$button_load.attr( 'data-offset', data_offset );

				if ( layout === 'masonry' || layout === 'masonry-2' ) {
					var $data = $( data );

					$wrap_content.append( $data ).isotope( 'appended', $data ).imagesLoaded( function () {
						$wrap_content.isotope( 'layout' );
					} );

					$( ".container" ).fitVids();

					$('.penci-wrapper-data .penci-owl-carousel-slider').each(function () {
						var $this = $(this),
							$rtl = false;
						if( $('html').attr('dir') === 'rtl' ) {
							$rtl = true;
						}
						var owl_args = {
							rtl               : $rtl,
							loop              : true,
							margin            : 0,
							items             : 1,
							navSpeed          : 600,
							lazyLoad          : true,
							dotsSpeed         : 600,
							nav               : true,
							dots              : false,
							navText           : ['<i class="fa fa-angle-left"></i>', '<i class="fa fa-angle-right"></i>'],
							autoplay          : true,
							autoplayTimeout   : 5000,
							autoHeight        : true,
							autoplayHoverPause: true,
							autoplaySpeed     : 600
						};

						$this.owlCarousel(owl_args);
					});

					if( $().easyPieChart ) {
						$( '.penci-piechart' ).each( function () {
							var $this = $( this );
							$this.one( 'inview', function ( event, isInView, visiblePartX, visiblePartY ) {
								var chart_args = {
									barColor  : $this.data( 'color' ),
									trackColor: $this.data( 'trackcolor' ),
									scaleColor: false,
									lineWidth : $this.data( 'thickness' ),
									size      : $this.data( 'size' ),
									animate   : 1000
								};
								$this.easyPieChart( chart_args );
							} ); // bind inview
						} ); // each
					}

					$('.penci-lazy').Lazy({
						effect: 'fadeIn',
						effectTime: 300,
						scrollDirection: 'both'
					});

				}else {
					var $data = $( data );
					$wrap_content.append( $data );

					$('.penci-lazy').Lazy({
						effect: 'fadeIn',
						effectTime: 300,
						scrollDirection: 'both'
					});

					$( ".container" ).fitVids();

					$('.penci-wrapper-data .penci-owl-carousel-slider').each(function () {
						var $this = $(this),
							$datalazy = false,
							$rtl = false;

						if( $('html').attr('dir') === 'rtl' ) {
							$rtl = true;
						}
						if ( $this.attr('data-lazy') ) {
							$datalazy = true;
						}
						var owl_args = {
							rtl               : $rtl,
							loop              : true,
							margin            : 0,
							items             : 1,
							navSpeed          : 600,
							dotsSpeed         : 600,
							lazyLoad          : $datalazy,
							nav               : true,
							dots              : false,
							navText           : ['<i class="fa fa-angle-left"></i>', '<i class="fa fa-angle-right"></i>'],
							autoplay          : true,
							autoplayTimeout   : 5000,
							autoHeight        : true,
							autoplayHoverPause: true,
							autoplaySpeed     : 600
						};

						$this.imagesLoaded(function () {
							$this.owlCarousel(owl_args);
						});

						$this.on('changed.owl.carousel', function(event) {
							$('.penci-lazy').Lazy({
								effect: 'fadeIn',
								effectTime: 300,
								scrollDirection: 'both'
							});
						});
					});

					if( $().easyPieChart ) {
						$( '.penci-piechart' ).each( function () {
							var $this = $( this );
							$this.one( 'inview', function ( event, isInView, visiblePartX, visiblePartY ) {
								var chart_args = {
									barColor  : $this.data( 'color' ),
									trackColor: $this.data( 'trackcolor' ),
									scaleColor: false,
									lineWidth : $this.data( 'thickness' ),
									size      : $this.data( 'size' ),
									animate   : 1000
								};
								$this.easyPieChart( chart_args );
							} ); // bind inview
						} ); // each
					}

					var $justified_gallery = $( '.penci-post-gallery-container.justified' );
					var $masonry_gallery = $( '.penci-post-gallery-container.masonry' );
					if ( $().justifiedGallery && $justified_gallery.length ) {
						$( '.penci-post-gallery-container.justified' ).each( function () {
							var $this = $( this );
							$this.justifiedGallery( {
								rowHeight: $this.data( 'height' ),
								lastRow  : 'nojustify',
								margins  : $this.data( 'margin' ),
								randomize: false
							} );
						} ); // each .penci-post-gallery-container
					}

					if ( $().isotope && $masonry_gallery.length ) {

						$('.penci-post-gallery-container.masonry .item-gallery-masonry').each(function () {
							var $this = $(this);
							if ($this.attr('title')) {
								var $title = $this.attr('title');
								$this.children().append('<div class="caption">' + $title + '</div>');
							}
						});
					}

					$(window).load(function() {
						if ( $masonry_gallery.length ) {
							$masonry_gallery.each( function () {
								var $this = $( this );
								// initialize isotope
								$this.isotope( {
									itemSelector      : '.item-gallery-masonry',
									transitionDuration: '.55s',
									layoutMode        : 'masonry'
								} );

								$this.addClass( 'loaded' );

								$('.penci-post-gallery-container.masonry .item-gallery-masonry').each( function () {
									var $this = $( this );
									$this.one( 'inview', function ( event, isInView, visiblePartX, visiblePartY ) {
										$this.addClass( 'animated' );
									} ); // inview
								} ); // each

							} );
						}
					});

					if ( $().theiaStickySidebar ) {
						var top_margin = 90;
						if( $('body' ).hasClass('admin-bar') ) {
							top_margin = 122;
						}
						$('#main.penci-main-sticky-sidebar, #sidebar.penci-sticky-sidebar' ).theiaStickySidebar({
							// settings
							additionalMarginTop: top_margin
						});
					} // if sticky
				}

				$button_load.removeClass( 'loading-posts' );
			},
			error   : function ( jqXHR, textStatus, errorThrown ) {
			}

		} );
	}

	$( document ).ready( function(){
		buttonClick();
		infiniteScroll();
	} );
});