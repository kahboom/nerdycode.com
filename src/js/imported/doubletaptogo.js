/* ===========================================================
 * Short library doubletaptogo.js
 * It's great tut for this: http://osvaldas.info/drop-down-navigation-responsive-and-touch-friendly
 * 
 * Double touch and go to with main navigation drop down
 * This function work only in mobile and tablet device
 *
 * By Osvaldas Valutis, www.osvaldas.info
 * Available for use under the MIT License
 * ========================================================== */
(function ( $, window, document )
{
	'use strict';

	$.fn.doubleTouchToGo = function ()
	{
		if ( !( 'ontouchstart' in window ) && !navigator.msMaxTouchPoints && !navigator.userAgent.toLowerCase().match( /windows phone os 7/i ) )
			return false;

		this.each( function ()
		{
			var curItem = false;

			$( this ).on( 'click', function ( e )
			{
				var item = $( this );
				if ( item[0] != curItem[0] )
				{
					e.preventDefault();
					curItem = item;
				}
			} );

			$( document ).on( 'click touchstart MSPointerDown', function ( e )
			{
				var resetItem = true,
					parents = $( e.target ).parents();

				for ( var i = 0; i < parents.length; i++ )
					if ( parents[i] == curItem[0] )
						resetItem = false;

				if ( resetItem )
					curItem = false;
			} );
		} );
		return this;
	};
})( jQuery, window, document );