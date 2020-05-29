/* global PENCILOCALIZE */

(function($) {
	"use strict";
	var PENCI = PENCI || {};

	/* General functions
	 ---------------------------------------------------------------*/
	PENCI.general = function () {
		// Top search
		$( '#top-search a.search-click' ).on( 'click', function () {
			$( '.show-search' ).fadeToggle();
			$( '.show-search input.search-input' ).focus();
		} );

		// Go to top
		$( '.go-to-top, .penci-go-to-top-floating' ).on( 'click', function () {
			$( 'html, body' ).animate( { scrollTop: 0 }, 700 );
			return false;
		} );

		// Lazyload
		$('.penci-lazy').Lazy({
			effect: 'fadeIn',
			effectTime: 300,
			scrollDirection: 'both'
		});

		// Go to top button
		var $goto_button = $( '.penci-go-to-top-floating' );
		if ( $goto_button.length ) {
			$(document).scroll(function() {
				var y = $(this).scrollTop();
				if ( y > 300) {
					$goto_button.addClass('show-up');
				} else {
					$goto_button.removeClass('show-up');
				}
			} );
		}
		
		// Call back fitvid when click load more button on buddypress
		$( 'body.buddypress .activity .load-more a' ).on( 'click', function () {
			$(document).ajaxStop(function() {
			  $( ".container" ).fitVids();
			});
		} );
	}
	
	/* Cookie Law
	 ---------------------------------------------------------------*/
	PENCI.cookie = function () {
		var wrapCookie = '.penci-wrap-gprd-law',
			$wrapCookie = $( wrapCookie ),
			classAction = 'penci-wrap-gprd-law-close',
			penciCookieName = 'penci_law_footer_new';

		if( ! $wrapCookie.length ){
			return false;
		}

		var penciCookie = {
			set: function ( name, value ) {
				var date = new Date();
				date.setTime( date.getTime() + (31536000000) );
				var expires = "; expires=" + date.toGMTString();
				document.cookie = name + "=" + value + expires + "; path=/";
			},
			read: function ( name ) {
				var namePre = name + "=";
				var cookieSplit = document.cookie.split( ';' );
				for ( var i = 0; i < cookieSplit.length; i ++ ) {
					var cookie = cookieSplit[i];
					while ( cookie.charAt( 0 ) == ' ' ) {
						cookie = cookie.substring( 1, cookie.length );
					}
					if ( cookie.indexOf( namePre ) === 0 ) {
						return cookie.substring( namePre.length, cookie.length );
					}
				}
				return null;
			},
			erase: function ( name ) {
				this.set( name, "", - 1 );
			},
			exists: function ( name ) {
				return (
					this.read( name ) !== null
				);
			}
		};

		$wrapCookie.removeClass( 'penci-close-all' );
		if (! penciCookie.exists(penciCookieName) || ( penciCookie.exists(penciCookieName) && 1 == penciCookie.read(penciCookieName) ) ) {
			$wrapCookie.removeClass( classAction );
		}else {
			$wrapCookie.addClass( classAction );
		}

		$( '.penci-gprd-accept, .penci-gdrd-show' ).on( 'click', function ( e ) {
			e.preventDefault();

			var $this = $(this),
				$parent_law = $this.closest( wrapCookie );

			$parent_law.toggleClass(classAction);

			if ( $parent_law.hasClass( classAction ) ) {
				penciCookie.set( penciCookieName, '2' );
			}else {
				penciCookie.set( penciCookieName, '1' );
			}

			return false;
		} );
	}

	/* Sticky main navigation
	 ---------------------------------------------------------------*/
	PENCI.main_sticky = function () {
		if ( $().sticky && ! $( "nav#navigation" ).hasClass( 'penci-disable-sticky-nav' ) ) {
			var spaceTop = 0;
			if ( $( 'body' ).hasClass( 'admin-bar' ) ) {
				spaceTop = 32;
			}
			$( "nav#navigation" ).each( function () {
				$( this ).sticky( { topSpacing: spaceTop } );
			} );
		} // sticky
	}

	/* Fix margin headline
	 ----------------------------------------------------------------*/
	PENCI.fixheadline = function () {
		var $headline_title = $( '.penci-headline .headline-title' );
		if ( $headline_title.length ) {
			var headline_w = $headline_title.outerWidth() + 70;
			$('.penci-headline-posts' ).css( 'margin-left', headline_w + 'px' );
			$('.rtl .penci-headline-posts' ).css( 'margin-left', 0 + 'px' );
			$('.rtl .penci-headline-posts' ).css( 'margin-right', headline_w + 'px' );
		}
	}

	/* Homepage Featured Slider
	 ---------------------------------------------------------------*/
	PENCI.featured_slider = function () {
		if ( $().owlCarousel ) {
			$( '.featured-area .penci-owl-featured-area' ).each( function () {
				var $this = $( this ),
					$style = $this.data( 'style' ),
					$auto = false,
					$autotime = $this.data( 'autotime' ),
					$speed = $this.data( 'speed' ),
					$loop = $this.data('loop'),
					$item = 1,
					$nav = true,
					$dots = false,
					$rtl = false,
					$items_desktop = 1,
					$items_tablet = 1,
					$items_tabsmall = 1;

				if( $style === 'style-2' ) {
					$item = 2;
				} else if( $style === 'style-28' ) {
					$loop = true;
				}

				if( $('html').attr('dir') === 'rtl' ) {
					$rtl = true;
				}
				if ( $this.attr('data-auto') === 'true' ) {
					$auto = true;
				}
				if ( $this.attr('data-nav') === 'false' ) {
					$nav = false;
				}
				if ( $this.attr('data-dots') === 'true' ) {
					$dots = true;
				}
				if ( $this.attr('data-item') ) {
					$item = parseInt( $this.data('item') );
				}
				if ( $this.attr('data-desktop') ) {
					$items_desktop = parseInt( $this.data('desktop') );
				}
				if ( $this.attr('data-tablet') ) {
					$items_tablet = parseInt( $this.data('tablet') );
				}
				if ( $this.attr('data-tabsmall') ) {
					$items_tabsmall = parseInt( $this.data('tabsmall') );
				}

				var owl_args = {
					rtl               : $rtl,
					loop              : $loop,
					margin            : 0,
					items             : $item,
					navSpeed          : $speed,
					dotsSpeed         : $speed,
					nav               : $nav,
					slideBy           : $item,
					mouseDrag         : false,
					lazyLoad          : true,
					dots              : $dots,
					navText           : ['<i class="fa fa-angle-left"></i>', '<i class="fa fa-angle-right"></i>'],
					autoplay          : $auto,
					autoplayTimeout   : $autotime,
					autoplayHoverPause: true,
					autoplaySpeed     : $speed,
					responsive        : {
						0   : {
							items: 1
						},
						480 : {
							items  : $items_tabsmall,
							slideBy: $items_tabsmall
						},
						768 : {
							items  : $items_tablet,
							slideBy: $items_tablet
						},
						1170: {
							items  : $items_desktop,
							slideBy: $items_desktop
						}
					}
				}

				if( $style === 'style-2' ) {
					owl_args['center'] = true;
					owl_args['margin'] = 10;
					owl_args['autoWidth'] = true;
				} else if( $style === 'style-28' ) {
					owl_args['margin'] = 4;
					owl_args['items'] = 6;
					owl_args['autoWidth'] = true;
				} else if( $style === 'style-38' ) {
					owl_args['center'] = true;
					owl_args['margin'] = 5;
					owl_args['autoWidth'] = true;
				}

				$this.imagesLoaded( function() { $this.owlCarousel( owl_args ); } );
				
				$this.on('initialize.owl.carousel', function(event) {
					$this.closest('.featured-area').addClass('penci-featured-loaded');
				});

				if( $style === 'style-2' || $style === 'style-38' || $style === 'style-5' || $style === 'style-28' || $style === 'style-29' ) {
					$this.on( 'changed.owl.carousel', function ( event ) {
						$this.find( '.penci-lazy' ).Lazy( {
							effect: 'fadeIn',
							effectTime: 300,
							scrollDirection: 'both'
						} );
					} );
				}
			} );
		}	// if owlcarousel
	}

	/* Owl Slider General
	 ---------------------------------------------------------------*/
	PENCI.owl_slider = function () {
		if ( $().owlCarousel ) {
			$( '.penci-owl-carousel-slider' ).each( function () {
				var $this = $( this ),
					$auto = true,
					$dots = false,
					$nav = true,
					$loop = true,
					$rtl = false,
					$dataauto = $this.data( 'auto' ),
					$items_desktop = 1,
					$items_tablet = 1,
					$items_tabsmall = 1,
					$speed = 600,
					$item = 1,
					$margin = 0,
					$autotime = 5000,
					$datalazy = false;

				if( $('html').attr('dir') === 'rtl' ) {
					$rtl = true;
				}
				if ( $this.attr('data-dots') ) {
					$dots = true;
				}
				if ( $this.attr('data-loop') ) {
					$loop = false;
				}
				if ( $this.attr('data-nav') ) {
					$nav = false;
				}

				if ( $this.attr('data-margin') ) {
					$margin = parseInt( $this.data('margin') );
				}
				if ( $this.attr('data-desktop') ) {
					$items_desktop = parseInt( $this.data('desktop') );
				}
				if ( $this.attr('data-tablet') ) {
					$items_tablet = parseInt( $this.data('tablet') );
				}
				if ( $this.attr('data-tabsmall') ) {
					$items_tabsmall = parseInt( $this.data('tabsmall') );
				}
				if ( $this.attr('data-speed') ) {
					$speed = parseInt( $this.data('speed') );
				}
				if ( $this.attr('data-autotime') ) {
					$autotime = parseInt( $this.data('autotime') );
				}
				if ( $this.attr('data-item') ) {
					$item = parseInt( $this.data('item') );
				}
				if ( $this.attr('data-lazy') ) {
					$datalazy = true;
				}

				var owl_args = {
					loop              : $loop,
					rtl               : $rtl,
					margin            : $margin,
					items             : $item,
					slideBy           : $item,
					lazyLoad          : $datalazy,
					navSpeed          : $speed,
					dotsSpeed         : $speed,
					nav               : $nav,
					dots              : $dots,
					navText           : ['<i class="fa fa-angle-left"></i>', '<i class="fa fa-angle-right"></i>'],
					autoplay          : $dataauto,
					autoplayTimeout   : $autotime,
					autoHeight        : true,
					autoplayHoverPause: true,
					autoplaySpeed     : $speed,
					responsive        : {
						0   : {
							items  : 1,
							slideBy: 1
						},
						480 : {
							items  : $items_tabsmall,
							slideBy: $items_tabsmall
						},
						768 : {
							items  : $items_tablet,
							slideBy: $items_tablet
						},
						1170: {
							items  : $items_desktop,
							slideBy: $items_desktop
						}
					}
				};

				if ( $this.hasClass( 'penci-headline-posts' ) ) {
					owl_args['animateOut'] = 'slideOutUp';
					owl_args['animateIn'] = 'slideInUp';
				}

				$this.imagesLoaded( function() { $this.owlCarousel( owl_args ); } );

				$this.on('changed.owl.carousel', function(event) {
					$this.find( '.penci-lazy' ).Lazy( {
						effect: 'fadeIn',
						effectTime: 300,
						scrollDirection: 'both'
					} );
				});
			} );
		}	// if owlcarousel
	}

	/* Fitvids
	 ---------------------------------------------------------------*/
	PENCI.fitvids = function() {
		// Target your .container, .wrapper, .post, etc.
		$( ".container" ).fitVids();
	}

	/* Sticky sidebar
	 ----------------------------------------------------------------*/
	PENCI.sticky_sidebar = function() {
		if ( $().theiaStickySidebar ) {
			var top_margin = 90;
			if( $('body' ).hasClass('admin-bar') && $('body' ).hasClass('penci-vernav-enable') ){
				top_margin = 62;
			} else if( ! $('body' ).hasClass('admin-bar') && $('body' ).hasClass('penci-vernav-enable') ) {
				top_margin = 30;
			} else if( $('body' ).hasClass('admin-bar') && ! $('body' ).hasClass('penci-vernav-enable') ){
				top_margin = 122;
			}

			if( $( '.penci-vc-sticky-sidebar > .penci-vc-row > .penci-vc-column' ).length ){
				$( '.penci-vc-sticky-sidebar > .penci-vc-row > .penci-vc-column' ).theiaStickySidebar( {
					additionalMarginTop: top_margin,
				} );
			}

			if ( $( '.penci-enSticky .penci-sticky-sb' ).length ) {
				$( '.penci-enSticky .penci-sticky-sb,.penci-enSticky .penci-sticky-ct' ).theiaStickySidebar( {
					additionalMarginTop: top_margin,
				} );
			}
			$('#main.penci-main-sticky-sidebar, #sidebar.penci-sticky-sidebar' ).theiaStickySidebar({
				// settings
				additionalMarginTop: top_margin
			});
		} // if sticky
	}

	/* Mega menu
	 ----------------------------------------------------------------*/
	PENCI.mega_menu = function () {
		$( '#navigation .penci-mega-child-categories a' ).mouseenter( function () {
			if ( !$( this ).hasClass( 'cat-active' ) ) {
				var $this = $( this ),
					$row_active = $this.data( 'id' ),
					$parentA = $this.parent().children( 'a' ),
					$parent = $this.closest( '.penci-megamenu' ),
					$rows = $this.closest( '.penci-megamenu' ).find( '.penci-mega-latest-posts' ).children( '.penci-mega-row' );
				$parentA.removeClass( 'cat-active' );
				$this.addClass( 'cat-active' );
				$rows.hide();
				$parent.find( '.' + $row_active ).fadeIn( '300' ).css( 'display', 'inline-block' );
			}
		} );
	}

	/* Mobile menu responsive
	 ----------------------------------------------------------------*/
	PENCI.mobile_menu = function () {
		// Add indicator
		$( '#sidebar-nav .menu li.menu-item-has-children > a' ).append( '<u class="indicator"><i class="fa fa-angle-down"></i></u>' );
		$( '#sidebar-nav .penci-mega-child-categories' ).closest('li.penci-mega-menu' ).children('a').append( '<u class="indicator"><i class="fa fa-angle-down"></i></u>' );

		// Toggle menu when click show/hide menu
		$( '#navigation .button-menu-mobile' ).on( 'click', function () {
			$( 'body' ).addClass( 'open-sidebar-nav' );
		} );

		// indicator click
		$( '#sidebar-nav .menu li a .indicator' ).on( 'click', function ( e ) {
			var $this = $( this );
			e.preventDefault();
			$this.children().toggleClass( 'fa-angle-up' );
			$this.parent().next().slideToggle( 'fast' );
		} );

		// Close sidebar nav
		$( '#close-sidebar-nav' ).on( 'click', function () {
			$( 'body' ).removeClass( 'open-sidebar-nav' );
		} );
	}
	
	PENCI.toggleMenuHumburger = function () {
		var $menuhumburger = $( '.penci-menu-hbg' );
		if ( $menuhumburger.length ) {
			var $body = $( 'body' ),
			$button = $( '.penci-vernav-toggle,.penci-menuhbg-toggle,#penci-close-hbg,.penci-menu-hbg-overlay' ),
			sidebarClass = 'penci-menuhbg-open';

			// Add indicator
			$( '.penci-menu-hbg .menu li.menu-item-has-children > a' ).append( '<u class="indicator"><i class="fa fa-angle-down"></i></u>' );
			$( '.penci-menu-hbg .penci-mega-child-categories' ).closest('li.penci-mega-menu' ).children('a').append( '<u class="indicator"><i class="fa fa-angle-down"></i></u>' );

			// indicator click
			$( '.penci-menu-hbg .menu li a .indicator' ).on( 'click', function ( e ) {
				var $this = $( this );
				e.preventDefault();
				$this.children().toggleClass( 'fa-angle-up' );
				$this.parent().next().slideToggle( 'fast' );
			} );

			// Click to show mobile menu
			$button.on( 'click', function ( e ) {
				e.preventDefault();

				if ( $body.hasClass( sidebarClass ) ) {
					$body.removeClass( sidebarClass );
					$button.removeClass( 'active' );

					return;
				}
				e.stopPropagation(); // Do not trigger click event on '.site' below
				$body.addClass( sidebarClass );
				$button.addClass( 'active' );
			} );
			
			// Scroll menu hamburger and callback lazyload
			$menuhumburger.on('scroll', function() {
				$('.penci-menu-hbg .penci-lazy').Lazy({
					effect: 'fadeIn',
					effectTime: 300,
					scrollDirection: 'both'
				});
			} );
		}
	}

	/* Light box
	 ----------------------------------------------------------------*/
	PENCI.lightbox = function () {
		if ( $().magnificPopup) {
			$( 'a[data-rel^="penci-gallery-image-content"], .penci-enable-lightbox .gallery-item a' ).magnificPopup( {
				type               : 'image',
				closeOnContentClick: true,
				closeBtnInside     : false,
				fixedContentPos    : true,
				image              : {
					verticalFit: true,
					titleSrc: 'data-cap'
				},
				gallery : {
					enabled: true
				},
				zoom               : {
					enabled : true,
					duration: 300
				}
			} );

			$( 'a[data-rel^="penci-gallery-bground-content"]' ).magnificPopup( {
				type               : 'image',
				closeOnContentClick: true,
				closeBtnInside     : false,
				fixedContentPos    : true,
				image              : {
					verticalFit: true,
				},
				gallery : {
					enabled: true
				}
			} );


			// Enable lightbox videos
			$('.penci-other-layouts-lighbox').magnificPopup( {
				type: 'iframe',
				mainClass: 'mfp-fade',
				fixedContentPos    : true,
				closeBtnInside     : false,
				closeOnContentClick: true
			} );

			if ( $( '.penci-image-gallery' ).length ) {
				$( '.penci-image-gallery' ).each( function () {
					var $this = $( this ),
						id = $this.attr( 'id' );

					$( '#' + id + ' a' ).magnificPopup( {
						type               : 'image',
						closeOnContentClick: true,
						closeBtnInside     : false,
						fixedContentPos    : true,
						image              : {
							verticalFit: true,
							titleSrc: 'data-cap'
						},
						gallery : {
							enabled: true
						}
					} );
				} );
			}

			if ( $( '.penci-post-gallery-container' ).length ) {
				$( '.penci-post-gallery-container' ).each( function () {
					var $this = $( this ),
						id = $this.attr( 'id' );

					$( '#' + id + ' a' ).magnificPopup( {
						type               : 'image',
						closeOnContentClick: true,
						closeBtnInside     : false,
						fixedContentPos    : true,
						image              : {
							verticalFit: true,
							titleSrc: 'data-cap'
						},
						gallery : {
							enabled: true
						}
					} );
				} );
			}

		} // if magnificPopup exists
	}

	/* Masonry layout
	 ----------------------------------------------------------------*/
	PENCI.masonry = function() {
		$(window).load(function() {
			var $masonry_container = $( '.penci-masonry' );
			if ( $masonry_container.length ) {
				$masonry_container.each( function () {
					var $this = $( this );
					// initialize isotope
					$this.isotope( {
						itemSelector      : '.item-masonry',
						transitionDuration: '.55s',
						layoutMode        : 'masonry'
					} );
				} );
			}
		});
	}

	/* Video Background
	 ----------------------------------------------------------------*/
	PENCI.video_background = function() {
		var $penci_videobg = $( '#penci-featured-video-bg' );
		if ( $().mb_YTPlayer && $penci_videobg.length ) {
			$(window ).load( function() {
				$("#penci-featured-video-bg").mb_YTPlayer();
				setTimeout(function(){
					$('.featured-area').addClass( 'loaded-wait' ).append('<div class="overlay-video-click"></div>');
					$('.overlay-video-click').on( 'click', function () {
						var $this = $(this);
						if( !$this.hasClass( 'pause-video' ) ) {
							$this.addClass('pause-video');
							jQuery('#penci-featured-video-bg').pauseYTP();
						} else {
							$this.removeClass('pause-video');
							jQuery('#penci-featured-video-bg').playYTP();
						}
					});
				}, 4000);
			} );
		}
	}

	/* Portfolio
	 ----------------------------------------------------------------*/
	PENCI.portfolio = function () {
		var $penci_portfolio = $( '.penci-portfolio' );


		if ( $().isotope && $penci_portfolio.length ) {
			$( '.penci-portfolio' ).each( function () {
				var $this = $( this ),
					unique_id = $( this ).attr( 'id' ),
					DataFilter = null;

				if( typeof(portfolioDataJs) != "undefined" && portfolioDataJs !== null) {
					for ( var e in portfolioDataJs ) {

						if ( portfolioDataJs[e].instanceId == unique_id ) {
							var DataFilter = portfolioDataJs[e];
						}
					}
				}

				$( window ).load( function () {
					$this.isotope( {
						itemSelector    : '.portfolio-item',
						animationEngine : 'best-available',
						animationOptions: {
							duration: 250,
							queue   : false
						}
					} ); // isotope

					$this.addClass( 'loaded' );

					$('.portfolio-item .inner-item-portfolio').each( function () {
						var $this = $( this );
						$this.one( 'inview', function ( event, isInView, visiblePartX, visiblePartY ) {
							$this.addClass( 'animated' );
						} ); // inview
					} ); // each

					var location = window.location.hash.toString();
					if ( location.length ) {
						location = location.replace( '#', '' );
						location.match( /:/ );
						var Mlocation = location.match( /^([^:]+)/ )[1];
						location = location.replace( Mlocation + ":", "" );

						if ( location.length > 1 ) {

							var $termActive = $afilter.filter( '[data-term="' + location + '"]' ),
							    portfolioItem = $this.find( '.portfolio-item' ),
								$buttonLoadMore = $this.parent().find( '.penci-pagenavi-shortcode' );

							if ( $termActive.length ) {

								liFilter.removeClass( 'active' );
								$termActive.parent().addClass( 'active' );
								$this.isotope( { filter: '.penci-' + location } );

								var dataTerm = $termActive.data( "term" ),
									p = {};

								DataFilter.currentTerm = dataTerm;
								$.each( DataFilter.countByTerms, function ( t, e ) {
									p[t] = 0
								} );

								portfolioItem.each( function ( t, e ) {
									$.each( ($( e ).data( "terms" ) + "").split( " " ), function ( t, e ) {
										p[e] ++;
									} )
								} );

								var show_button = 'number' == typeof p[dataTerm] && p[dataTerm] == DataFilter.countByTerms[dataTerm];
								if ( $buttonLoadMore.length ){
									if ( portfolioItem.length !== DataFilter.count && ! show_button ) {
										$buttonLoadMore.show();
									}else{
										$buttonLoadMore.hide();
									}
								}
							}
						}
					}
				} ); // load

				// Filter items when filter link is clicked
				var $filter = $this.parent().find( '.penci-portfolio-filter' ),
					$afilter = $filter.find( 'a' ),
					liFilter = $filter.find( 'li' );

				liFilter.on( 'click', function () {

					var self = $( this ),
						term = self.find( 'a' ).data( "term" ),
						selector = self.find( "a" ).attr( 'data-filter' ),
						$e_dataTerm = $filter.find( 'a' ).filter( '[data-term="' + term + '"]' ),
						portfolioItem = $this.find( '.portfolio-item' ),
						$buttonLoadMore = $this.parent().find( '.penci-pagenavi-shortcode' ),
						scrollTop = $( window ).scrollTop();

					liFilter.removeClass( 'active' );
					self.addClass( 'active' );

					$this.parent().find( '.penci-ajax-more-button' ).attr( 'data-cat', term );

					$this.isotope( { filter: selector } );

					if ( $e_dataTerm.length ) {
						window.location.hash = "*" == term ? "" : term;

						$( window ).scrollTop( scrollTop );
					}

					var p = {};
					DataFilter.currentTerm = term;
					$.each( DataFilter.countByTerms, function ( t, e ) {
						p[t] = 0
					} );

					portfolioItem.each( function ( t, e ) {
						$.each( ($( e ).data( "terms" ) + "").split( " " ), function ( t, e ) {
							p[e] ++;
						} )
					} );

					var show_button = 'number' == typeof p[term] && p[term] == DataFilter.countByTerms[term];
					if ( $buttonLoadMore.length ){
						if ( portfolioItem.length !== DataFilter.count && ! show_button ) {
							$buttonLoadMore.show();
						}else{
							$buttonLoadMore.hide();
						}
					}

					return false;
				} );

				PENCI.portfolioLoadMore.loadMore( $this, DataFilter );
				PENCI.portfolioLoadMore.infinityScroll( DataFilter );

			} ); // each .penci-portfolio

		}	// end if isotope & portfolio


		var $btnLoadMore = $( '.penci-plf-loadmore' );
		if ( ! $().isotope || ! $btnLoadMore.length ) {
			return false;
		}
	}

	PENCI.portfolioLoadMore = {
		btnLoadMore : $( '.penci-plf-loadmore' ),
		loadMore: function( $pfl_wapper, DataFilter ){
			var self = this;
			$( 'body' ).on( 'click', '.penci-ajax-more-button', function ( event ) {
				self.actionLoadMore( $( this ),$pfl_wapper, DataFilter );
			} );
		},
		infinityScroll: function( DataFilter ){
			var self = this,
				$handle = $( '.penci-plf-loadmore' ),
				$button_load = $handle.find( '.penci-ajax-more-button' );

			if ( $handle.hasClass( 'penci-infinite-scroll' ) ) {
				$( window ).on( 'scroll', function () {

					var hT = $button_load.offset().top,
						hH = $button_load.outerHeight(),
						wH = $( window ).height(),
						wS = $( this ).scrollTop();

					if ( ( wS > ( hT + hH - wH ) ) && $button_load.length ) {
						var $pfl_wapper = $button_load.closest( '.penci-portfolio' );
						self.actionLoadMore( $button_load,$pfl_wapper, DataFilter );
					}
				} ).scroll();
			}
		},
		actionLoadMore: function ( $button_load, $pfl_wapper, DataFilter ) {
			if ( $button_load.hasClass( 'loading-portfolios' ) ) {
				return false;
			}

			$button_load.addClass( 'loading-portfolios' );

			var mesNoMore = $button_load.data( 'mes_no_more' ),
				mes = $button_load.data( 'mes' );

			DataFilter.pflShowIds = [];

			$button_load.closest('.wrapper-penci-portfolio').find( '.portfolio-item' ).each( function ( t, e ) {
				DataFilter.pflShowIds.push( $( e ).data( 'pflid' ) );
			} );

			var data = {
				action: 'penci_pfl_more_post_ajax',
				datafilter: DataFilter,
				nonce: ajax_var_more.nonce
			};
			$.post( ajax_var_more.url, data, function ( response ) {
				if ( ! response.data.items ) {
					$button_load.find( '.ajax-more-text' ).html( mesNoMore );
					$button_load.removeClass( 'loading-portfolios' );

					$button_load.closest( '.wrapper-penci-portfolio' ).find( '.penci-portfolio-filter li.active' ).addClass( 'loadmore-finish' );

					setTimeout( function () {
						$button_load.parent().parent().hide();
						$button_load.find( '.ajax-more-text' ).html( mes );
					}, 1200 );

					return false;
				}

				var $wrap_content = $button_load.closest( '.wrapper-penci-portfolio' ).find( '.penci-portfolio' ),
					$data = $( response.data.items );

				$wrap_content.find( '.inner-portfolio-posts' ).append( $data );
				$wrap_content.isotope( 'appended', $data ).imagesLoaded( function () {
					$wrap_content.isotope( 'layout' );
				} );

				$('.penci-lazy').Lazy({
					effect: 'fadeIn',
					effectTime: 300,
					scrollDirection: 'both'
				});

				$( ".container" ).fitVids();
				
				$( 'a[data-rel^="penci-gallery-image-content"]' ).magnificPopup( {
					type               : 'image',
					closeOnContentClick: true,
					closeBtnInside     : false,
					fixedContentPos    : true,
					image              : {
						verticalFit: true
					},
					gallery : {
						enabled: true
					},
					zoom               : {
						enabled : true,
						duration: 300
					}
				} );

				$wrap_content.addClass( 'loaded' );

				$('.portfolio-item .inner-item-portfolio').each( function () {
					var $this = $( this );
					$this.one( 'inview', function ( event, isInView, visiblePartX, visiblePartY ) {
						$this.addClass( 'animated' );
					} ); // inview
				} ); // each

				$button_load.removeClass( 'loading-portfolios' );
			} );

			$.ajax( {
				type: 'POST',
				dataType: 'html',
				url: ajax_var_more.url,
				data: 'datafilter=' + DataFilter + '&action=penci_pfl_more_post_ajax&nonce=' + ajax_var_more.nonce,
				success: function ( data ) {


				},
				error: function ( jqXHR, textStatus, errorThrown ) {
				}

			} );

		}
	}

	/* Gallery
	 ----------------------------------------------------------------*/
	PENCI.gallery = function () {
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
				var $this = $(this).children();
				if ($this.attr('data-cap') && ! $this.hasClass( 'added-caption' ) ) {
					var $title = $this.attr('data-cap');
					if( $title !== 'undefined' ){
						$this.children().append('<div class="caption">' + $title + '</div>');
						$this.addClass('added-caption');
					}

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
							$this.children().addClass( 'animated' );
						} ); // inview
					} ); // each

				} );
			}
		});
	},
	
	/* Jarallax
	 ----------------------------------------------------------------*/
	PENCI.Jarallax = function () {
		if ( ! $.fn.jarallax || ! $( '.penci-jarallax' ).length ) {
			return false;
		}
		$( '.penci-jarallax' ).each( function () {
			var $this = $( this ),
				$jarallaxArgs = {};

			$this.imagesLoaded( { background: true }, function () {
				jarallax( $this, $jarallaxArgs );
			} );


		} );
	},
	
	/* Related Popup
	 ----------------------------------------------------------------*/
	PENCI.RelatedPopup = function () {
		if ( $( '.penci-rlt-popup' ).length ) {
			var rltpopup = $('.penci-rlt-popup'),
				rltclose = $('.penci-rlt-popup .penci-close-rltpopup');
			$(window).load(function() {
				$('.penci-flag-rlt-popup').bind('inview', function(event, isInView, visiblePartX, visiblePartY) {
					if ( ! rltpopup.hasClass( 'rltpopup-notshow-again' ) && isInView ) {
						rltpopup.addClass('rltpopup-show-up');
						
						rltclose.click(function(e) {
							e.preventDefault();
							rltpopup.removeClass('rltpopup-show-up').addClass('rltpopup-notshow-again');
						});
					}
				});
				rltclose.click(function(e) {
					e.preventDefault();
					rltpopup.removeClass('rltpopup-show-up').addClass('rltpopup-notshow-again');
				});
			});
		}
	},

	PENCI.extraFunction = {
		init: function () {
			this.counterUp();
			this.progressBar();
			this.login();
			this.register();
			this.map();
		},
		progressBar: function (){
			if ( $( '.penci-review-process' ).length ) {
				$( '.penci-review-process' ).each( function () {
					var $this = $( this ),
						$bar = $this.children(),
						$bar_w = $bar.data( 'width' ) * 10;
					$this.one( 'inview', function ( event, isInView, visiblePartX, visiblePartY ) {
						$bar.animate( {width: $bar_w + '%'}, 1000 );
					} ); // bind inview
				} ); // each
			}

			if ( $.fn.easyPieChart && $( '.penci-piechart' ).length ) {
				$( '.penci-piechart' ).each( function () {
					var $this = $( this );
					$this.one( 'inview', function ( event, isInView, visiblePartX, visiblePartY ) {
						var chart_args = {
							barColor: $this.data( 'color' ),
							trackColor: $this.data( 'trackcolor' ),
							scaleColor: false,
							lineWidth: $this.data( 'thickness' ),
							size: $this.data( 'size' ),
							animate: 1000
						};
						$this.easyPieChart( chart_args );
					} ); // bind inview
				} ); // each
			}
		},
		counterUp: function () {
			var $counterup = $( '.penci-counterup-number' );

			if ( ! $.fn.counterUp || ! $counterup.length ) {
				return false;
			}

			$counterup.each( function () {
				var $this = $( this );

				$this.one( 'inview', function ( event, isInView, visiblePartX, visiblePartY ) {
					setTimeout( function () {
						$( {countNum: $this.text()} ).animate(
							{
								countNum: $this.attr( 'data-count' )
							},

							{
								duration: 2000,
								easing: 'linear',
								step: function () {
									$this.text( Math.floor( this.countNum ) );
								},
								complete: function () {
									$this.text( this.countNum );
								}
							}
						);
					}, $this.attr( 'data-delay' ) );


				} ); // bind inview
			} );
		},
		login: function () {
			var $body = $( 'body' ),
				$loginform = $( '#penci-loginform' ),
				$loginContainer = $loginform.parent( '.penci-login-wrap' );

			if( ! $loginform.length ) {
				return false;
			}

			$body.on( 'click', '.penci-user-register', function ( e ) {
				e.preventDefault();

				var $this = $( this ),
					$parent = $this.closest( '.penci-login-register' );

				$parent.find( '.penci-login-wrap' ).addClass( 'hidden' );
				$parent.find( '.penci-register-wrap' ).removeClass( 'hidden' );
			} );

			$( '#penci-user-login,#penci-user-pass' ).on( 'focus', function () {
				$( this ).removeClass( 'invalid' );
			} );

			$loginform.submit( function ( e ) {
				var $this = $( this ),
					inputUsername = $this.find( '#penci-user-login' ),
					inputPass = $this.find( '#penci-user-pass' ),
					valUsername = inputUsername.val(),
					valPass = inputPass.val(),
					captcha = $this.find( '.g-recaptcha-response' ).val();

				if ( inputUsername.length > 0 && valUsername == '' ) {
					inputUsername.addClass( 'invalid' );
					e.preventDefault();
				}

				if ( inputPass.length > 0 && valPass == '' ) {
					inputPass.addClass( 'invalid' );
					e.preventDefault();
				}

				if ( valUsername == '' || valPass == '' ) {
					return false;
				}

				$loginContainer.parent().addClass( 'ajax-loading' );
				$loginContainer.find( '.message' ).slideDown().remove();

				var data = {
					action: 'penci_login_ajax',
					username: valUsername,
					password: valPass,
					captcha: captcha,
					remember: $loginContainer.find( '#rememberme' ).val()
				};

				$.post( ajax_var_more.url, data, function ( response ) {
					$loginContainer.parent().removeClass( 'ajax-loading' );
					$loginContainer.append( response.data );
					if ( ! response.success ) {
						return;
					}

					window.location = window.location;
				} );

				e.preventDefault();
				return false;
			} );
		},
		register: function () {
			var $body = $( 'body' ),
				$registerform = $( '#penci-registration-form' ),
				$registerContainer = $registerform.closest( '.penci-register-wrap' );

			if( ! $registerform.length ) {
				return false;
			}

			$body.on( 'click', '.penci-user-login-here', function ( e ) {
				e.preventDefault();

				var $this = $( this ),
					$parent = $this.closest( '.penci-login-register' );

				$parent.find( '.penci-login-wrap' ).removeClass( 'hidden' );
				$parent.find( '.penci-register-wrap' ).addClass( 'hidden' );

				return false;
			} );

			var $allInput = $( '.penci_user_name,.penci_user_name,.penci_user_email,.penci_user_pass,.penci_user_pass_confirm' );
			$allInput.on( 'focus', function () {
				$( this ).removeClass( 'invalid' );
			} );

			$registerform.submit( function ( e ) {
				e.preventDefault();

				var $this = $( this ),
					inputUsername = $this.find( '.penci_user_name' ),
					inputEmail = $this.find( '.penci_user_email' ),
					$inputPass = $this.find( '.penci_user_pass' ),
					$inputPassConfirm = $this.find( '.penci_user_pass_confirm' ),
					valUsername = inputUsername.val(),
					valEmail = inputEmail.val(),
					valPass = $inputPass.val(),
					valPassConfirm = $inputPassConfirm.val(),
					captcha = $this.find( '.g-recaptcha-response' ).val();

				$allInput.removeClass( 'invalid' );

				if ( inputUsername.length > 0 && valUsername == '' ) {
					inputUsername.addClass( 'invalid' );
					event.preventDefault();
				}

				if ( inputEmail.length > 0 && valEmail == '' ) {
					inputEmail.addClass( 'invalid' );
					event.preventDefault();
				}

				if ( $inputPass.length > 0 && valPass == '' ) {
					$inputPass.addClass( 'invalid' );
					event.preventDefault();
				}

				if ( $inputPassConfirm.length > 0 && valPassConfirm == '' ) {
					$inputPassConfirm.addClass( 'invalid' );
					event.preventDefault();
				}
				if ( valUsername == '' || valEmail == '' || valPass == '' || valPassConfirm == '' ) {
					return false;
				}

				// Password does not match the confirm password
				if ( valPassConfirm !== valPass ) {
					$inputPass.addClass( 'invalid' );
					$inputPassConfirm.addClass( 'invalid' );
					$registerContainer.append( ajax_var_more.errorPass );
					event.preventDefault();

					return false;
				}
				$registerContainer.parent().addClass( 'ajax-loading' );
				$registerContainer.find( '.message' ).slideDown().remove();

				var data = {
					action: 'penci_register_ajax',
					fistName: $this.find( '.penci_first_name' ).val(),
					lastName: $this.find( '.penci_last_name' ).val(),
					username: valUsername,
					password: valPass,
					confirmPass: valPassConfirm,
					email: valEmail,
					captcha : captcha
				};

				$.post( ajax_var_more.url, data, function ( response ) {
					$registerContainer.parent().removeClass( 'ajax-loading' );
					$registerContainer.append( response.data );
					if ( ! response.success ) {
						return;
					}
					window.location = window.location;
				} );

				event.preventDefault();
				return false;
			} );

			return false;
		},
		map: function () {
			if ( ! $( '.penci-google-map' ).length ) {
				return false;
			}
			$( '.penci-google-map' ).each( function () {

				var map = $( this ),
					Option = map.data( "map_options" ),
					mapID = map.attr( 'id' );


				var mapTypePre = google.maps.MapTypeId.ROADMAP;
				switch ( Option.map_type ) {
					case"satellite":
						mapTypePre = google.maps.MapTypeId.SATELLITE;
						break;
					case"hybrid":
						mapTypePre = google.maps.MapTypeId.HYBRID;
						break;
					case"terrain":
						mapTypePre = google.maps.MapTypeId.TERRAIN
				}
				var latLng = new google.maps.LatLng( - 34.397, 150.644 );
				var map = new google.maps.Map( document.getElementById( mapID ), {
					zoom: parseInt( Option.map_zoom ),
					center: latLng,
					mapTypeId: mapTypePre,
					panControl: Option.map_pan,
					zoomControl: Option.map_is_zoom,
					mapTypeControl: true,
					scaleControl: Option.map_scale,
					streetViewControl: Option.map_street_view,
					rotateControl: Option.map_rotate,
					overviewMapControl: Option.map_overview,
					scrollwheel: Option.map_scrollwheel
				} );
				var marker = new google.maps.Marker( {
					position: latLng,
					map: map,
					title: Option.marker_title,
					icon: Option.marker_img
				} );

				if ( Option.info_window ) {
					var infoWindow = new google.maps.InfoWindow( {
						content: Option.info_window
					} );

					google.maps.event.addListener( marker, "click", function () {
						infoWindow.open( map, marker );
					} );
				}

				if ( 'coordinates' == Option.map_using && Option.latitude && Option.longtitude ) {
					latLng = new google.maps.LatLng( Option.latitude, Option.longtitude );
					map.setCenter( latLng );
					marker.setPosition( latLng );
				} else {
					var geocoder = new google.maps.Geocoder();
					geocoder.geocode( {
						address: Option.address
					}, function ( results ) {
						var loc = results[0].geometry.location;
						latLng = new google.maps.LatLng( loc.lat(), loc.lng() );
						map.setCenter( latLng );
						marker.setPosition( latLng );
					} );
				}
			} );
		},
	},

	PENCI.VideosList = {
		// Init the module
		init: function () {
			PENCI.VideosList.play();
		},
		play: function () {
			if ( ! $( '.penci-video_playlist' ).length ) {
				return false;
			}
			$( '.penci-video_playlist' ).each( function ( idx, item ) {
				var $blockVideo = $( this ),
					$VideoF = $blockVideo.find( '.penci-video-frame' );

				var $height = $blockVideo.find( '.penci-video-nav' ).height(),
					$heightTitle = $blockVideo.find( '.penci-video-nav .penci-playlist-title' ).height()

				$blockVideo.find( '.penci-video-playlist-nav' ).css( 'height', $height - $heightTitle );
				// Init
				$VideoF.video();
				PENCI.VideosList.updateStatus( $blockVideo );

				// Show First video and remove the loader icon
				$VideoF.addVideoEvent( 'ready', function () {
					$VideoF.css( 'visibility', 'visible' ).fadeIn();
					$blockVideo.find( '.loader-overlay' ).remove();
				} );
				// Play videos
				$blockVideo.on( 'click', '.penci-video-playlist-item', function () {
					var $thisVideo = $( this ),
						frameID = $thisVideo.data( 'name' ),
						$thisFrame = $( '#' + frameID ),
						videoSrc = $thisVideo.data( 'src' ),
						videoNum = $thisVideo.find( '.penci-video-number' ).text();

					if ( $thisVideo.hasClass( 'is-playing' ) ) {
						$thisFrame.pauseVideo();
						return;
					}

					// Update the number of the playing video in the title section
					$blockVideo.find( '.penci-video-playing' ).text( videoNum );

					// Pause all Videos
					$blockVideo.find( '.penci-video-frame' ).each( function () {
						$( this ).pauseVideo().hide();
					} )

					// If the iframe not loaded before, add it
					if ( ! $thisFrame.length ) {
						// Add the loader icon
						$blockVideo.find( '.fluid-width-video-wrapper' ).prepend( '' );

						$blockVideo.find( '.fluid-width-video-wrapper' ).append( '<iframe class="penci-video-frame" id="' + frameID + '" src="' + videoSrc + '" frameborder="0" width="100%"" height="434" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>' );
						$thisFrame = $( '#' + frameID );

						$thisFrame.video(); // reinit

						$thisFrame.addVideoEvent( 'ready', function ( e, $thisFrame, video_type ) {
							$thisFrame.playVideo();
							$blockVideo.find( '.loader-overlay' ).remove();
						} );
					} else {
						$thisFrame.playVideo();
					}

					$thisFrame.css( 'visibility', 'visible' ).fadeIn();

					PENCI.VideosList.updateStatus( $blockVideo );

				} );
			} );
		},
		updateStatus: function ( $blockVideo ) {
			$blockVideo.find( '.penci-video-frame' ).each( function () {
				var $this = $( this ),
					$videoItem = $( "[data-name='" + $this.attr( 'id' ) + "']" );

				$this.addVideoEvent( 'play', function () {
					$videoItem.removeClass( 'is-paused' ).addClass( 'is-playing' );
				} );

				$this.addVideoEvent( 'pause', function () {
					$videoItem.removeClass( 'is-playing' ).addClass( 'is-paused' );
				} );

				$this.addVideoEvent( 'finish', function () {
					$videoItem.removeClass( 'is-paused is-playing' );
				} );
			} );
		}
	};


	/* Init functions
	 ---------------------------------------------------------------*/



	$(document).ready(function() {
		PENCI.general();
		PENCI.cookie();
		PENCI.main_sticky();
		PENCI.fixheadline();
		PENCI.featured_slider();
		PENCI.owl_slider();
		PENCI.fitvids();
		PENCI.sticky_sidebar();
		PENCI.mega_menu();
		PENCI.mobile_menu();
		PENCI.toggleMenuHumburger();
		PENCI.lightbox();
		PENCI.masonry();
		PENCI.video_background();
		PENCI.portfolio();
		PENCI.gallery();
		PENCI.Jarallax();
		PENCI.RelatedPopup();
		PENCI.extraFunction.init();
		PENCI.VideosList.init();
		$(window ).resize( function(){ PENCI.sticky_sidebar(); } );
	});
})(jQuery);	// EOF