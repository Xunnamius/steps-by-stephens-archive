/************************************************
  Copyright Dark Gray 2012. All Rights Reserved.
*************************************************/

!function($)
{
	// Safety offset
	var WINDOW_OFFSET = 250,
		REWRAP_MARGIN_BOTTOM = 179,
		STORE_PRODUCT_OFFSET = 65,
		HEAD_SLIDE_OFFSET = 156.5,
		INNERSLIDE_ANIM_CONFIG = { duration: 500, link: 'cancel' };
		
		STORE_OBJ_HEIGHT = null;
	
	Element.implement('click', function(fn)
	{
		var el = this;
		var evt = el.ownerDocument.createEvent('MouseEvents');
		evt.initMouseEvent('click', true, true, el.ownerDocument.defaultView, 1, 0, 0, 0, 0, false, false, false, false, 0, null);
		if(fn) fn();
		return el.dispatchEvent(evt);
	});
	
	window.addEvent('domready', function()
	{
		/* Set up environment */
		
		var hashNav 	= new HashNav(),
			viewHome 	= $('view-home'),
			moreSBS 	= $('moresbs'),
			originTop 	= moreSBS.getStyle('top').toInt() || 0,
			innerSlider	= $('inner-slider'),
			innerWrapper = $('inner-wrapper'),
			shopIMG = $('shop-img'),
			header = $$('header')[0];
		
		viewHome.prev = viewHome.getAllPrevious();
		viewHome.next = viewHome.getAllNext();
		
		innerSlider.set('tween', INNERSLIDE_ANIM_CONFIG);
		moreSBS.set('tween', { duration: 350, transition: 'circ:in:out', property: 'top', link: 'cancel' });
		
		moreSBS.toggle = function()
		{
			if(!this.retrieve('down'))
			{
				this.store('down', true);
				this.tween(0);
				$('moresbs-dropdown').set('text', 'less sbs');
			}
			
			else
			{
				this.store('down', false);
				this.tween(originTop);
				$('moresbs-dropdown').set('text', 'more sbs');
			}
		};
		
		var absoluteCenter = function()
		{
			$$('.absolute-center').each(function(child)
			{
				var parentSize = child.getParent() == document.body ?
						window.getSize() :
						child.getParent().getDimensions(),
					childSize = child.getDimensions();
				
				child.setStyles({
					left: (parentSize.x-childSize.x)/2,
					top: (parentSize.y-childSize.y)/2
				});
				
				child.setStyle('display', 'block');
			});
		},
		
		slideshow = function(el, data, time, instantChange)
		{
			var ticker = (function()
			{
				var randimg,
					backimg = el.getElement('img') || el;
				
				do {
					randimg = data.getRandom();
				} while(data.length > 1 && randimg == backimg.getProperty('src'));
				
				backimg.get('tween').start(0.15).chain(function()
				{ backimg.setProperty('src', randimg).tween(0.75); });
			});
			
			if(instantChange) ticker();
			return ticker.periodical(time);
		},
		
		adjustOverflow = function()
		{
			if(hashNav.getCurrent() == hashNav.options.defaultHome)
				innerWrapper.setStyle('overflow-y', 'hidden');
			else
				innerWrapper.setStyle('overflow-y', 'auto');
		},
		
		getPageOffset = function(page)
		{
			var retval = 0;
			
			switch(page)
			{
				case 'shop':
					retval = 2;
					break;
				
				case 'contact':
					retval = 1;
					break;
				
				case 'home':
					retval = 0;
					break;
				
				case 'mission':
					retval = -1;
					break;
				
				case 'about':
					retval = -2;
					break;
			}
			
			return retval;
		},
		
		setShopSelectorImages = function(images, gallerymode, eventful)
		{
			clearInterval(shopIMG.retrieve('slideshow'));
			
			var squares = $$('#square4 > div');
			
			if(eventful)
			{
				$('view-shop').addClass('square-eventful');
				shopIMG.set('src', images.getLast());
				
				if(!gallerymode)
				{
					$$('#view-shop div.active').removeClass('active');
					squares[0].addClass('active');
				}
			}
			
			else $('view-shop').removeClass('square-eventful');
			
			if(gallerymode)
				shopIMG.store('slideshow', slideshow(shopIMG, Array.clone(images), 5000, eventful ? false : true));
			
			images = Array.clone(images);
			squares.each(function(item){ item.getElement('img').set('src', images.pop()); });
		};
		
		// Initial positioning
		absoluteCenter();
		
		// Resize behavior
		window.addEvent('resize', function()
		{
			var windSize = window.getSize();
			
			// If we're at the home view-state, never show scroll bars...
			adjustOverflow();
			
			// Adjust inner-wrapper's height accordingly
			innerWrapper.setStyle('height', windSize.y - (header.getDimensions().height || 0));
			
			// Keep the view-state widths consistent with the window's width
			viewHome.setStyle('width', windSize.x);
			
			viewHome.prev.each(function(item, index)
			{
				item.setStyles({
					'width': windSize.x,
					'left': -windSize.x*(index+1)
				});
			});
			
			viewHome.next.each(function(item, index)
			{
				item.setStyles({
					'width': windSize.x,
					'left': windSize.x*(index+1)
				});
			});
			
			/*// Fix resize bug: make sure inner-slider's offset is correct after resize!
			if(window.retrieve('notavirgin'))
			{
				innerSlider.setStyle('left', windSize.x*getPageOffset(hashNav.getCurrent()));
				window.store('notavirgin', true);
			}*/
			
			// If a scrollbar is visible, hide footer
			innerWrapper.measure(function()
			{
				if(innerWrapper.getScrollSize().y > innerWrapper.getDimensions().y)
					$$('footer').addClass('noexist');
				else
					$$('footer').removeClass('noexist');
			});
			
			// Anything marked absolute-center shall now be absolutely-centered
			absoluteCenter();
		});
		
		/* Event handlers */
		
		// moresbs
		$('moresbs-dropdown').addEvent('click', function(e)
		{
			e.stop();
			hashNav.navigateTo('/more', true);
		});
		
		// back
		$$('.linkback').addEvent('click', function(e)
		{
			var page, iter = 0;
			
			do {
				page = hashNav.history.get(-2+iter);
				if(page && page[1])
					page = page[1].page;
				else page = null;
				
				hashNav.history.clear(); // So users don't get lost :3
			} while(--iter && page && page == 'more');
			
			if(!page)
				page = hashNav.options.defaultHome;
			
			hashNav.navigateTo('/'+page);
			e.stop();
		});
		
		// view-home
		$$('#view-home div.absolute-center a').each(function(item)
		{
			item.getElement('span').set('morph', { duration: 250, link: 'cancel' });
			item.addEvent('mouseenter', function()
			{
				this.getElement('span')
					.setStyle('border-width', 15)
					.morph({ width: 180, height: 180, top: -165, left: -45 });
			})
			
			item.addEvent('mouseleave', function()
			{
				var el = this.getElement('span');
				el.get('morph')
					.start({ width: 0, height: 0, top: -75, left: 45 })
					.chain(function(){ el.setStyle('border-width', 0); });
			});
		});
		
		// view-shop
		var firstChildDispose = function(){ this.getElement('option:first-child').dispose(); };
		
		$('shoe-select-original').addEvent('change:once', firstChildDispose)
			.addEvent('change', function()
			{
				$('gender_select').setProperty('disabled', false);
				$('shoe-title').set('text', this.get('value'));
				$('shoe_select').setProperty('value', this.get('value'));
				setShopSelectorImages(window.DG_GLOBAL_imgdata[this.get('value')], false, true);
			});
		
		$('gender_select').addEvent('change:once', firstChildDispose)
			.addEvent('change', function()
			{
				var start = 5, end = 14;
				if(this.get('value') == 'female')
				{
					start = 6;
					end = 13;
				}
				
				$('size_select').empty()
					.grab(new Element('option', { value: 0, text:  'Size...' }))
					.setProperty('disabled', false);
				$('slide-buynow').setProperty('disabled', true);
				for(var i=start; i<=end; ++i)
					$('size_select').grab(new Element('option', { value: i, text: i }));
			});
		
		$('size_select').addEvent('change:once', firstChildDispose)
			.addEvent('change', function()
			{
				$('slide-buynow').setProperty('disabled', false);
			});
		
		$$('#square4 > div').addEvent('click', function()
		{
			if($('view-shop').hasClass('square-eventful'))
			{
				$$('#view-shop div.active').removeClass('active');
				this.addClass('active');
				shopIMG.set('src', this.getElement('img').get('src'));
				clearInterval(shopIMG.retrieve('slideshow'));
			}
		});
		
		$('slide-buynow').addEvent('click', function(e)
		{
			e.stop();
			alert('ATTENTION: you MUST enter your FULL AND VALID email address on the following forms or RISK DELAY OF PROCESSING AND SHIPMENT OF YOUR PRODUCT!');
			var selectedShoe = $('shoe-select-original').get('value'),
				selectedGender = $('gender_select').get('value'),
				selectedSize = $('size_select').get('value');
			
			if([selectedShoe, selectedGender, selectedSize].contains("0") || !selectedShoe || !selectedGender || !selectedSize)
				alert('Invalid form data! Please refresh the page.');
			else
			{
				this.setProperty('disabled', true).set('text', 'Loading');
				$('bottom-buttons-form').setProperty('action', 'https://connect.firstdataglobalgateway.com/IPGConnect/gateway/processing').submit();
			}
		});
		
		/* Finish off environment and launch */
		
		// Set up HashNav & observers for the meta-page transitions
		var previousPage = hashNav.options.defaultHome;
		
		hashNav.registerObserver('moresbs', { page: 'more' }, function(e){ moreSBS.toggle(); });
		hashNav.registerObserver('main', { page: true }, function(e)
		{
			adjustOverflow();
			
			var currentPage = this.getCurrent(),
				windSize = window.getSize(),
				innerScroll = new Fx.Scroll(innerWrapper, { duration: 50 });
			
			// Already home...
			if([previousPage, 'more'].contains(currentPage))
				return;
			
			switch(currentPage)
			{
				case 'home':
					innerScroll.toTop().chain(function(){ innerSlider.tween('left', getPageOffset(currentPage)); });
					break;
				
				case 'shop':
				case 'contact':
				case 'mission':
				case 'about':
					innerSlider.tween('left', windSize.x*getPageOffset(currentPage));
					break;
			}
			
			previousPage = hashNav.getCurrent();
		});
		
		// Build out all the hash URIs
		$$('div#wrapper a[data-uri]').each(function(item)
		{ item.setProperty('href', hashNav.buildURI('/'+item.getProperty('data-uri'))); });
		
		// Make external rel links external
		$$('[rel="external"]').setProperty('target', '_blank');
		
		var err = function(errorText)
		{
			$('loading').addClass('error').set('text', 'XHR Error. Please report this glitch below!');
			if(console && console.error) console.error(errorText);
		};
		
		// Load slide show/shop images and other associated data
		(new Request.JSON({
			url: 'ajax.php',
			onError: function(text, error)
			{ err('XHR AJAX error ({0}): {1}'.substitute({ 0: error, 1: text })); },
			
			onFailure: function(xhr)
			{
				err('XHR external error (see xhr obj)');
				if(console && console.error) console.error(xhr);
			},
			
			onSuccess: function(imgdata)
			{
				if(!imgdata || imgdata.result != 'ok')
					return err('XHR internal error: '+(imgdata.data ? imgdata.data : 'bad response'));
				else if(!Object.getLength(imgdata.data))
					return err('XHR internal error: empty response set');
				
				var flattened;
				window.DG_GLOBAL_imgdata = imgdata = imgdata.data;
				
				Object.each(imgdata, function(item, key)
				{
					if(key != 'gallery')
						flattened = Array.from(flattened).combine(item);
				});
				
				// Images are always ordered by size (asc)
				Asset.image(imgdata.gallery[0],
				{
					onError: function()
					{ err('Error loading initial image. Please report this glitch!'); },
					
					onLoad: function()
					{
						var loadtime = new Date();

						// Position and show inner-slide
						innerSlider.setStyle('opacity', 0).removeClass('noexist');
						$('loading').addClass('noexist');
						
						$('background-slide').getElement('img')
							.set('tween', { duration: 250, property: 'opacity' })
							.setProperty('src', imgdata.gallery[0]);
						
						window.fireEvent('resize');
						
						// Fade in :3
						innerSlider.get('tween').start('opacity', 1).chain(function()
						{
							// If the asset isn't loaded before opacity is set to one, restart the counter (since photo just became visible)
							loadtime = new Date();
							
							innerSlider.set('tween', Object.merge({}, INNERSLIDE_ANIM_CONFIG, { duration: 1000, transition: 'expo:in:out' }));
							
							// Make sure the page is on a hash URI and not blank
							if(!hashNav.getCurrent())
								hashNav.navigateTo('/'+hashNav.options.defaultHome);
							else hashNav.triggerEvent(); // Bang!
						});
						
						// Load the remaining gallery images...
						Asset.images(imgdata.gallery.slice(1),
						{
							onError: function(c, i, s)
							{ err('Error processing gallery image #{0} ({1}): {2}'.substitute({ 0: c, 1: i, 2: s })); },
							
							onComplete: function()
							{
								// Setup view-home's slideshow object
								slideshow($('background-slide'),
									imgdata.gallery.shuffle(),
									8000+Number.random(-4000, 2000),
									(loadtime.valueOf() - (new Date()).valueOf())/1000 > 4 ? true : false);
							}
						});
						
						// Concurrently, begin loading the shop images...
						Asset.images(flattened,
						{
							onError: function(c, i, s)
							{ err('Error processing product image #{0} ({1}): {2}'.substitute({ 0: c, 1: i, 2: s })); },
							
							onComplete: function()
							{
								/* Configure shop */
								
								//Add shoes
								Object.each(imgdata, function(item, key)
								{
									if(key != 'gallery')
										$('shoe-select-original').grab(new Element('option', { value: key, text: key }));
								});
								
								if(!flattened.length)
								{
									shopIMG.set('alt', 'Error: no products available in shop?!');
									return;
								}
								
								// Start a slideshow of the shoes at random, attach to img element
								shopIMG.set('alt', 'Product image not available.')
									.set('tween', { duration: 250, property: 'opacity' });
								
								// Fade in some random images at the bottom
								setShopSelectorImages(flattened.shuffle(), true, true);
								
								// Allow user interaction
								$('view-shop').removeClass('loading');
								$('shoe-select-original').setProperty('disabled', false);
							}
						});
					}
				});
			}
		})).get({ ajax: 'yes', action: 'request', data: JSON.encode({ target: 'slideshowData' }) });
	});
}(document.id);