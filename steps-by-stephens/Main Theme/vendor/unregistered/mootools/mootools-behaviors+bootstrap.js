
//This library: http://dev.clientcide.com/depender/build?download=true&version=MooTools+Bootstrap&excludeLibs=Core&require=Bootstrap%2FBehavior.BS.Dropdown&require=Bootstrap%2FCSSEvents&require=More-Behaviors%2FDelegator.FxReveal&require=More-Behaviors%2FBehavior.Accordion&excludeLibs=More
//Contents: Behavior:Source/Element.Data.js, Behavior:Source/BehaviorAPI.js, Behavior:Source/Behavior.js, More-Behaviors:Source/Fx/Behavior.FxAccordion.js, Bootstrap:Source/UI/CSSEvents.js, Behavior:Source/Event.Mock.js, Behavior:Source/Delegator.js, More-Behaviors:Source/Delegators/Delegator.FxReveal.js, Bootstrap:Source/UI/Bootstrap.js, Bootstrap:Source/UI/Bootstrap.Dropdown.js, Bootstrap:Source/Behaviors/Behavior.BS.Dropdown.js

// Begin: Source/Element.Data.js
/*
---
name: Element.Data
description: Stores data in HTML5 data properties
provides: [Element.Data]
requires: [Core/Element, Core/JSON]
script: Element.Data.js

...
*/
(function(){

	JSON.isSecure = function(string){
		//this verifies that the string is parsable JSON and not malicious (borrowed from JSON.js in MooTools, which in turn borrowed it from Crockford)
		//this version is a little more permissive, as it allows single quoted attributes because forcing the use of double quotes
		//is a pain when this stuff is used as HTML properties
		return (/^[,:{}\[\]0-9.\-+Eaeflnr-u \n\r\t]*$/).test(string.replace(/\\./g, '@').replace(/"[^"\\\n\r]*"/g, '').replace(/'[^'\\\n\r]*'/g, ''));
	};

	Element.implement({
		/*
			sets an HTML5 data property.
			arguments:
				name - (string) the data name to store; will be automatically prefixed with 'data-'.
				value - (string, number) the value to store.
		*/
		setData: function(name, value){
			return this.set('data-' + name.hyphenate(), value);
		},

		getData: function(name, defaultValue){
			var value = this.get('data-' + name.hyphenate());
			if (value != undefined){
				return value;
			} else if (defaultValue != undefined){
				this.setData(name, defaultValue);
				return defaultValue;
			}
		},

		/* 
			arguments:
				name - (string) the data name to store; will be automatically prefixed with 'data-'
				value - (string, array, or object) if an object or array the object will be JSON encoded; otherwise stored as provided.
		*/
		setJSONData: function(name, value){
			return this.setData(name, JSON.encode(value));
		},

		/*
			retrieves a property from HTML5 data property you specify
		
			arguments:
				name - (retrieve) the data name to store; will be automatically prefixed with 'data-'
				strict - (boolean) if true, will set the JSON.decode's secure flag to true; otherwise the value is still tested but allows single quoted attributes.
				defaultValue - (string, array, or object) the value to set if no value is found (see storeData above)
		*/
		getJSONData: function(name, strict, defaultValue){
			var value = this.get('data-' + name);
			if (value != undefined){
				if (value && JSON.isSecure(value)) {
					return JSON.decode(value, strict);
				} else {
					return value;
				}
			} else if (defaultValue != undefined){
				this.setJSONData(name, defaultValue);
				return defaultValue;
			}
		}

	});

})();

// Begin: Source/BehaviorAPI.js
/*
---
name: BehaviorAPI
description: HTML getters for Behavior's API model.
requires: [Core/Class, /Element.Data]
provides: [BehaviorAPI]
...
*/


(function(){
	//see Docs/BehaviorAPI.md for documentation of public methods.

	var reggy = /[^a-z0-9\-]/gi,
	    dots = /\./g;

	window.BehaviorAPI = new Class({
		element: null,
		prefix: '',
		defaults: {},

		initialize: function(element, prefix){
			this.element = element;
			this.prefix = prefix.toLowerCase().replace(dots, '-').replace(reggy, '');
		},

		/******************
		 * PUBLIC METHODS
		 ******************/

		get: function(/* name[, name, name, etc] */){
			if (arguments.length > 1) return this._getObj(Array.from(arguments));
			return this._getValue(arguments[0]);
		},

		getAs: function(/*returnType, name, defaultValue OR {name: returnType, name: returnType, etc}*/){
			if (typeOf(arguments[0]) == 'object') return this._getValuesAs.apply(this, arguments);
			return this._getValueAs.apply(this, arguments);
		},

		require: function(/* name[, name, name, etc] */){
			for (var i = 0; i < arguments.length; i++){
				if (this._getValue(arguments[i]) == undefined) throw new Error('Could not retrieve ' + this.prefix + '-' + arguments[i] + ' option from element.');
			}
			return this;
		},

		requireAs: function(returnType, name /* OR {name: returnType, name: returnType, etc}*/){
			var val;
			if (typeOf(arguments[0]) == 'object'){
				for (var objName in arguments[0]){
					val = this._getValueAs(arguments[0][objName], objName);
					if (val === undefined || val === null) throw new Error("Could not retrieve " + this.prefix + '-' + objName + " option from element.");
				}
			} else {
				val = this._getValueAs(returnType, name);
				if (val === undefined || val === null) throw new Error("Could not retrieve " + this.prefix + '-' + name + " option from element.");
			}
			return this;
		},

		setDefault: function(name, value /* OR {name: value, name: value, etc }*/){
			if (typeOf(arguments[0]) == 'object'){
				for (var objName in arguments[0]){
					this.setDefault(objName, arguments[0][objName]);
				}
				return this;
			}
			name = name.camelCase();

			switch (typeOf(value)){
				case 'object': value = Object.clone(value); break;
				case 'array': value = Array.clone(value); break;
				case 'hash': value = new Hash(value); break;
			}

			this.defaults[name] = value;
			var setValue = this._getValue(name);
			var options = this._getOptions();
			if (setValue == null){
				options[name] = value;
			} else if (typeOf(setValue) == 'object' && typeOf(value) == 'object') {
				options[name] = Object.merge({}, value, setValue);
			}
			return this;
		},

		refreshAPI: function(){
			delete this.options;
			this.setDefault(this.defaults);
			return;
		},

		/******************
		 * PRIVATE METHODS
		 ******************/

		//given an array of names, returns an object of key/value pairs for each name
		_getObj: function(names){
			var obj = {};
			names.each(function(name){
				var value = this._getValue(name);
				if (value !== undefined) obj[name] = value;
			}, this);
			return obj;
		},
		//gets the data-behaviorname-options object and parses it as JSON
		_getOptions: function(){
			try {
				if (!this.options){
					var options = this.element.getData(this.prefix + '-options', '{}');
					if (options === "") return this.options = {};
					if (options && options.substring(0,1) != '{') options = '{' + options + '}';
					var isSecure = JSON.isSecure(options);
					if (!isSecure) throw new Error('warning, options value for element is not parsable, check your JSON format for quotes, etc.');
					this.options = isSecure ? JSON.decode(options) : {};
					for (option in this.options) {
						this.options[option.camelCase()] = this.options[option];
					}
				}
			} catch (e){
				throw new Error('Could not get options from element; check your syntax. ' + this.prefix + '-options: "' + this.element.getData(this.prefix + '-options', '{}') + '"');
			}
			return this.options;
		},
		//given a name (string) returns the value for it
		_getValue: function(name){
			name = name.camelCase();
			var options = this._getOptions();
			if (!options.hasOwnProperty(name)){
				var inline = this.element.getData(this.prefix + '-' + name.hyphenate());
				if (inline) options[name] = inline;
			}
			return options[name];
		},
		//given a Type and a name (string) returns the value for it coerced to that type if possible
		//else returns the defaultValue or null
		_getValueAs: function(returnType, name, defaultValue){
			var value = this._getValue(name);
			if (value == null || value == undefined) return defaultValue;
			var coerced = this._coerceFromString(returnType, value);
			if (coerced == null) throw new Error("Could not retrieve value '" + name + "' as the specified type. Its value is: " + value);
			return coerced;
		},
		//given an object of name/Type pairs, returns those as an object of name/value (as specified Type) pairs
		_getValuesAs: function(obj){
			var returnObj = {};
			for (var name in obj){
				returnObj[name] = this._getValueAs(obj[name], name);
			}
			return returnObj;
		},
		//attempts to run a value through the JSON parser. If the result is not of that type returns null.
		_coerceFromString: function(toType, value){
			if (typeOf(value) == 'string' && toType != String){
				if (JSON.isSecure(value)) value = JSON.decode(value);
			}
			if (instanceOf(value, toType)) return value;
			return null;
		}
	});

})();

// Begin: Source/Behavior.js
/*
---
name: Behavior
description: Auto-instantiates widgets/classes based on parsed, declarative HTML.
requires: [Core/Class.Extras, Core/Element.Event, Core/Selectors, More/Table, /Element.Data, /BehaviorAPI]
provides: [Behavior]
...
*/

(function(){

	var getLog = function(method){
		return function(){
			if (window.console && console[method]){
				if(console[method].apply) console[method].apply(console, arguments);
				else console[method](Array.from(arguments).join(' '));
			}
		};
	};

	var PassMethods = new Class({
		//pass a method pointer through to a filter
		//by default the methods for add/remove events are passed to the filter
		//pointed to this instance of behavior. you could use this to pass along
		//other methods to your filters. For example, a method to close a popup
		//for filters presented inside popups.
		passMethod: function(method, fn){
			if (this.API.prototype[method]) throw new Error('Cannot overwrite API method ' + method + ' as it already exists');
			this.API.implement(method, fn);
			return this;
		},

		passMethods: function(methods){
			for (method in methods) this.passMethod(method, methods[method]);
			return this;
		}

	});



	var GetAPI = new Class({
		_getAPI: function(element, filter){
			var api = new this.API(element, filter.name);
			var getElements = function(apiKey, warnOrFail, multi){
				var method = warnOrFail || "fail";
				var selector = api.get(apiKey);
				if (!selector) api[method]("Could not find selector for " + apiKey);

				var result = Behavior[multi ? 'getTargets' : 'getTarget'](element, selector);
				if (!result || (multi && !result.length)) api[method]("Could not find any elements for target '" + apiKey + "' using selector '" + selector + "'");
				return result;
			};
			api.getElement = function(apiKey, warnOrFail){
				return getElements(apiKey, warnOrFail);
			};
			api.getElements = function(apiKey, warnOrFail){
				return getElements(apiKey, warnOrFail, true);
			};
			return api;
		}
	});

	var spaceOrCommaRegex = /\s*,\s*|\s+/g;

	BehaviorAPI.implement({
		deprecate: function(deprecated, asJSON){
			var set,
			    values = {};
			Object.each(deprecated, function(prop, key){
				var value = this.element[ asJSON ? 'getJSONData' : 'getData'](prop);
				if (value !== undefined){
					set = true;
					values[key] = value;
				}
			}, this);
			this.setDefault(values);
			return this;
		}
	});

	this.Behavior = new Class({

		Implements: [Options, Events, PassMethods, GetAPI],

		options: {
			//by default, errors thrown by filters are caught; the onError event is fired.
			//set this to *true* to NOT catch these errors to allow them to be handled by the browser.
			// breakOnErrors: false,
			// container: document.body,
			// onApply: function(elements){},
			//default error behavior when a filter cannot be applied
			onLog: getLog('info'),
			onError: getLog('error'),
			onWarn: getLog('warn'),
			enableDeprecation: true,
			selector: '[data-behavior]'
		},

		initialize: function(options){
			this.setOptions(options);
			this.API = new Class({ Extends: BehaviorAPI });
			var self = this;
			this.passMethods({
				getDelegator: this.getDelegator.bind(this),
				addEvent: this.addEvent.bind(this),
				removeEvent: this.removeEvent.bind(this),
				addEvents: this.addEvents.bind(this),
				removeEvents: this.removeEvents.bind(this),
				fireEvent: this.fireEvent.bind(this),
				applyFilters: this.apply.bind(this),
				applyFilter: this.applyFilter.bind(this),
				getContentElement: this.getContentElement.bind(this),
				cleanup: this.cleanup.bind(this),
				getContainerSize: function(){
					return this.getContentElement().measure(function(){
						return this.getSize();
					});
				}.bind(this),
				error: function(){ this.fireEvent('error', arguments); }.bind(this),
				fail: function(){
					var msg = Array.join(arguments, ' ');
					throw new Error(msg);
				},
				warn: function(){
					this.fireEvent('warn', arguments);
				}.bind(this)
			});
		},

		getDelegator: function(){
			return this.delegator;
		},

		setDelegator: function(delegator){
			if (!instanceOf(delegator, Delegator)) throw new Error('Behavior.setDelegator only accepts instances of Delegator.');
			this.delegator = delegator;
			return this;
		},

		getContentElement: function(){
			return this.options.container || document.body;
		},

		//Applies all the behavior filters for an element.
		//container - (element) an element to apply the filters registered with this Behavior instance to.
		//force - (boolean; optional) passed through to applyFilter (see it for docs)
		apply: function(container, force){
			var elements = this._getElements(container).each(function(element){
				var plugins = [];
				element.getBehaviors().each(function(name){
					var filter = this.getFilter(name);
					if (!filter){
						this.fireEvent('error', ['There is no filter registered with this name: ', name, element]);
					} else {
						var config = filter.config;
						if (config.delay !== undefined){
							this.applyFilter.delay(filter.config.delay, this, [element, filter, force]);
						} else if(config.delayUntil){
							this._delayFilterUntil(element, filter, force);
						} else if(config.initializer){
							this._customInit(element, filter, force);
						} else {
							plugins.append(this.applyFilter(element, filter, force, true));
						}
					}
				}, this);
				plugins.each(function(plugin){
					if (this.options.verbose) this.fireEvent('log', ['Firing plugin...']);
					plugin();
				}, this);
			}, this);
			this.fireEvent('apply', [elements]);
			return this;
		},

		_getElements: function(container){
			if (typeOf(this.options.selector) == 'function') return this.options.selector(container);
			else return document.id(container).getElements(this.options.selector);
		},

		//delays a filter until the event specified in filter.config.delayUntil is fired on the element
		_delayFilterUntil: function(element, filter, force){
			var events = filter.config.delayUntil.split(','),
			    attached = {},
			    inited = false;
			var clear = function(){
				events.each(function(event){
					element.removeEvent(event, attached[event]);
				});
				clear = function(){};
			};
			events.each(function(event){
				var init = function(e){
					clear();
					if (inited) return;
					inited = true;
					var setup = filter.setup;
					filter.setup = function(element, api, _pluginResult){
						api.event = e;
						return setup.apply(filter, [element, api, _pluginResult]);
					};
					this.applyFilter(element, filter, force);
					filter.setup = setup;
				}.bind(this);
				element.addEvent(event, init);
				attached[event] = init;
			}, this);
		},

		//runs custom initiliazer defined in filter.config.initializer
		_customInit: function(element, filter, force){
			var api = this._getAPI(element, filter);
			api.runSetup = this.applyFilter.pass([element, filter, force], this);
			filter.config.initializer(element, api);
		},

		//Applies a specific behavior to a specific element.
		//element - the element to which to apply the behavior
		//filter - (object) a specific behavior filter, typically one registered with this instance or registered globally.
		//force - (boolean; optional) apply the behavior to each element it matches, even if it was previously applied. Defaults to *false*.
		//_returnPlugins - (boolean; optional; internal) if true, plugins are not rendered but instead returned as an array of functions
		//_pluginTargetResult - (obj; optional internal) if this filter is a plugin for another, this is whatever that target filter returned
		//                      (an instance of a class for example)
		applyFilter: function(element, filter, force, _returnPlugins, _pluginTargetResult){
			var pluginsToReturn = [];
			if (this.options.breakOnErrors){
				pluginsToReturn = this._applyFilter.apply(this, arguments);
			} else {
				try {
					pluginsToReturn = this._applyFilter.apply(this, arguments);
				} catch (e){
					this.fireEvent('error', ['Could not apply the behavior ' + filter.name, e.message]);
				}
			}
			return _returnPlugins ? pluginsToReturn : this;
		},

		//see argument list above for applyFilter
		_applyFilter: function(element, filter, force, _returnPlugins, _pluginTargetResult){
			var pluginsToReturn = [];
			element = document.id(element);
			//get the filters already applied to this element
			var applied = getApplied(element);
			//if this filter is not yet applied to the element, or we are forcing the filter
			if (!applied[filter.name] || force){
				if (this.options.verbose) this.fireEvent('log', ['Applying behavior: ', filter.name, element]);
				//if it was previously applied, garbage collect it
				if (applied[filter.name]) applied[filter.name].cleanup(element);
				var api = this._getAPI(element, filter);

				//deprecated
				api.markForCleanup = filter.markForCleanup.bind(filter);
				api.onCleanup = function(fn){
					filter.markForCleanup(element, fn);
				};

				if (filter.config.deprecated && this.options.enableDeprecation) api.deprecate(filter.config.deprecated);
				if (filter.config.deprecateAsJSON && this.options.enableDeprecation) api.deprecate(filter.config.deprecatedAsJSON, true);

				//deal with requirements and defaults
				if (filter.config.requireAs){
					api.requireAs(filter.config.requireAs);
				} else if (filter.config.require){
					api.require.apply(api, Array.from(filter.config.require));
				}

				if (filter.config.defaults) api.setDefault(filter.config.defaults);

				//apply the filter
				if (Behavior.debugging && Behavior.debugging.contains(filter.name)) debugger;
				var result = filter.setup(element, api, _pluginTargetResult);
				if (filter.config.returns && !instanceOf(result, filter.config.returns)){
					throw new Error("Filter " + filter.name + " did not return a valid instance.");
				}
				element.store('Behavior Filter result:' + filter.name, result);
				if (this.options.verbose){
					if (result && !_pluginTargetResult) this.fireEvent('log', ['Successfully applied behavior: ', filter.name, element, result]);
					else this.fireEvent('warn', ['Behavior applied, but did not return result: ', filter.name, element, result]);
				}

				//and mark it as having been previously applied
				applied[filter.name] = filter;
				//apply all the plugins for this filter
				var plugins = this.getPlugins(filter.name);
				if (plugins){
					for (var name in plugins){
						if (_returnPlugins){
							pluginsToReturn.push(this.applyFilter.pass([element, plugins[name], force, null, result], this));
						} else {
							this.applyFilter(element, plugins[name], force, null, result);
						}
					}
				}
			}
			return pluginsToReturn;
		},

		//given a name, returns a registered behavior
		getFilter: function(name){
			return this._registered[name] || Behavior.getFilter(name);
		},

		getPlugins: function(name){
			return this._plugins[name] || Behavior._plugins[name];
		},

		//Garbage collects all applied filters for an element and its children.
		//element - (*element*) container to cleanup
		//ignoreChildren - (*boolean*; optional) if *true* only the element will be cleaned, otherwise the element and all the
		//	  children with filters applied will be cleaned. Defaults to *false*.
		cleanup: function(element, ignoreChildren){
			element = document.id(element);
			var applied = getApplied(element);
			for (var filter in applied){
				applied[filter].cleanup(element);
				element.eliminate('Behavior Filter result:' + filter);
				delete applied[filter];
			}
			if (!ignoreChildren) this._getElements(element).each(this.cleanup, this);
			return this;
		}

	});

	//Export these for use elsewhere (notabily: Delegator).
	Behavior.getLog = getLog;
	Behavior.PassMethods = PassMethods;
	Behavior.GetAPI = GetAPI;


	//Returns the applied behaviors for an element.
	var getApplied = function(el){
		return el.retrieve('_appliedBehaviors', {});
	};

	//Registers a behavior filter.
	//name - the name of the filter
	//fn - a function that applies the filter to the given element
	//overwrite - (boolean) if true, will overwrite existing filter if one exists; defaults to false.
	var addFilter = function(name, fn, overwrite){
		if (!this._registered[name] || overwrite) this._registered[name] = new Behavior.Filter(name, fn);
		else throw new Error('Could not add the Behavior filter "' + name  +'" as a previous trigger by that same name exists.');
	};

	var addFilters = function(obj, overwrite){
		for (var name in obj){
			addFilter.apply(this, [name, obj[name], overwrite]);
		}
	};

	//Registers a behavior plugin
	//filterName - (*string*) the filter (or plugin) this is a plugin for
	//name - (*string*) the name of this plugin
	//setup - a function that applies the filter to the given element
	var addPlugin = function(filterName, name, setup, overwrite){
		if (!this._plugins[filterName]) this._plugins[filterName] = {};
		if (!this._plugins[filterName][name] || overwrite) this._plugins[filterName][name] = new Behavior.Filter(name, setup);
		else throw new Error('Could not add the Behavior filter plugin "' + name  +'" as a previous trigger by that same name exists.');
	};

	var addPlugins = function(obj, overwrite){
		for (var name in obj){
			addPlugin.apply(this, [obj[name].fitlerName, obj[name].name, obj[name].setup], overwrite);
		}
	};

	var setFilterDefaults = function(name, defaults){
		var filter = this.getFilter(name);
		if (!filter.config.defaults) filter.config.defaults = {};
		Object.append(filter.config.defaults, defaults);
	};

	var cloneFilter = function(name, newName, defaults){
		var filter = Object.clone(this.getFilter(name));
		addFilter.apply(this, [newName, filter.config]);
		this.setFilterDefaults(newName, defaults);
	};

	//Add methods to the Behavior namespace for global registration.
	Object.append(Behavior, {
		_registered: {},
		_plugins: {},
		addGlobalFilter: addFilter,
		addGlobalFilters: addFilters,
		addGlobalPlugin: addPlugin,
		addGlobalPlugins: addPlugins,
		setFilterDefaults: setFilterDefaults,
		cloneFilter: cloneFilter,
		getFilter: function(name){
			return this._registered[name];
		}
	});
	//Add methods to the Behavior class for instance registration.
	Behavior.implement({
		_registered: {},
		_plugins: {},
		addFilter: addFilter,
		addFilters: addFilters,
		addPlugin: addPlugin,
		addPlugins: addPlugins,
		cloneFilter: cloneFilter,
		setFilterDefaults: setFilterDefaults
	});

	//This class is an actual filter that, given an element, alters it with specific behaviors.
	Behavior.Filter = new Class({

		config: {
			/**
				returns: Foo,
				require: ['req1', 'req2'],
				//or
				requireAs: {
					req1: Boolean,
					req2: Number,
					req3: String
				},
				defaults: {
					opt1: false,
					opt2: 2
				},
				//simple example:
				setup: function(element, API){
					var kids = element.getElements(API.get('selector'));
					//some validation still has to occur here
					if (!kids.length) API.fail('there were no child elements found that match ', API.get('selector'));
					if (kids.length < 2) API.warn("there weren't more than 2 kids that match", API.get('selector'));
					var fooInstance = new Foo(kids, API.get('opt1', 'opt2'));
					API.onCleanup(function(){
						fooInstance.destroy();
					});
					return fooInstance;
				},
				delayUntil: 'mouseover',
				//OR
				delay: 100,
				//OR
				initializer: function(element, API){
					element.addEvent('mouseover', API.runSetup); //same as specifying event
					//or
					API.runSetup.delay(100); //same as specifying delay
					//or something completely esoteric
					var timer = (function(){
						if (element.hasClass('foo')){
							clearInterval(timer);
							API.runSetup();
						}
					}).periodical(100);
					//or
					API.addEvent('someBehaviorEvent', API.runSetup);
				});
				*/
		},

		//Pass in an object with the following properties:
		//name - the name of this filter
		//setup - a function that applies the filter to the given element
		initialize: function(name, setup){
			this.name = name;
			if (typeOf(setup) == "function"){
				this.setup = setup;
			} else {
				Object.append(this.config, setup);
				this.setup = this.config.setup;
			}
			this._cleanupFunctions = new Table();
		},

		//Stores a garbage collection pointer for a specific element.
		//Example: if your filter enhances all the inputs in the container
		//you might have a function that removes that enhancement for garbage collection.
		//You would mark each input matched with its own cleanup function.
		//NOTE: this MUST be the element passed to the filter - the element with this filters
		//      name in its data-behavior property. I.E.:
		//<form data-behavior="FormValidator">
		//  <input type="text" name="email"/>
		//</form>
		//If this filter is FormValidator, you can mark the form for cleanup, but not, for example
		//the input. Only elements that match this filter can be marked.
		markForCleanup: function(element, fn){
			var functions = this._cleanupFunctions.get(element);
			if (!functions) functions = [];
			functions.include(fn);
			this._cleanupFunctions.set(element, functions);
			return this;
		},

		//Garbage collect a specific element.
		//NOTE: this should be an element that has a data-behavior property that matches this filter.
		cleanup: function(element){
			var marks = this._cleanupFunctions.get(element);
			if (marks){
				marks.each(function(fn){ fn(); });
				this._cleanupFunctions.erase(element);
			}
			return this;
		}

	});

	Behavior.debug = function(name){
		if (!Behavior.debugging) Behavior.debugging = [];
		Behavior.debugging.push(name);
	};

	Behavior.elementDataProperty = 'behavior';

	// element fetching

	/*
		private method
		given an element and a selector, fetches elements relative to
		that element. boolean 'multi' determines if its getElement or getElements
		special cases for when the selector == 'window' (returns the window)
		and selector == 'self' (returns the element)
		- for both of those, if multi is true returns
		  new Elements([self]) or new Elements([window])
	*/
	var getTargets = function(element, selector, multi){
		// get the targets
		if (selector && selector != 'self' && selector != 'window') return element[multi ? 'getElements' : 'getElement'](selector);
		if (selector == 'window') return multi ? new Elements([window]) : window;
		return multi ? new Elements([element]) : element;
	};

	/*
		see above; public interface for getting a single element
	*/
	Behavior.getTarget = function(element, selector){
		return getTargets(element, selector, false);
	};

	/*
		see above; public interface for getting numerous elements
	*/
	Behavior.getTargets = function(element, selector){
		return getTargets(element, selector, true);
	};

	Element.implement({

		addBehaviorFilter: function(name){
			return this.setData(Behavior.elementDataProperty, this.getBehaviors().include(name).join(' '));
		},

		removeBehaviorFilter: function(name){
			return this.setData(Behavior.elementDataProperty, this.getBehaviors().erase(name).join(' '));
		},

		getBehaviors: function(){
			var filters = this.getData(Behavior.elementDataProperty);
			if (!filters) return [];
			return filters.trim().split(spaceOrCommaRegex);
		},

		hasBehavior: function(name){
			return this.getBehaviors().contains(name);
		},

		getBehaviorResult: function(name){
			return this.retrieve('Behavior Filter result:' + name);
		}

	});


})();


// Begin: Source/Fx/Behavior.FxAccordion.js
/*
---
description: Creates an Fx.Accordion from any element with Accordion in its data-behavior property.  Uses the .toggle elements within the element as the toggles and the .target elements as the targets. 
provides: [Behavior.Accordion, Behavior.FxAccordion]
requires: [Behavior/Behavior, More/Fx.Accordion, Behavior/Element.Data, More/Object.Extras]
script: Behavior.Accordion.js
name: Behavior.Accordion
...
*/

Behavior.addGlobalFilter('Accordion', {
	deprecated: {
		headers:'toggler-elements',
		sections:'section-elements'
	},
	defaults: {
		// defaults from Fx.Accordion:
		display: 0,
		height: true,
		width: false,
		opacity: true,
		alwaysHide: false,
		trigger: 'click',
		initialDisplayFx: true,
		resetHeight: true,
		headers: '.header',
		sections: '.section'
	},
	setup: function(element, api){
		var options = Object.cleanValues(
			api.getAs({
				fixedHeight: Number,
				fixedWidth: Number,
				display: Number,
				show: Number,
				height: Boolean,
				width: Boolean,
				opacity: Boolean,
				alwaysHide: Boolean,
				trigger: String,
				initialDisplayFx: Boolean,
				resetHeight: Boolean
			})
		);
		var accordion = new Fx.Accordion(element.getElements(api.get('headers')), element.getElements(api.get('sections')), options);
		api.onCleanup(accordion.detach.bind(accordion));
		return accordion;
	}
});

// Begin: Source/UI/CSSEvents.js
/*
---

name: CSSEvents

license: MIT-style

authors: [Aaron Newton]

requires: [Core/DomReady]

provides: CSSEvents
...
*/

Browser.Features.getCSSTransition = function(){
	Browser.Features.transitionEnd = (function(){
		var el = document.createElement('tmp');

		var transEndEventNames = {
			'WebkitTransition' : 'webkitTransitionEnd'
		, 'MozTransition'    : 'transitionend'
		, 'OTransition'      : 'oTransitionEnd otransitionend'
		, 'transition'       : 'transitionend'
		};

		for (var name in transEndEventNames) {
			if (el.style[name] !== undefined) {
				return transEndEventNames[name];
			}
		}
	})();
	Browser.Features.cssTransition = !!Browser.Features.transitionEnd;

	Browser.Features.getCSSTransition = Function.from(Browser.Features.transitionEnd);
	return Browser.Features.transitionEnd;
};

window.addEvent("domready", Browser.Features.getCSSTransition);

// Begin: Source/Event.Mock.js
/*
---
name: Event.Mock

description: Supplies a Mock Event object for use on fireEvent

license: MIT-style

authors:
- Arieh Glazer

requires: Core/Event

provides: [Event.Mock]

...
*/

(function($,window,undef){

/**
 * creates a Mock event to be used with fire event
 * @param Element target an element to set as the target of the event - not required
 *  @param string type the type of the event to be fired. Will not be used by IE - not required.
 *
 */
Event.Mock = function(target,type){
	type = type || 'click';

	var e = {
		type: type,
		target: target
	};

	if (document.createEvent){
		e = document.createEvent('HTMLEvents');
		e.initEvent(
			type //event type
			, false //bubbles - set to false because the event should like normal fireEvent
			, true //cancelable
		);
	}

	e = new Event(e);

	e.target = target;

	return e;
};

})(document.id,window);

// Begin: Source/Delegator.js
/*
---
name: Delegator
description: Allows for the registration of delegated events on a container.
requires: [Core/Element.Delegation, Core/Options, Core/Events, /Event.Mock, /Behavior]
provides: [Delegator]
...
*/
(function(){

	var spaceOrCommaRegex = /\s*,\s*|\s+/g;

	var checkEvent = function(trigger, element, event){
		if (!event) return true;
		return trigger.types.some(function(type){
			var elementEvent = Element.Events[type];
			if (elementEvent && elementEvent.condition){
				return elementEvent.condition.call(element, event, type);
			} else {
				var eventType = elementEvent && elementEvent.base ? elementEvent.base : event.type;
				return eventType == type;
			}
		});
	};

	window.Delegator = new Class({

		Implements: [Options, Events, Behavior.PassMethods, Behavior.GetAPI],

		options: {
			// breakOnErrors: false,
			// onTrigger: function(trigger, element, event, result){},
			getBehavior: function(){},
			onLog: Behavior.getLog('info'),
			onError: Behavior.getLog('error'),
			onWarn: Behavior.getLog('warn')
		},

		initialize: function(options){
			this.setOptions(options);
			this._bound = {
				eventHandler: this._eventHandler.bind(this)
			};
			Delegator._instances.push(this);
			Object.each(Delegator._triggers, function(trigger){
				this._eventTypes.combine(trigger.types);
			}, this);
			this.API = new Class({ Extends: BehaviorAPI });
			this.passMethods({
				addEvent: this.addEvent.bind(this),
				removeEvent: this.removeEvent.bind(this),
				addEvents: this.addEvents.bind(this),
				removeEvents: this.removeEvents.bind(this),
				fireEvent: this.fireEvent.bind(this),
				attach: this.attach.bind(this),
				trigger: this.trigger.bind(this),
				error: function(){ this.fireEvent('error', arguments); }.bind(this),
				fail: function(){
					var msg = Array.join(arguments, ' ');
					throw new Error(msg);
				},
				warn: function(){
					this.fireEvent('warn', arguments);
				}.bind(this),
				getBehavior: function(){
					return this.options.getBehavior();
				}.bind(this)
			});

			this.bindToBehavior(this.options.getBehavior());
		},

		/*
			given an instance of Behavior, binds this delegator instance
			to the behavior instance.
		*/
		bindToBehavior: function(behavior){
			if (!behavior) return;
			this.unbindFromBehavior();
			this._behavior = behavior;
			if (this._behavior.options.verbose) this.options.verbose = true;
			if (!this._behaviorEvents){
				var self = this;
				this._behaviorEvents = {
					destroyDom: function(elements){
						Array.from(elements).each(function(element){
							self._behavior.cleanup(element);
							self._behavior.fireEvent('destroyDom', element);
						});
					},
					ammendDom: function(container){
						self._behavior.apply(container);
						self._behavior.fireEvent('ammendDom', container);
					}
				};
			}
			this.addEvents(this._behaviorEvents);
		},

		getBehavior: function(){
			return this._behavior;
		},

		unbindFromBehavior: function(){
			if (this._behaviorEvents && this._behavior){
				this._behavior.removeEvents(this._behaviorEvents);
				delete this._behavior;
			}
		},

		/*
			attaches this instance to a specified DOM element to
			monitor events to it and its children
		*/
		attach: function(target, _method){
			_method = _method || 'addEvent';
			target = document.id(target);
			if ((_method == 'addEvent' && this._attachedTo.contains(target)) ||
			    (_method == 'removeEvent') && !this._attachedTo.contains(target)) return this;
			// iterate over all the event types for registered filters and attach listener for each
			this._eventTypes.each(function(event){
				target[_method](event + ':relay([data-trigger])', this._bound.eventHandler);
			}, this);
			if (_method == 'addEvent') this._attachedTo.push(target);
			else this._attachedTo.erase(target);
			return this;
		},


		/*
			detaches this instance of delegator from the target
		*/
		detach: function(target){
			if (target) this.attach(target, 'removeEvent');
			else this._attachedTo.each(this.detach, this);
			return this;
		},


		/*
			invokes a specific trigger upon an element
		*/
		trigger: function(name, element, event, ignoreTypes, _api){
			var e = event;
			// if the event is a string, create an mock event object
			if (!e || typeOf(e) == "string") e = new Event.Mock(element, e);
			if (this.options.verbose) this.fireEvent('log', ['Applying trigger: ', name, element, event]);

			var result,
					trigger = this.getTrigger(name);
			// warn if the trigger isn't found and exit quietly
			if (!trigger){
				this.fireEvent('warn', 'Could not find a trigger by the name of ' + name);
			// check that the event type matches the types registered for the filter unless specifically ignoring types
			} else if (ignoreTypes || checkEvent(trigger, element, e)) {
				// invoke the trigger
				if (this.options.breakOnErrors){
					result = this._trigger(trigger, element, e, _api);
				} else {
					try {
						result = this._trigger(trigger, element, e, _api);
					} catch(error) {
						this.fireEvent('error', ['Could not apply the trigger', name, error.message]);
					}
				}
			}
			// log the event
			if (this.options.verbose && result) this.fireEvent('log', ['Successfully applied trigger: ', name, element, event]);
			else if (this.options.verbose) this.fireEvent('log', ['Trigger applied, but did not return a result: ', name, element, event]);
			// return the result of the trigger
			return result;
		},

		// returns the trigger object for a given trigger name
		getTrigger: function(triggerName){
			return this._triggers[triggerName] || Delegator._triggers[triggerName];
		},

		// adds additional event types for a given trigger
		addEventTypes: function(triggerName, types){
			this.getTrigger(triggerName).types.combine(Array.from(types));
			return this;
		},

		/******************
		 * PRIVATE METHODS
		 ******************/

		 /*
			invokes a trigger for a specified element
		 */
		_trigger: function(trigger, element, event, _api){
			// create an instance of the API if one not already passed in; atypical to specify one,
			// really only used for the multi trigger functionality to set defaults
			var api = _api || this._getAPI(element, trigger);

			// if we're debugging, stop
			if (Delegator.debugging && Delegator.debugging.contains(name)) debugger;

			// set defaults, check requirements
			if (trigger.defaults) api.setDefault(trigger.defaults);
			if (trigger.requireAs) api.requireAs(trigger.requireAs);
			if (trigger.require) api.require.apply(api, Array.from(trigger.require));

			// if the element is specified, check conditionals
			if (element && !this._checkConditionals(element, api)) return;

			// invoke the trigger, return result
			var result = trigger.handler.apply(this, [event, element, api]);
			this.fireEvent('trigger', [trigger, element, event, result]);
			return result;
		},

		/*
			checks the conditionals on a trigger. Example:

			// invoke the foo trigger if this link has the class "foo"
			// in this example, it will not
			<a data-trigger="foo" data-foo-options="
			  'if': {
					'self::hasClass': ['foo']
			  }
			">...</a>

			// inverse of above; invoke the foo trigger if the link
			// does NOT have the class "foo", which it doesn't, so
			// the trigger will be invoked
			<a data-trigger="foo" data-foo-options="
			  'unless': {
					'self::hasClass': ['foo']
			  }
			">...</a>

			this method is passed the element, the api instance, the conditional
			({ 'self::hasClass': ['foo'] }), and the type ('if' or 'unless').

			See: Delegator.verifyTargets for how examples of conditionals.
		*/
		_checkConditionals: function(element, api, _conditional){

			var conditionalIf, conditionalUnless, result = true;

			if (_conditional){
				conditionalIf = _conditional['if'];
				conditionalUnless = _conditional['unless'];
			} else {
				conditionalIf = api.get('if') ? api.getAs(Object, 'if') : null;
				conditionalUnless = api.get('unless') ? api.getAs(Object, 'unless') : null;
			}

			// no element? NO SOUP FOR YOU
			if (!element) result = false;
			// if this is an if conditional, fail if we don't verify
			if (conditionalIf && !Delegator.verifyTargets(element, conditionalIf, api)) result = false;
			// if this is an unless conditional, fail if we DO verify
			if (conditionalUnless && Delegator.verifyTargets(element, conditionalUnless, api)) result = false;

			// logging
			if (!result && this.options.verbose){
				this.fireEvent('log', ['Not executing trigger due to conditional', element, conditionType]);
			}

			return result;
		},

		/*
			event handler for all events we're monitoring on any of our attached DOM elements
		*/
		_eventHandler: function(event, target){
			// get the triggers from the target element
			var triggers = target.getTriggers();
			// if the trigger is of the special types handled by delegator itself,
			// run those and remove them from the list of triggers
			if (triggers.contains('Stop')) triggers.erase('Stop') && event.stop();
			if (triggers.contains('PreventDefault')) triggers.erase('PreventDefault') && event.preventDefault();
			if (triggers.contains('multi')) triggers.erase('multi') && this._handleMultiple(target, event);
			if (triggers.contains('any')) triggers.erase('any') && this._runSwitch('any', target, event);
			if (triggers.contains('first')) triggers.erase('first') && this._runSwitch('first', target, event, 'some');

			// execute the triggers
			triggers.each(function(trigger){
				this.trigger(trigger, target, event);
			}, this);
		},

		/*
			iterates over the special "multi" trigger configuration and invokes them
		*/
		_handleMultiple: function(element, event){
			// make an api reader for the 'multi' options
			var api = this._getAPI(element, { name: 'multi' });

			if (!this._checkConditionals(element, api)) return;

			// get the triggers (required)
			var triggers = api.getAs(Array, 'triggers');
			// if there are triggers, run them
			if (triggers && triggers.length) this._runMultipleTriggers(element, event, triggers);
		},

		/*
			given an element, event, and an array of triggers, run them;
			only used by the 'multi', 'any', and 'first' special delegators
		*/
		_runMultipleTriggers: function(element, event, triggers){
			// iterate over the array of triggers
			triggers.each(function(trigger){
				// if it's a string, invoke it
				// example: '.selector::trigger' << finds .selector and calls 'trigger' delegator on it
				if (typeOf(trigger) == 'string'){
					this._invokeMultiTrigger(element, event, trigger);
				} else if (typeOf(trigger) == 'object'){
					// if it's an object, iterate over it's keys and config
					// example:
					// { '.selector::trigger': {'arg':'whatevs'} } << same as above, but passes ['arg'] as argument
					//                                                to the trigger as *defaults* for the trigger
					Object.each(trigger, function(config, key){
						this._invokeMultiTrigger(element, event, key, config);
					}, this);
				}
			}, this);
		},

		/*
			invokes a trigger with an optional default configuration for each target
			found for the trigger.
			trigger example: '.selector::trigger' << find .selector and invoke 'trigger' delegator
		*/
		_invokeMultiTrigger: function(element, event, trigger, config){
			// split the trigger name
			trigger = this._splitTriggerName(trigger);
			if (!trigger) return; //craps out if the trigger is mal-formed
			// get the targets specified by that trigger
			var targets = Behavior.getTargets(element, trigger.selector);
			// iterate over each target
			targets.each(function(target){
				var api;
				// create an api for the trigger/element combo and set defaults to the config (if config present)
				if (config) api = this._getAPI(target, trigger).setDefault(config);
				// invoke the trigger
				this.trigger(trigger.name, target, event, true, api);
			}, this);
		},

		/*
			given a trigger name string, split it on "::" and return the name and selector
			invokes
		*/
		_splitTriggerName: function(str){
			var split = str.split('::'),
			    selector = split[0],
			    name = split[1];
			if (!name || !selector){
				this.fireEvent('error', 'could not invoke multi delegator for ' + str +
					'; could not split on :: to derive selector and trigger name');
				return;
			}
			return {
				name: name,
				selector: selector
			}
		},

		/*
			Runs the custom switch triggers. Examples:

			the 'first' trigger runs through all the groups
			checking their conditions until it finds one that
			passes, then executes the driggers defined in it.
			if no conditional clause is defined, that counts
			as a pass.

			<a data-trigger="first" data-first-switches="
				[
					{
						'if': {
							'self::hasClass': ['foo']
						},
						'triggers': [
							'.seletor::triggerName',
							'...another'
						]
					},
					{
						'if': {
							'.someThingElse::hasClass': ['foo']
						},
						'triggers': [
							'.seletor::triggerName',
							'...another'
						]
					},
					{
						'triggers': [
							'.selector::triggerName'
						]
					}
				]
			">...</a>

		*/
		_runSwitch: function(switchName, element, event, method){
			method = method || 'each'
			// make an api reader for the switch options
			var api = this._getAPI(element, { name: switchName }),
					switches = api.getAs(Array, 'switches');

			if (!this._checkConditionals(element, api)) return;

			switches[method](function(config){
				if (this._checkConditionals(element, api, config)){
					this._runMultipleTriggers(element, event, config['triggers'], method);
					return true;
				} else {
					return false;
				}
			}, this);
		},


		/*
			function that attaches listerners for each unique
			event type for filtesr as they're added (but only once)
		*/
		_onRegister: function(eventTypes){
			eventTypes.each(function(eventType){
				if (!this._eventTypes.contains(eventType)){
					this._attachedTo.each(function(element){
						element.addEvent(eventType + ':relay([data-trigger])', this._bound.eventHandler);
					}, this);
				}
				this._eventTypes.include(eventType);
			}, this);
		},

		_attachedTo: [],
		_eventTypes: [],
		_triggers: {}

	});

	Delegator._triggers = {};
	Delegator._instances = [];
	Delegator._onRegister = function(eventType){
		this._instances.each(function(instance){
			instance._onRegister(eventType);
		});
	};

	Delegator.register = function(eventTypes, name, handler, overwrite /** or eventType, obj, overwrite */){
		eventTypes = Array.from(eventTypes);
		if (typeOf(name) == "object"){
			var obj = name;
			for (name in obj){
				this.register.apply(this, [eventTypes, name, obj[name], handler]);
			}
			return this;
		}
		if (!this._triggers[name] || overwrite){
			if (typeOf(handler) == "function"){
				handler = {
					handler: handler
				};
			}
			handler.types = eventTypes;
			handler.name = name;
			this._triggers[name] = handler;
			this._onRegister(eventTypes);
		} else {
			throw new Error('Could add the trigger "' + name +'" as a previous trigger by that same name exists.');
		}
		return this;
	};

	Delegator.getTrigger = function(name){
		return this._triggers[name];
	};

	Delegator.addEventTypes = function(triggerName, types){
		var eventTypes = Array.from(types);
		var trigger = this.getTrigger(triggerName);
		if (trigger) trigger.types.combine(eventTypes);
		this._onRegister(eventTypes);
		return this;
	};

	Delegator.debug = function(name){
		if (!Delegator.debugging) Delegator.debugging = [];
		Delegator.debugging.push(name);
	};

	Delegator.setTriggerDefaults = function(name, defaults){
		var trigger = this.getTrigger(name);
		if (!trigger.defaults) trigger.defaults = {};
		Object.append(trigger.defaults, defaults);
	};

	Delegator.cloneTrigger = function(name, newName, defaults){
		var filter = Object.clone(this.getTrigger(name));
		this.register(filter.types, newName, filter);
		this.setTriggerDefaults(newName, defaults);
	}


	Delegator.implement('register', Delegator.register);

	Element.implement({

		addTrigger: function(name){
			return this.setData('trigger', this.getTriggers().include(name).join(' '));
		},

		removeTrigger: function(name){
			return this.setData('trigger', this.getTriggers().erase(name).join(' '));
		},

		getTriggers: function(){
			var triggers = this.getData('trigger');
			if (!triggers) return [];
			return triggers.trim().split(spaceOrCommaRegex);
		},

		hasTrigger: function(name){
			return this.getTriggers().contains(name);
		}

	});

})();


// Begin: Source/Delegators/Delegator.FxReveal.js
/*
---
description: Provides methods to reveal, dissolve, nix, and toggle using Fx.Reveal.
provides: [Delegator.FxReveal, Delegator.Reveal, Delegator.ToggleReveal, Delegator.Dissolve, Delegator.Nix]
requires: [Behavior/Delegator, More/Fx.Reveal]
script: Delegator.FxReveal.js
name: Delegator.FxReveal

...
*/
(function(){

	var triggers = {};

	['reveal', 'toggleReveal', 'dissolve', 'nix'].each(function(action){

		triggers[action] = {
			handler: function(event, link, api){
				var targets;
				if (api.get('target')){
					targets = new Elements([api.getElement('target')]);
				} else if (api.get('targets')){
					targets = api.getElements('targets');
				} else {
					targets = new Elements([link]);
				}

				var fxOptions = api.getAs(Object, 'fxOptions');
				if (fxOptions){
					targets.each(function(target){
						target.get('reveal').setOptions(fxOptions);
					});
				}
				if (action == 'toggleReveal') targets.get('reveal').invoke('toggle');
				else targets[action]();
				if (!api.getAs(Boolean, 'allowEvent')) event.preventDefault();
			}
		};

	});

	Delegator.register('click', triggers);

})();

// Begin: Source/UI/Bootstrap.js
/*
---

name: Bootstrap

description: The BootStrap namespace.

authors: [Aaron Newton]

license: MIT-style license.

provides: [Bootstrap]

...
*/
var Bootstrap = {
	version: 3
};

// Begin: Source/UI/Bootstrap.Dropdown.js
/*
---

name: Bootstrap.Dropdown

description: A simple dropdown menu that works with the Twitter Bootstrap css framework.

license: MIT-style license.

authors: [Aaron Newton]

requires:
 - /Bootstrap
 - Core/Element.Event
 - More/Element.Shortcuts

provides: Bootstrap.Dropdown

...
*/
Bootstrap.Dropdown = new Class({

	Implements: [Options, Events],

	options: {
		/*
			onShow: function(element){},
			onHide: function(elements){},
		*/
		ignore: 'input, select, label'
	},

	initialize: function(container, options){
		this.element = document.id(container);
		this.setOptions(options);
		this.boundHandle = this._handle.bind(this);
		document.id(document.body).addEvent('click', this.boundHandle);
	},

	hideAll: function(){
		var els = this.element.removeClass('open').getElements('.open').removeClass('open');
		this.fireEvent('hide', els);
		return this;
	},

	show: function(subMenu){
		this.hideAll();
		this.fireEvent('show', subMenu);
		subMenu.addClass('open');
		return this;
	},

	destroy: function(){
		this.hideAll();
		document.body.removeEvent('click', this.boundHandle);
		return this;
	},

	// PRIVATE

	_handle: function(e){
		var el = e.target;
		var open = el.getParent('.open');
		if (!el.match(this.options.ignore) || !open) this.hideAll();
		if (this.element.contains(el)) {
			var parent;
			if (el.match('[data-toggle="dropdown"]') || el.getParent('[data-toggle="dropdown"] !')){
				parent = el.getParent('.dropdown, .btn-group');
			}
			// backwards compatibility
			if (!parent) parent = el.match('.dropdown-toggle') ? el.getParent() : el.getParent('.dropdown-toggle !');
			if (parent){
				e.preventDefault();
				if (!open) this.show(parent);
			}
		}
	}
});

// Begin: Source/Behaviors/Behavior.BS.Dropdown.js
/*
---

name: Behavior.BS.Dropdown

description: Instantiates Bootstrap.Dropdown based on HTML markup.

license: MIT-style license.

authors: [Aaron Newton]

requires:
 - Behavior/Behavior
 - Bootstrap.Dropdown

provides: [Behavior.BS.Dropdown]

...
*/
Behavior.addGlobalFilters({
	'BS.Dropdown': {
		returns: Bootstrap.Dropdown,
		setup: function(el, api){
			return new Bootstrap.Dropdown(el);
		}
	}
});

