/*global Behavior, Asset, Delegator, imgdata */
// Let us begin!

Element.implement({
    isFullyVisible: function() {
        if(this.isVisible()) {
            var coord = this.getCoordinates(),
                winScroll = window.getScroll();

            return winScroll.y <= coord.top;
        } else {
            return false;
        }
    },

    isPartiallyVisible: function() {
        if(this.isVisible()) {
            var coord = this.getCoordinates(),
                winScroll = window.getScroll();

            return winScroll.y <= coord.bottom;
        } else {
            return false;
        }
    }
});

// Slideshow settings
var SLIDESHOW_PROPERTIES = {
    interim_delay: 6000 + Number.random(-3000, 2000),
    initial_delay_ignore_threshold: 4,
    tween_lower_bound: 0.15,
    tween_upper_bound: 0.75,
    transition_duration: 350
};

// The point at which the nav bar collapses
var BOOTSTRAP_GRID_BREAKPOINT = 768;

// How much padding to add to the bottom of the content div (footer separator)
var BOOTSTRAP_DEFAULT_SECTION_PADDING = 75;

// What styles to consider when computing the totalWidth of an element
var LOOKBOOK_COMPUTED_STYLES = { styles: ['margin'] };

// Fuck jQuery
~function($)
{
    /*var el = $$('.navbar-header')[0];
    var behavior = new Behavior().apply(el);
    var delegator = new Delegator({
        getBehavior: function(){ return behavior; }
    }).attach(el);

    behavior.setDelegator(delegator);*/



    // Smoothscrolling
    var smoothscroll = null;
    var brand = $$('.navbar-brand')[0];

    // Where are we?!
    var atIndex = !!$$('.template-index')[0];

    // Is everything done loading?
    var initialized = false;

    /* Slideshow configuration */
    var slideshow = null;

    if(atIndex)
    {
        slideshow = $('slideshow');
        slideshow.loading = slideshow.getElement('.loading');
        slideshow.canvas = slideshow.getElement('img');
        slideshow.container = slideshow.getElement('.container');
        slideshow.properties = SLIDESHOW_PROPERTIES;

        slideshow.setImg  = function(img)
        {
            slideshow.canvas.set('src', img);
        };

        slideshow.getImg  = function()
        {
            return slideshow.canvas.getProperty('src');
        };

        slideshow.canvas.set('alt', 'Product image failed to load!');
    }

    /*
     * Returns the size of the element (child) and its parent
     */
    var getSizes = function(child)
    {
        var parentSize = child.getParent() == document.body ?
                window.getSize() :
                child.getParent().getDimensions(),
            childSize = child.getDimensions();

        return [parentSize, childSize];
    };

    // Track page resizes and position pertinent element accordingly
    window.addEvent('resize', function()
    {
        var xy = window.getSize();

        $$('.viewport-sized').each(function(el)
        {
            el.setStyles({
                'width': xy.x,
                'height': xy.y
            });
        });

        $$('.vertical-center').each(function(child)
        {
            var sizes      = getSizes(child),
                parentSize = sizes[0],
                childSize  = sizes[1];

            child.setStyles({
                display: 'block',
                top: (parentSize.y-childSize.y)/2
            });
        });

        $$('.horizontal-center').each(function(child)
        {
            var sizes      = getSizes(child),
                parentSize = sizes[0],
                childSize  = sizes[1];

            child.setStyles({
                display: 'block',
                left: (parentSize.x-childSize.x)/2
            });
        });

        $$('.absolute-center').each(function(child)
        {
            var sizes      = getSizes(child),
                parentSize = sizes[0],
                childSize  = sizes[1];
            
            child.setStyles({
                display: 'block',
                left: (parentSize.x-childSize.x)/2,
                top: (parentSize.y-childSize.y)/2
            });
        });

        if(xy.x < BOOTSTRAP_GRID_BREAKPOINT)
        {
            if(smoothscroll)
                smoothscroll.setOptions({ offset: { x: 0, y: -81 } });

            // Add the ability for the nav bar links to close the nav-dropdown on click
            $$('.collapse .navbar-nav a').each(function(a)
            {
                if(a.get('href').charAt(0) == '#')
                {
                    a.setAttribute('data-toggle', 'collapse');
                    a.setAttribute('data-target', '#navbar-collapse');
                }
            });
        }

        else
        {
            if(smoothscroll)
                smoothscroll.setOptions({ offset: { x: 0, y: -64 } });

            // Add the ability for the nav bar links to close the nav-dropdown on click
            $$('.collapse .navbar-nav a').each(function(a)
            {
                if(a.get('href').charAt(0) == '#')
                {
                    a.setAttribute('data-toggle', '');
                    a.setAttribute('data-target', '');
                }
            });
        }

        // Make sure the footer stays on the bottom of the page
        $('content').setStyle('padding-bottom', $$('footer')[0].getSize().y + BOOTSTRAP_DEFAULT_SECTION_PADDING);
    }).fireEvent('resize');
    
    // Handle the scroll event and the slideshow control button (circles) animations
    if(atIndex)
    {
        brand.store('data-toggle', brand.get('data-toggle'));

        window.addEvent('scroll', function()
        {
            if(!slideshow.container.isPartiallyVisible())
            {
                $$('nav.navbar').addClass('navbar-inverse');
                brand.removeAttribute('data-toggle');
            }

            else
            {
                $$('nav.navbar').removeClass('navbar-inverse');
                brand.setAttribute('data-toggle', brand.retrieve('data-toggle'));
            }
        }).fireEvent('scroll');

        $$('#slideshow .container a').each(function(item)
        {
            item.getElement('span').set('morph', { duration: 250, link: 'cancel' });
            item.addEvent('mouseenter', function()
            {
                this.getElement('span').morph({ width: 220, height: 220, top: -170, left: -50 });
            });
            
            item.addEvent('mouseleave', function()
            {
                this.getElement('span').morph({ width: 0, height: 0, top: -62, left: 55 });
            });
        });
    }
    
    // Make sure the nav links bar lead to the proper places
    $$('a[href*="///"]').each(function(a)
    {
        a.set('href', a.get('href').substring(atIndex ? 3 : 2));
    });

    // Handle smooth scrolling
    smoothscroll = new Fx.SmoothScroll({
        links: 'a[href*="#"]',
        wheelStops: false,
        offset: { x: 0, y: -64 }
    });

    // Handle any errors
    var err = function(errorText)
    {
        if(atIndex)
            slideshow.loading.addClass('error').set('text', 'XHR Error (see console). Please report this glitch!');

        window.console.error(errorText);
    };

    // Bootstrap the slideshow if we're on the correct page
    if(atIndex)
    {
        // Load images
        // Images are always ordered by size (asc)
        if(imgdata.length)
        {
            Asset.image(imgdata[0].img,
            {
                onError: function()
                { err('Error loading initial image.'); },
                
                onLoad: function()
                {
                    var loadtime = new Date();

                    // Position and show middle-nav if screen not xs
                    slideshow.loading.addClass('hidden');
                    slideshow.container.getElement('.hidden').removeClass('hidden');
                    window.fireEvent('resize');

                    slideshow.setImg(imgdata[0].img);
                    window.fireEvent('resize');
                    
                    // Fade in :3
                    slideshow.canvas.get('tween').start('opacity', slideshow.properties.tween_upper_bound).chain(function()
                    {
                        // If the asset isn't loaded before opacity is set to one, restart the counter (since photo became visible)
                        loadtime = new Date();
                        
                        slideshow.canvas.set('tween',
                        {
                            duration: slideshow.properties.transition_duration,
                            transition: 'expo:in:out',
                            link: 'cancel',
                            property: 'opacity'
                        });
                    });
                    
                    // Load the remaining gallery images...
                    var imgdataRaw = imgdata.map(function(data) { return data.img; });
                    Asset.images(imgdataRaw.slice(1),
                    {
                        onError: function(c, i, s)
                        { err('Error processing gallery image #{0} (index {1}): {2}'.substitute({ 0: c, 1: i, 2: s || '(no source)' })); },
                        
                        onComplete: function()
                        {
                            // Setup slideshow
                            var imgdataShuffled = imgdataRaw.shuffle();
                            var ticker = (function()
                            {
                                var randimg,
                                    backimg = slideshow.getImg();
                                
                                do {
                                    randimg = imgdataShuffled.getRandom();
                                } while(imgdataShuffled.length > 1 && randimg == backimg);
                                
                                slideshow.canvas.get('tween').start(slideshow.properties.tween_lower_bound).chain(function()
                                {
                                    slideshow.setImg(randimg);
                                    slideshow.canvas.tween(slideshow.properties.tween_upper_bound);
                                });
                            });
                            
                            // Change instantly if too much time has elapsed (ie don't keep the user waiting)
                            var thresh = slideshow.properties.initial_delay_ignore_threshold;
                            if((loadtime.valueOf() - (new Date()).valueOf())/1000 > thresh)
                                ticker();

                            ticker.periodical(slideshow.properties.interim_delay);
                            initialized = true;
                            window.fireEvent('scroll');
                        }
                    });
                }
            });
        }

        else
            err('Server returned no image data?!');
    }

    else
        initialized = true;

    // Add onclick to fa-bars to stop the pulse animation
    $$('[data-toggle]').addEvent('click', function()
    {
        $$('.no-click').removeClass('no-click');
    });

    // Add powers to everything that looks like a lookbook slider
    $$('.lookbook-control').each(function(control)
    {
        control.addEvent('click', function(e)
        {
            e.stop();

            var target  = $$(this.get('data-lookbook-target'))[0];

            if(!target.retrieve('data-lookbook-started') || target.isMoving)
                return;

            var row     = target.getElement('.lookbook-inner-row'),
                moveam  = target.retrieve('data-lookbook-moveam'),
                current = target.retrieve('data-lookbook-current'),
                total   = row.retrieve('numberOfElements'),
                left    = this.get('data-lookbook-direction') == 'left';

            // We've gone too far!
            if(left && current <= 0 || !left && current >= total-1)
                return;

            target.isMoving = true;

            row.get('tween')
               .chain(function(){ target.isMoving = false; })
               .start('left', row.getStyle('left').toInt() + (left ? moveam : -moveam));

            // XXX: Fix some weird browser issues with MooTools/Chrome
            (function(){ target.isMoving = false; }).delay(500);
            
            target.store('data-lookbook-current', left ? current-1 : current+1);
        });
    });

    // Continue adding powers...
    $$('.lookbook-row-wrapper').each(function(wrapper)
    {
        // TODO: use MooTools as intended... make a god damned class -_-
        wrapper.resetPosition = function(moveToCurrentElement)
        {
            var row            = wrapper.getElement('.lookbook-inner-row'),
                item           = wrapper.getElement('a:first-child'),
                itemOuterWidth = item.getComputedSize(LOOKBOOK_COMPUTED_STYLES).totalWidth,

                // Where to start from (centers slider)
                startam = (wrapper.getComputedSize(
                    LOOKBOOK_COMPUTED_STYLES).totalWidth - item.getComputedSize(LOOKBOOK_COMPUTED_STYLES).totalWidth)/2;

            if(wrapper.isFullyVisible())
            {
                var starton = wrapper.get('data-lookbook-starton') || 0;

                if(starton == 'middle')
                    starton = (row.retrieve('numberOfElements')/2).floor();

                starton = starton.toInt();
                wrapper.addClass('no-scroll');

                var current = wrapper.retrieve('data-lookbook-current'),
                    moveto  = moveToCurrentElement ? (current !== null ? current : starton) : starton;

                var fx = row.get('tween');
                fx.chain(function()
                   {
                       wrapper.store('data-lookbook-started', true);
                       wrapper.store('data-lookbook-current', moveto);
                       fx.clearChain();
                   })
                  .start('left', startam - itemOuterWidth*moveto);

                // XXX: Fix some weird browser issues with MooTools/Chrome
                (function(){ wrapper.store('data-lookbook-started', true).store('data-lookbook-current', moveto); }).delay(500);

                // Store the movement amount so we don't have to do the calc later
                wrapper.store('data-lookbook-moveam', itemOuterWidth);
            }
        };
    });

    // And a few more...
    $$('.lookbook-inner-row').each(function(row)
    {
        var numberOfElements = row.getElements('.thumbnail').length;

        row.set('tween', { link: 'ignore' })
           .store('numberOfElements', numberOfElements)
           .setStyle('min-width',
                row.getElement('.thumbnail').getComputedSize(LOOKBOOK_COMPUTED_STYLES).totalWidth*numberOfElements);

        var imagesToLoad = [];

        row.getElements('.thumbnail').each(function(thumb)
        {
            thumb.set('title', 'Give us a sec while we load an HD version of this image...')
                 .addClass('wait')
                 .store('ready', false);

            imagesToLoad.push(thumb.getElement('img').get('data-img-master'));

            thumb.addEvent('click', function(e)
            {
                e.stop();

                if(!this.retrieve('ready'))
                    return;

                $('overlay-img').set('src', this.getElement('img').get('data-img-master'));
                window.fireEvent('resize'); // Fired to take advantage of the automatic alignment provided by .absolute-center
                $('overlay').removeClass('invis');
                (function(){ window.fireEvent('resize'); }).delay(250); // Some browsers suck. Let's accommodate them.
            });
        });

        Asset.images(imagesToLoad,
        {
            onError: function(c, i, s)
            { err('Error processing lookbook image #{0} (index {1}): {2}'.substitute({ 0: c, 1: i, 2: s || '(no source)' })); },
            
            onProgress: function(counter, index, source)
            {
                $$('img[data-img-master="//'+source.split('//').getLast()+'"] !> .thumbnail')
                    .store('ready', true)
                    .removeClass('wait')
                    .set('title', 'Click for a larger image');
            }
        });
    });

    // More scroll and resize event powers (pertaining specifically to the lookbook)
    window
        .addEvent('scroll', function()
        {
            if(!initialized)
                return;

            $$('.lookbook-row-wrapper:not(.no-scroll)').each(function(wrapper)
            {
                wrapper.resetPosition(false);
            });
        })
        .addEvent('resize', function()
        {
            if(!initialized)
                return;

            $$('.lookbook-row-wrapper').each(function(wrapper)
            {
                wrapper.resetPosition(true);
            });
        });

    // All events pertaining to the overlay
    window.addEvent('scroll', function()
    {
        $('overlay').addClass('invis');
    });

    $('overlay').addEvent('click', function(e)
    {
        e.stop();
        this.addClass('invis');
    });

    // Update the viewport when we hope everything is ready for us
    (function(){ window.fireEvent('resize').fireEvent('scroll'); }).delay(250);
}(document.id);
