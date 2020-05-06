/*
---
description: A view manager for MooTools 1.4.5+ that enables a "complex" yet beautiful and enjoyable user experience.

license: MIT-style license

authors:
- Xunnamius

requires:
- core/1.4.5: [core, Types, Fx.Tween]
- more/1.4.0.1: [Element.Measure]

provides: [Fx.Transitional]
...
*/

/* documentation and updates @ http://github.com/Xunnamius/Complex.Transitional */
(function($) // Private
{
	var Version = 1.4,
		counter = 0,
		oppositeShift = [],
		active = [];
	
	this.Fx.Transitional = new Class({
		
		Implements: [Chain, Options],
		
		options: {
			innerContainer: $('inner_container'),
			stateContainer: $('state_container'),
			tweenSettings: null
		},
		
		initialize: function(options)
		{
			// Private
			var count = counter++;
			oppositeShift[count] = this.shift;
			active[count] = null;
			this._getInternalCounter = function(){ return count; };
			//
			
			this.setOptions(options);
			this.options.tweenSettings = Object.merge({
				duration: 375,
				transition: 'sine:out',
				link: 'chain'
			}, this.options.tweenSettings);
			
			if(!this.options.innerContainer || !this.options.stateContainer)
				throw 'ViewManager received incomplete initialization arguments. Neither can be null.';
				
			this.options.innerContainer.set('tween', this.options.tweenSettings);
			
			// Only one element should be a child of the inner element. That is our active element!
			var act = active[this._getInternalCounter()] = this.options.innerContainer.getChildren()[0];
			
			if(!act)
				throw 'ViewManager could not find a child element of the inner container.';
		},
		
		shiftLeft: function(target_id, delay)	{ this.percolate(target_id, delay, this.shiftLeft,	this.shiftRight); },
		shiftRight: function(target_id, delay)	{ this.percolate(target_id, delay, this.shiftRight, this.shiftLeft); },
		shiftUp: function(target_id, delay)		{ this.percolate(target_id, delay, this.shiftUp, 	this.shiftDown); },
		shiftDown: function(target_id, delay)	{ this.percolate(target_id, delay, this.shiftDown, 	this.shiftUp); },
		
		// Shifts the viewport randomly
		shift: function(target_id, delay)
		{
			var rand = Number.random(0, 1000);
			
			if(rand >= 750) rand = this.shiftUp(target_id, delay);
			else if(rand >= 500) rand = this.shiftRight(target_id, delay);
			else if(rand >= 250) rand = this.shiftDown(target_id, delay);
			else rand = this.shiftLeft(target_id, delay);
			
			return rand;
		},
		
		//* Added in 1.3
		shiftOpposite: function(target_id, delay){ oppositeShift[this._getInternalCounter()].call(this, target_id, delay); },
		
		// protected worker, added in 1.4
		percolate: function(target_id, delay, defineFunction, oppositeFunction)
		{
			var tween = this.options.innerContainer.get('tween');
			if(tween.isRunning())
				this.chain(function(){ this.percolate(target_id, delay, defineFunction,	oppositeFunction); }.bind(this));
			
			else
			{
				(function()
				{
					var original 	= this.options.innerContainer.getSize();
						target_id 	= $(target_id) || $(target_id[0]) || target_id[0] || target_id;
					
					oppositeShift[this._getInternalCounter()] = oppositeFunction;
					
					if(this.options.stateContainer.match(target_id.getParent()))
					{
						var vars = { strings: [], values: [0, 0, 0] };
						var styleObj = {}, rebase = false;
						
						switch(defineFunction)
						{
							case this.shiftUp:
							case this.shiftDown:
								vars.strings[0] = 'height';
								vars.strings[1] = 'top';
								
								vars.values[0] = original.y;
								vars.values[1] = this.options.innerContainer.getParent().getComputedSize().height;
								break;
							
							case this.shiftLeft:
							case this.shiftRight:
								vars.strings[0] = 'width';
								vars.strings[1] = 'left';
								
								vars.values[0] = original.x;
								vars.values[1] = this.options.innerContainer.getParent().getComputedSize().width;
								break;
						}
						
						switch(defineFunction)
						{
							case this.shiftRight:
							case this.shiftDown:
								vars.values[2] = 0;
								rebase = true;
								break;
							
							case this.shiftLeft:
							case this.shiftUp:
								vars.values[2] = -vars.values[0];
								styleObj[vars.strings[1]] = 0;
								break;
						}
						
						styleObj[vars.strings[0]] = (100 * parseFloat(vars.values[0])/parseFloat(vars.values[1]))+'%';
						
						// Expand to be twice its current width
						this.options.innerContainer.setStyle(vars.strings[0], vars.values[0]*2);
						
						// Add new content from the container
						target_id.dispose().inject(active[this._getInternalCounter()], !rebase ? 'after' : 'before');
						if(rebase) this.options.innerContainer.setStyle(vars.strings[1], -vars.values[0]);
						
						// Tween: top -> original width, then reset
						tween.start(vars.strings[1], vars.values[2]).
						chain(function()
						{
							var act = active[this._getInternalCounter()];
							if(act) act.dispose().inject(this.options.stateContainer);
							
							active[this._getInternalCounter()] = target_id;
							this.options.innerContainer.setStyles(styleObj);
							
							while(this.callChain());
							return this;
						}.bind(this));
					}
					
					else throw 'ViewManager received an invalid target_id "'+target_id+'" (not a direct descendant of the container?)';
				}.bind(this)).delay(delay||0, this);
			}
		}.protect(),
		
		// TODO: Implement a "cancel" function that stops the current animation, adds on to the ic, plays new animation, and then disposes of all disabled views!
	});
})(document.id);