// -- File: /Users/guyveraghtert/sources/h-ubu/target/classes/assets/js/Hubu-Root.js ( Input 0 ) -- //
(function() {
	var scope, _ref, _ref1;
	scope = typeof global !== "undefined" && global !== null ? global : this;
	scope.HUBU = (_ref = scope.HUBU) != null ? _ref : {};
	scope.HUBU.extensions = (_ref1 = scope.HUBU.extensions) != null ? _ref1 : {};
	scope.hubu = function() {
		return scope.HUBU;
	};
	scope.getHubuExtensions = function() {
		return HUBU.extensions;
	};
	scope.getGlobal = function() {
		return scope;
	};
}).call(this);
// -- File: /Users/guyveraghtert/sources/h-ubu/target/classes/assets/js/Utils.js ( Input 1 ) -- //
(function() {
	var Exception, Logger, logger, utils, _ref, __slice = [].slice;
	HUBU.UTILS = (_ref = HUBU.UTILS) != null ? _ref : {};
	utils = HUBU.UTILS;
	getGlobal().namespace = function(target, name, block) {
		var item, top, _i, _len, _ref1, _ref2;
		if (arguments.length < 3) {
			_ref1 = [typeof exports !== "undefined" ? exports : window].concat(__slice.call(arguments)), target = _ref1[0], name = _ref1[1], block = _ref1[2];
		}
		top = target;
		_ref2 = name.split(".");
		for (_i = 0, _len = _ref2.length;_i < _len;_i++) {
			item = _ref2[_i];
			target = target[item] || (target[item] = {});
		}
		return block(target, top);
	};
	getGlobal().Logger = Logger = function() {
		Logger.DEBUG = 0;
		Logger.INFO = 1;
		Logger.WARNING = 2;
		Logger.ERROR = 3;
		Logger.prototype._header = "";
		Logger.prototype._level = Logger.INFO;
		function Logger(name) {
			if (name == null) {
				name = "";
			}
			if (name.length > 0) {
				this._header = "[" + name + "] ";
			}
		}
		Logger.prototype._getConsole = function() {
			if ((typeof window !== "undefined" && window !== null ? window.console : void 0) != null) {
				return window.console;
			}
			if ((typeof global !== "undefined" && global !== null ? global.console : void 0) != null) {
				return global.console;
			}
			return null;
		};
		Logger.prototype.log = function(message) {
			if (this._getConsole() != null) {
				this._getConsole().log("" + this._header + message);
				return true;
			}
			return false;
		};
		Logger.prototype.debug = function(message) {
			if (this._level <= Logger.DEBUG) {
				return this.log("DEBUG - " + message);
			}
			return false;
		};
		Logger.prototype.info = function(message) {
			if (this._level <= Logger.INFO) {
				return this.log("INFO - " + message);
			}
			return false;
		};
		Logger.prototype.warn = function(message) {
			if (this._level <= Logger.WARNING) {
				return this.log("WARN - " + message);
			}
			return false;
		};
		Logger.prototype.error = function(message) {
			if (this._level <= Logger.ERROR) {
				return this.log("ERROR - " + message);
			}
		};
		Logger.prototype.setLevel = function(level) {
			return this._level = level;
		};
		return Logger;
	}();
	HUBU.logger = new Logger("hubu");
	logger = HUBU.logger;
	getGlobal().Exception = Exception = function() {
		Exception.prototype.data = {};
		function Exception(message) {
			this.message = message;
		}
		Exception.prototype.add = function(key, value) {
			this.data.key = value;
			return this;
		};
		Exception.prototype.toString = function() {
			return this.message;
		};
		return Exception;
	}();
	utils.typeOf = function(obj) {
		var classToType, myClass, name, _i, _len, _ref1;
		if (obj == null) {
			return new String(obj);
		}
		classToType = new Object;
		_ref1 = "Boolean Number String Function Array Date RegExp".split(" ");
		for (_i = 0, _len = _ref1.length;_i < _len;_i++) {
			name = _ref1[_i];
			classToType["[object " + name + "]"] = name.toLowerCase();
		}
		myClass = Object.prototype.toString.call(obj);
		if (myClass in classToType) {
			return classToType[myClass];
		}
		return "object";
	};
	utils.isObjectConformToContract = function(object, contract) {
		var props;
		for (props in contract) {
			if (object[props] == null) {
				logger.warn("Object not conform to contract - property " + props + " missing");
				return false;
			} else {
				if (this.typeOf(contract[props]) !== this.typeOf(object[props])) {
					logger.warn("Object not conform to contract - the type of the property " + props + " does not match. Expected '" + this.typeOf(contract[props]) + "' but found '" + this.typeOf(object[props]) + "'");
					return false;
				}
			}
		}
		return true;
	};
	utils.isFunction = function(ref) {
		return this.typeOf(ref) === "function";
	};
	utils.isObject = function(ref) {
		return this.typeOf(ref) === "object";
	};
	utils.invoke = function(target, method, args) {
		if (target[method] != null && this.isFunction(target[method])) {
			return target[method].apply(target, args);
		}
		return false;
	};
	utils.defineFunctionIfNotExist = function(obj, name, func) {
		if (obj[name] == null) {
			obj[name] = func;
			return true;
		}
		return false;
	};
	utils.clone = function(obj, excludes) {
		var flags, key, newInstance;
		if (obj == null || typeof obj !== "object") {
			return obj;
		}
		if (obj instanceof Date) {
			return new Date(obj.getTime());
		}
		if (obj instanceof RegExp) {
			flags = "";
			if (obj.global != null) {
				flags += "g";
			}
			if (obj.ignoreCase != null) {
				flags += "i";
			}
			if (obj.multiline != null) {
				flags += "m";
			}
			if (obj.sticky != null) {
				flags += "y";
			}
			return new RegExp(obj.source, flags);
		}
		newInstance = new obj.constructor;
		excludes = excludes != null ? excludes : [];
		for (key in obj) {
			if (this.indexOf(excludes, key) === -1) {
				newInstance[key] = this.clone(obj[key], excludes);
			}
		}
		return newInstance;
	};
	utils.bind = function(obj, method) {
		if (this.typeOf(method) === "string") {
			if (obj[method] != null) {
				method = obj[method];
			} else {
				throw "HUBU.bind: obj[" + method + "] is null";
			}
		}
		if (this.typeOf(method) === "function") {
			return function() {
				return method.apply(obj, Array.prototype.slice.call(arguments));
			};
		} else {
			throw "HUBU.bind: obj[" + method + "] is not a function";
		}
	};
	utils.createProxyForContract = function(contract, object) {
		var props, proxy;
		proxy = {};
		proxy.__proxy__ = object;
		for (props in contract) {
			if (this.isFunction(contract[props])) {
				proxy[props] = this.bind(object, object[props]);
			} else {
				proxy[props] = object[props];
			}
		}
		return proxy;
	};
	utils.isComponent = function(component) {
		if (component == null) {
			return false;
		}
		return this.isObjectConformToContract(component, new HUBU.AbstractComponent);
	};
	utils.isComponentPlugged = function(component, hub) {
		if (this.typeOf(component) === "string") {
			return hub.getComponent(component) !== null;
		}
		if (this.typeOf(component) === "object") {
			return this.indexOf(hub.getComponents(), component) !== -1;
		}
		return false;
	};
	utils.indexOf = function(array, obj) {
		var i, v, _i, _len;
		if (Array.prototype.indexOf != null) {
			return array.indexOf(obj);
		} else {
			for (i = _i = 0, _len = array.length;_i < _len;i = ++_i) {
				v = array[i];
				if (v === obj) {
					return i;
				}
			}
			return-1;
		}
	};
	utils.removeElementFromArray = function(array, obj) {
		var v;
		for (v in array) {
			if (array[v] === obj) {
				array.splice(v, 1);
			}
		}
		return array;
	};
}).call(this);
// -- File: /Users/guyveraghtert/sources/h-ubu/target/classes/assets/js/AbstractComponent.js ( Input 2 ) -- //
(function() {
	var AbstractComponent;
	HUBU.AbstractComponent = AbstractComponent = function() {
		function AbstractComponent() {
		}
		AbstractComponent.prototype.configure = function(hub, configuration) {
			throw "AbstractComponent is an abstract class";
		};
		AbstractComponent.prototype.start = function() {
			throw "AbstractComponent is an abstract class";
		};
		AbstractComponent.prototype.stop = function() {
			throw "AbstractComponent is an abstract class";
		};
		AbstractComponent.prototype.getComponentName = function() {
			throw "AbstractComponent is an abstract class";
		};
		return AbstractComponent;
	}();
}).call(this);
// -- File: /Users/guyveraghtert/sources/h-ubu/target/classes/assets/js/Hubu-Eventing-Extension.js ( Input 3 ) -- //
(function() {
	var Eventing, __slice = [].slice;
	HUBU.Eventing = Eventing = function() {
		Eventing.prototype._hub = null;
		Eventing.prototype._listeners = null;
		function Eventing(hubu) {
			var myExtension;
			this._hub = hubu;
			this._listeners = [];
			myExtension = this;
			this._hub.getListeners = function() {
				return myExtension._listeners;
			};
			this._hub.registerListener = function() {
				var component, conf;
				component = arguments[0], conf = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
				if (conf.length >= 2) {
					myExtension.registerListener(component, conf[0], conf[1]);
					return this;
				} else {
					myExtension.registerListener(component, conf[1]);
					return this;
				}
			};
			this._hub.registerConfigurableListener = function(component, conf) {
				HUBU.logger.warn("registerConfigurableListener is a deprecated method and may disappear at any time, use registerListener instead");
				myExtension.registerListener(component, conf);
				return this;
			};
			this._hub.unregisterListener = function(component, callback) {
				myExtension.unregisterListener(component, callback);
				return this;
			};
			this._hub.sendEvent = function(component, event) {
				return myExtension.sendEvent(component, event);
			};
			this._hub.subscribe = function(component, topic, callback, filter) {
				myExtension.subscribe(component, topic, callback, filter);
				return this;
			};
			this._hub.unsubscribe = function(component, callback) {
				myExtension.unsubscribe(component, callback);
				return this;
			};
			this._hub.publish = function(component, topic, event) {
				myExtension.publish(component, topic, event);
				return this;
			};
		}
		Eventing.prototype._processEvent = function(component, event) {
			var ev, listener, sent, _i, _len, _ref;
			if (event == null || component == null) {
				HUBU.logger.warn("Can't process event - component or event not defined");
				return false;
			}
			sent = false;
			_ref = this._listeners.slice();
			for (_i = 0, _len = _ref.length;_i < _len;_i++) {
				listener = _ref[_i];
				if (!(listener.component !== component && HUBU.UTILS.indexOf(this._listeners, listener) !== -1)) {
					continue;
				}
				ev = event.clone == null || event.clone ? HUBU.UTILS.clone(event) : event;
				ev.source = component;
				if (listener.match.apply(listener.component, [ev])) {
					listener.callback.apply(listener.component, [ev]);
					sent = true;
				}
			}
			return sent;
		};
		Eventing.prototype.registerListener = function() {
			var callback, component, listener, match, others;
			component = arguments[0], others = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
			match = null;
			callback = null;
			switch(others.length) {
				case 2:
					match = others[0];
					callback = others[1];
					break;
				case 1:
					match = others[0].match;
					callback = others[0].callback;
			}
			if (component == null || match == null || callback == null) {
				throw(new Exception("Cannot register event listener, component or match or callback is/are not defined")).add("component", component).add("match", match).add("callback", callback);
			}
			if (!HUBU.UTILS.isComponentPlugged(component, this._hub)) {
				throw new Exception("Cannot register event listener, the component is not plugged on the hub");
			}
			listener = {"component":component, "callback":callback, "match":match};
			return this._listeners.push(listener);
		};
		Eventing.prototype.unregisterListener = function(component, callback) {
			var cmp, listener, toRemove, _i, _j, _k, _len, _len1, _len2, _ref, _ref1, _results;
			if (component == null) {
				HUBU.logger.warn("Cannot unregister listener - component not defined");
				return false;
			}
			cmp = this.getComponent(component);
			if (cmp == null) {
				HUBU.logger.warn("Cannot unregister listener - component not plugged on the hub");
				return false;
			}
			toRemove = [];
			if (callback != null) {
				_ref = this._listeners;
				for (_i = 0, _len = _ref.length;_i < _len;_i++) {
					listener = _ref[_i];
					if (listener.component === cmp && listener.callback === callback) {
						toRemove.push(listener);
					}
				}
			} else {
				_ref1 = this._listeners;
				for (_j = 0, _len1 = _ref1.length;_j < _len1;_j++) {
					listener = _ref1[_j];
					if (listener.component === cmp) {
						toRemove.push(listener);
					}
				}
			}
			_results = [];
			for (_k = 0, _len2 = toRemove.length;_k < _len2;_k++) {
				listener = toRemove[_k];
				_results.push(this._listeners = HUBU.UTILS.removeElementFromArray(this._listeners, listener));
			}
			return _results;
		};
		Eventing.prototype.getComponent = function(obj) {
			if (HUBU.UTILS.typeOf(obj) === "string") {
				return this._hub.getComponent(obj);
			}
			if (HUBU.UTILS.isComponent(obj)) {
				return obj;
			}
			return null;
		};
		Eventing.prototype.sendEvent = function(component, event) {
			if (component == null || event == null) {
				HUBU.logger.warn("Cannot send event, component or/and event are undefined");
				return;
			}
			return this._processEvent(component, event);
		};
		Eventing.prototype.subscribe = function(component, topic, callback, filter) {
			var match, regex;
			if (component == null || topic == null || callback == null) {
				HUBU.logger.warn("Cannot subscribe to topic, component or/and topic and/or callback are undefined");
				return;
			}
			regex = new RegExp(topic);
			match = null;
			if (filter == null || !HUBU.UTILS.isFunction(filter)) {
				match = function(event) {
					return regex.test(event.topic);
				};
			} else {
				match = function(event) {
					return regex.test(event.topic) && filter(event);
				};
			}
			return this.registerListener(component, match, callback);
		};
		Eventing.prototype.unsubscribe = function(component, callback) {
			return this.unregisterListener(component, callback);
		};
		Eventing.prototype.publish = function(component, topic, event) {
			if (component == null || topic == null || event == null) {
				HUBU.logger.info("Cannot publish event - component and/or topic and/or event are missing");
				return false;
			}
			event.topic = topic;
			return this.sendEvent(component, event);
		};
		Eventing.prototype.reset = function() {
			return this._listeners = [];
		};
		Eventing.prototype.unregisterComponent = function(cmp) {
			return this.unregisterListener(cmp);
		};
		return Eventing;
	}();
	getHubuExtensions().eventing = Eventing;
}).call(this);
// -- File: /Users/guyveraghtert/sources/h-ubu/target/classes/assets/js/Hubu-Binding-Extension.js ( Input 4 ) -- //
(function() {
	var Binding;
	HUBU.Binding = Binding = function() {
		Binding.prototype._hub = null;
		function Binding(hubu) {
			var myExtension;
			this._hub = hubu;
			myExtension = this;
			this._hub.bind = function(binding) {
				myExtension.bind(binding);
				return this;
			};
		}
		Binding.prototype.getComponent = function(obj) {
			var component;
			component = null;
			if (HUBU.UTILS.typeOf(obj) === "string") {
				return this._hub.getComponent(obj);
			}
			if (HUBU.UTILS.isComponent(obj)) {
				return obj;
			}
			return null;
		};
		Binding.prototype.getInjectedObject = function(binding, component) {
			if (binding.contract != null) {
				if (!HUBU.UTILS.isObjectConformToContract(component, binding.contract)) {
					throw(new Exception("Cannot bind components, the component is not conform to contract")).add("component", component.getComponentName()).add("contract", binding.contract);
				} else {
					if (binding.proxy == null || binding.proxy) {
						return HUBU.UTILS.createProxyForContract(binding.contract, component);
					}
				}
			}
			return component;
		};
		Binding.prototype.bind = function(binding) {
			var component, to;
			if (binding == null || !(binding != null ? binding.to : void 0) || !(binding != null ? binding.component : void 0) || !(binding != null ? binding.into : void 0)) {
				throw new Exception("Cannot bind components - component, to and into must be defined");
			}
			component = this.getComponent(binding.component);
			if (component == null) {
				throw(new Exception("Cannot bind components - 'component' is invalid")).add("component", binding.component);
			}
			to = this.getComponent(binding.to);
			if (to == null) {
				throw(new Exception("Cannot bind components - 'to' is invalid")).add("component", binding.to);
			}
			component = this.getInjectedObject(binding, component);
			switch(HUBU.UTILS.typeOf(binding.into)) {
				case "function":
					return binding.into.apply(to, [component]);
				case "string":
					if (to[binding.into] == null) {
						return to[binding.into] = component;
					} else {
						if (HUBU.UTILS.isFunction(to[binding.into])) {
							return to[binding.into].apply(to, [component]);
						} else {
							return to[binding.into] = component;
						}
					}
					break;
				default:
					throw(new Exception("Cannot bind components \x3d 'into' must be either a function or a string")).add("into", binding.into);;
			}
		};
		return Binding;
	}();
	getHubuExtensions().binding = Binding;
}).call(this);
// -- File: /Users/guyveraghtert/sources/h-ubu/target/classes/assets/js/Hubu-SOC-Mechanism.js ( Input 5 ) -- //
(function() {
	var SOC, ServiceEvent, ServiceReference, ServiceRegistration, ServiceRegistry, _ref;
	getGlobal().SOC = (_ref = getGlobal().SOC) != null ? _ref : {};
	SOC = getGlobal().SOC;
	SOC.ServiceRegistration = ServiceRegistration = function() {
		ServiceRegistration._nextId = 1;
		ServiceRegistration.prototype._id = -1;
		ServiceRegistration.prototype._component = null;
		ServiceRegistration.prototype._contract = null;
		ServiceRegistration.prototype._hub = null;
		ServiceRegistration.prototype._registered = false;
		ServiceRegistration.prototype._properties = {};
		ServiceRegistration.prototype._reference = null;
		ServiceRegistration.prototype._registry = null;
		ServiceRegistration.prototype._svcObject = null;
		ServiceRegistration.getAndIncId = function() {
			var id;
			id = SOC.ServiceRegistration._nextId;
			SOC.ServiceRegistration._nextId = SOC.ServiceRegistration._nextId + 1;
			return id;
		};
		function ServiceRegistration(contract, component, svcObject, properties, hub, registry) {
			this._id = -1;
			if (component == null) {
				throw new Exception("Cannot create a service registration without a valid component");
			}
			if (svcObject == null) {
				throw new Exception("Cannot create a service registration without a valid service object");
			}
			if (contract == null) {
				throw new Exception("Cannot create a service registration without a contract");
			}
			if (hub == null) {
				throw new Exception("Cannot create a service registration without the hub");
			}
			if (registry == null) {
				throw new Exception("Cannot create a service registration without the registry");
			}
			this._component = component;
			this._hub = hub;
			this._contract = contract;
			this._properties = typeof properties === "undefined" || properties === null ? {} : HUBU.UTILS.clone(properties);
			this._registry = registry;
			this._svcObject = svcObject;
			this._properties["service.contract"] = this._contract;
			this._properties["service.publisher"] = this._component;
		}
		ServiceRegistration.prototype.register = function() {
			if (!(HUBU.UTILS.isComponentPlugged(this._component, this._hub) || this._component === this._hub)) {
				throw new Exception("Invalid registration, the component is not plugged on the hub");
			}
			this._id = SOC.ServiceRegistration.getAndIncId();
			this._reference = new SOC.ServiceReference(this);
			this._properties["service.id"] = this._id;
			this._registered = this._id !== -1;
			return this._id;
		};
		ServiceRegistration.prototype.unregister = function() {
			return this._registered = false;
		};
		ServiceRegistration.prototype.isRegistered = function() {
			return this._registered;
		};
		ServiceRegistration.prototype.getReference = function() {
			if (!(HUBU.UTILS.isComponentPlugged(this._component, this._hub) || this._component === this._hub)) {
				throw new Exception("Invalid lookup, the component is not plugged on the hub");
			}
			return this._reference;
		};
		ServiceRegistration.prototype.getProperties = function() {
			return this._properties;
		};
		ServiceRegistration.prototype.getService = function(component) {
			if (!HUBU.UTILS.isFunction(this._svcObject)) {
				return this._svcObject;
			}
			return this._svcObject.apply(this._component, [component]);
		};
		ServiceRegistration.prototype.setProperties = function(properties) {
			var event, old, props;
			old = null;
			if (this.isRegistered()) {
				props = HUBU.UTILS.clone(this._properties, ["service.contract", "service.publisher"]);
				old = new SOC.ServiceRegistration(this._contract, this._component, this._svcObject, props, this._hub, this._registry);
				old._id = this._id;
				old._reference = new SOC.ServiceReference(old);
			}
			this._properties = properties != null ? properties : {};
			this._properties["service.contract"] = this._contract;
			this._properties["service.publisher"] = this._component;
			this._properties["service.id"] = this._id;
			if (this.isRegistered() && old != null) {
				event = new SOC.ServiceEvent(SOC.ServiceEvent.MODIFIED, this.getReference());
				return this._registry.fireServiceEvent(event, old.getReference());
			}
		};
		return ServiceRegistration;
	}();
	SOC.ServiceReference = ServiceReference = function() {
		ServiceReference.prototype._registration = null;
		function ServiceReference(registration) {
			this._registration = registration;
		}
		ServiceReference.prototype.getContract = function() {
			return this._registration.getProperties()["service.contract"];
		};
		ServiceReference.prototype.getProperties = function() {
			return this._registration.getProperties();
		};
		ServiceReference.prototype.getProperty = function(key) {
			return this._registration.getProperties()[key];
		};
		ServiceReference.prototype.getId = function() {
			return this._registration.getProperties()["service.id"];
		};
		ServiceReference.prototype.isValid = function() {
			return this._registration.isRegistered;
		};
		return ServiceReference;
	}();
	SOC.ServiceEvent = ServiceEvent = function() {
		ServiceEvent.REGISTERED = 1;
		ServiceEvent.MODIFIED = 2;
		ServiceEvent.UNREGISTERING = 4;
		ServiceEvent.MODIFIED_ENDMATCH = 8;
		ServiceEvent.prototype._type = 0;
		ServiceEvent.prototype._reference = null;
		function ServiceEvent(type, ref) {
			this._type = type;
			this._reference = ref;
		}
		ServiceEvent.prototype.getReference = function() {
			return this._reference;
		};
		ServiceEvent.prototype.getType = function() {
			return this._type;
		};
		return ServiceEvent;
	}();
	SOC.ServiceRegistry = ServiceRegistry = function() {
		ServiceRegistry.prototype._registrations = null;
		ServiceRegistry.prototype._hub = null;
		ServiceRegistry.prototype._listeners = null;
		function ServiceRegistry(hub) {
			this._registrations = [];
			this._listeners = [];
			if (hub == null) {
				throw new Exception("Cannot initialize the service registry without a hub");
			}
			this._hub = hub;
		}
		ServiceRegistry.prototype.getRegisteredServices = function() {
			var entry, reg, result, _i, _j, _len, _len1, _ref1, _ref2;
			result = [];
			_ref1 = this._registrations;
			for (_i = 0, _len = _ref1.length;_i < _len;_i++) {
				entry = _ref1[_i];
				_ref2 = entry.registrations;
				for (_j = 0, _len1 = _ref2.length;_j < _len1;_j++) {
					reg = _ref2[_j];
					result.push(reg.getReference());
				}
			}
			return result;
		};
		ServiceRegistry.prototype._addRegistration = function(component, reg) {
			var cmpEntry, entry, _i, _len, _ref1;
			_ref1 = this._registrations;
			for (_i = 0, _len = _ref1.length;_i < _len;_i++) {
				entry = _ref1[_i];
				if (entry.component === component) {
					cmpEntry = entry;
				}
			}
			if (cmpEntry == null) {
				cmpEntry = {"component":component, "registrations":[]};
				this._registrations.push(cmpEntry);
			}
			return cmpEntry.registrations.push(reg);
		};
		ServiceRegistry.prototype._removeRegistration = function(reg) {
			var cmpEntry, entry, _i, _len, _ref1;
			_ref1 = this._registrations;
			for (_i = 0, _len = _ref1.length;_i < _len;_i++) {
				entry = _ref1[_i];
				if (HUBU.UTILS.indexOf(entry.registrations, reg) !== -1) {
					cmpEntry = entry;
				}
			}
			if (cmpEntry == null) {
				return null;
			}
			HUBU.UTILS.removeElementFromArray(cmpEntry.registrations, reg);
			if (cmpEntry.registrations.length === 0) {
				HUBU.UTILS.removeElementFromArray(this._registrations, cmpEntry);
			}
			return cmpEntry.component;
		};
		ServiceRegistry.prototype.registerService = function(component, contract, properties, svcObject) {
			var reg;
			if (contract == null) {
				throw new Exception("Cannot register a service without a proper contract");
			}
			if (component == null) {
				throw new Exception("Cannot register a service without a valid component");
			}
			svcObject = svcObject != null ? svcObject : component;
			if (!HUBU.UTILS.isFunction(svcObject) && !HUBU.UTILS.isObjectConformToContract(svcObject, contract)) {
				throw(new Exception("Cannot register service - the service object does not implement the contract")).add("contract", contract).add("component", component);
			}
			svcObject = svcObject != null ? svcObject : component;
			reg = new ServiceRegistration(contract, component, svcObject, properties, this._hub, this);
			this._addRegistration(component, reg);
			reg.register();
			this.fireServiceEvent(new SOC.ServiceEvent(SOC.ServiceEvent.REGISTERED, reg.getReference()));
			return reg;
		};
		ServiceRegistry.prototype.unregisterService = function(registration) {
			var component, ref;
			if (registration == null) {
				throw new Exception("Cannot unregister the service - invalid registration");
			}
			component = this._removeRegistration(registration);
			if (component != null) {
				ref = registration.getReference();
				registration.unregister();
				this.fireServiceEvent(new SOC.ServiceEvent(SOC.ServiceEvent.UNREGISTERING, ref));
				return true;
			}
			throw new Exception("Cannot unregister service - registration not found");
		};
		ServiceRegistry.prototype.unregisterServices = function(component) {
			var cmpEntry, entry, reg, regs, _i, _j, _len, _len1, _ref1;
			if (component == null) {
				throw new Exception("Cannot unregister the services - invalid component");
			}
			_ref1 = this._registrations;
			for (_i = 0, _len = _ref1.length;_i < _len;_i++) {
				entry = _ref1[_i];
				if (entry.component === component) {
					cmpEntry = entry;
				}
			}
			if (cmpEntry != null) {
				regs = cmpEntry.registrations;
				if (regs != null) {
					for (_j = 0, _len1 = regs.length;_j < _len1;_j++) {
						reg = regs[_j];
						this.unregisterService(reg);
					}
				}
				return HUBU.UTILS.removeElementFromArray(this._registrations, cmpEntry);
			}
		};
		ServiceRegistry.prototype.getServiceReferences = function(contract, filter) {
			return this._match(this._buildFilter(contract, filter));
		};
		ServiceRegistry.prototype._match = function(filter) {
			var matching, ref, refs;
			refs = this.getRegisteredServices();
			matching = function() {
				var _i, _len, _results;
				_results = [];
				for (_i = 0, _len = refs.length;_i < _len;_i++) {
					ref = refs[_i];
					if (filter.match(ref)) {
						_results.push(ref);
					}
				}
				return _results;
			}();
			return matching;
		};
		ServiceRegistry.prototype._buildFilter = function(contract, filter) {
			var container;
			if (contract == null && filter == null) {
				return{match:function(ref) {
					return true;
				}};
			} else {
				if (contract != null && filter == null) {
					container = {};
					container.contract = contract;
					container.match = function(_this) {
						return function(ref) {
							return ref.getProperty("service.contract") === container.contract;
						};
					}(this);
					return container;
				} else {
					if (contract != null && filter != null) {
						container = {};
						container.contract = contract;
						container.filter = filter;
						container.match = function(_this) {
							return function(ref) {
								return ref.getProperty("service.contract") === container.contract && container.filter(ref);
							};
						}(this);
						return container;
					} else {
						return{filter:filter, match:function(ref) {
							return this.filter(ref);
						}};
					}
				}
			}
		};
		ServiceRegistry.prototype.getService = function(component, ref) {
			if (ref == null) {
				throw new Exception("Cannot get service - the reference is null");
			}
			if (!ref.isValid()) {
				HUBU.logger.warn("Cannot retrieve service for " + ref + " - the reference is invalid");
				return null;
			}
			return ref._registration.getService(component);
		};
		ServiceRegistry.prototype.ungetService = function(component, ref) {
		};
		ServiceRegistry.prototype.registerServiceListener = function(listenerConfig) {
			var contract, filter, listener, newFilter, svcListener;
			contract = listenerConfig.contract, filter = listenerConfig.filter, listener = listenerConfig.listener;
			if (listener == null) {
				throw(new Exception("Can't register the service listener, the listener is not set")).add("listenerConfig", listenerConfig);
			}
			newFilter = this._buildFilter(contract, filter);
			svcListener = {listener:listener, filter:newFilter, contract:contract};
			if (HUBU.UTILS.isObject(listener)) {
				if (!HUBU.UTILS.isObjectConformToContract(listener, SOC.ServiceListener)) {
					throw new Exception("Can't register the service listener, the listener is not conform to the Service Listener contract");
				}
			}
			return this._listeners.push(svcListener);
		};
		ServiceRegistry.prototype.unregisterServiceListener = function(listenerConfig) {
			var contract, filter, list, listener, _i, _len, _ref1, _results;
			contract = listenerConfig.contract, filter = listenerConfig.filter, listener = listenerConfig.listener;
			if (listener == null) {
				throw(new Exception("Can't unregister the service listener, the listener is not set")).add("listenerConfig", listenerConfig);
			}
			_ref1 = this._listeners.slice();
			_results = [];
			for (_i = 0, _len = _ref1.length;_i < _len;_i++) {
				list = _ref1[_i];
				if (list.contract === contract && list.listener === listener) {
					_results.push(HUBU.UTILS.removeElementFromArray(this._listeners, list));
				}
			}
			return _results;
		};
		ServiceRegistry.prototype.fireServiceEvent = function(event, oldRef) {
			var listener, matched, newEvent, _i, _len, _ref1, _results;
			_ref1 = this._listeners;
			_results = [];
			for (_i = 0, _len = _ref1.length;_i < _len;_i++) {
				listener = _ref1[_i];
				matched = listener.filter == null || this._testAgainstFilter(listener, event.getReference());
				if (matched) {
					_results.push(this._invokeServiceListener(listener, event));
				} else {
					if (event.getType() === SOC.ServiceEvent.MODIFIED && oldRef != null) {
						if (this._testAgainstFilter(listener, oldRef)) {
							newEvent = new SOC.ServiceEvent(SOC.ServiceEvent.MODIFIED_ENDMATCH, event.getReference());
							_results.push(this._invokeServiceListener(listener, newEvent));
						} else {
							_results.push(void 0);
						}
					} else {
						_results.push(void 0);
					}
				}
			}
			return _results;
		};
		ServiceRegistry.prototype._testAgainstFilter = function(listener, ref) {
			return listener.filter.match(ref);
		};
		ServiceRegistry.prototype._invokeServiceListener = function(listener, event) {
			if (HUBU.UTILS.isFunction(listener.listener)) {
				return listener.listener(event);
			} else {
				if (HUBU.UTILS.isObject(listener.listener)) {
					return listener.serviceChanged(event);
				}
			}
		};
		return ServiceRegistry;
	}();
}).call(this);
// -- File: /Users/guyveraghtert/sources/h-ubu/target/classes/assets/js/Hubu-SOC-Extension.js ( Input 6 ) -- //
(function() {
	var ProvidedService, ServiceComponent, ServiceDependency, ServiceOrientation;
	HUBU.ServiceComponent = ServiceComponent = function() {
		ServiceComponent.STOPPED = 0;
		ServiceComponent.INVALID = 1;
		ServiceComponent.VALID = 2;
		ServiceComponent.prototype._component = null;
		ServiceComponent.prototype._providedServices = null;
		ServiceComponent.prototype._requiredServices = null;
		ServiceComponent.prototype._state = 0;
		function ServiceComponent(component) {
			this._component = component;
			this._providedServices = [];
			this._requiredServices = [];
			this._state = ServiceComponent.STOPPED;
		}
		ServiceComponent.prototype.getComponent = function() {
			return this._component;
		};
		ServiceComponent.prototype.getState = function() {
			return this._state;
		};
		ServiceComponent.prototype.addProvidedService = function(ps) {
			if (HUBU.UTILS.indexOf(this._providedServices, ps) === -1) {
				this._providedServices.push(ps);
				ps.setServiceComponent(this);
				if (this._state > ServiceComponent.STOPPED) {
					ps.onStart();
				}
				if (this._state === ServiceComponent.VALID) {
					ps.onValidation();
				}
				if (this._state === ServiceComponent.INVALID) {
					return ps.onInvalidation();
				}
			}
		};
		ServiceComponent.prototype.removeProvidedService = function(ps) {
			if (HUBU.UTILS.indexOf(this._providedServices, ps) !== -1) {
				HUBU.UTILS.removeElementFromArray(this._providedServices, ps);
				return ps.onStop();
			}
		};
		ServiceComponent.prototype.addRequiredService = function(req) {
			if (HUBU.UTILS.indexOf(this._requiredServices, req) === -1) {
				this._requiredServices.push(req);
				req.setServiceComponent(this);
				if (this._state > ServiceComponent.STOPPED) {
					req.onStart();
					return this.computeState();
				}
			}
		};
		ServiceComponent.prototype.removeRequiredService = function(req) {
			if (HUBU.UTILS.indexOf(this._requiredServices, req) > -1) {
				HUBU.UTILS.removeElementFromArray(this._requiredServices, req);
				req.onStop();
				if (this._state > ServiceComponent.STOPPED) {
					return this.computeState();
				}
			}
		};
		ServiceComponent.prototype.computeState = function() {
			var isValid, oldState, req, _i, _len, _ref;
			isValid = true;
			_ref = this._requiredServices;
			for (_i = 0, _len = _ref.length;_i < _len;_i++) {
				req = _ref[_i];
				isValid = isValid && req.isValid();
			}
			oldState = this._state;
			this._state = isValid ? ServiceComponent.VALID : ServiceComponent.INVALID;
			if (this._state > oldState && this._state === ServiceComponent.VALID) {
				this._validate();
			} else {
				if (this._state < oldState && this._state === ServiceComponent.INVALID) {
					this._invalidate();
				}
			}
			return this._state;
		};
		ServiceComponent.prototype._validate = function() {
			var prov, _i, _len, _ref, _ref1, _results;
			HUBU.logger.debug("Validate instance " + ((_ref = this._component) != null ? _ref.getComponentName() : void 0));
			this._component.start.apply(this._component, []);
			_ref1 = this._providedServices;
			_results = [];
			for (_i = 0, _len = _ref1.length;_i < _len;_i++) {
				prov = _ref1[_i];
				_results.push(prov.onValidation());
			}
			return _results;
		};
		ServiceComponent.prototype._invalidate = function() {
			var prov, _i, _len, _ref, _results;
			HUBU.logger.debug("Invalidate instance");
			_ref = this._providedServices;
			_results = [];
			for (_i = 0, _len = _ref.length;_i < _len;_i++) {
				prov = _ref[_i];
				_results.push(prov.onInvalidation());
			}
			return _results;
		};
		ServiceComponent.prototype.onStart = function() {
			var prov, req, _i, _j, _len, _len1, _ref, _ref1;
			_ref = this._requiredServices;
			for (_i = 0, _len = _ref.length;_i < _len;_i++) {
				req = _ref[_i];
				req.onStart();
			}
			_ref1 = this._providedServices;
			for (_j = 0, _len1 = _ref1.length;_j < _len1;_j++) {
				prov = _ref1[_j];
				prov.onStart();
			}
			return this.computeState();
		};
		ServiceComponent.prototype.onStop = function() {
			var prov, req, _i, _j, _len, _len1, _ref, _ref1;
			_ref = this._providedServices;
			for (_i = 0, _len = _ref.length;_i < _len;_i++) {
				prov = _ref[_i];
				prov.onStop();
			}
			_ref1 = this._requiredServices;
			for (_j = 0, _len1 = _ref1.length;_j < _len1;_j++) {
				req = _ref1[_j];
				req.onStop();
			}
			return this._state = ServiceComponent.STOPPED;
		};
		ServiceComponent.prototype.getServiceDependencyByName = function(name) {
			var dep, _i, _len, _ref;
			_ref = this._requiredServices;
			for (_i = 0, _len = _ref.length;_i < _len;_i++) {
				dep = _ref[_i];
				if (dep.getName() === name) {
					return dep;
				}
			}
		};
		return ServiceComponent;
	}();
	HUBU.ServiceDependency = ServiceDependency = function() {
		var _listener, _refs, _serviceComponent, _state;
		ServiceDependency.UNRESOLVED = 0;
		ServiceDependency.RESOLVED = 1;
		ServiceDependency.prototype._component = null;
		ServiceDependency.prototype._contract = null;
		ServiceDependency.prototype._filter = null;
		ServiceDependency.prototype._aggregate = false;
		ServiceDependency.prototype._optional = false;
		ServiceDependency.prototype._field = null;
		ServiceDependency.prototype._bind = null;
		ServiceDependency.prototype._unbind = null;
		ServiceDependency.prototype._name = null;
		ServiceDependency.prototype._hub = null;
		_listener = null;
		_state = null;
		_refs = [];
		_serviceComponent = null;
		function ServiceDependency(component, contract, filter, aggregate, optional, field, bind, unbind, name, hub) {
			var self;
			this._component = component;
			this._contract = contract;
			this._filter = filter;
			this._aggregate = aggregate;
			this._optional = optional;
			this._field = field;
			this._name = name != null ? name : this._contract;
			if (bind != null) {
				this._bind = HUBU.UTILS.isFunction(bind) ? bind : this._component[bind];
				if (this._bind == null) {
					throw new Exception("Bind method " + bind + " not found on component");
				}
			}
			if (unbind != null) {
				this._unbind = HUBU.UTILS.isFunction(unbind) ? unbind : this._component[unbind];
				if (this._unbind == null) {
					throw new Exception("Unbind method " + unbind + " not found on component");
				}
			}
			this._hub = hub;
			this._state = HUBU.ServiceDependency.UNRESOLVED;
			this._refs = [];
			self = this;
			this._listener = {contract:this._contract, filter:function(ref) {
				return ref.getProperty("service.publisher") !== self._component && (self._filter == null || self._filter(ref));
			}, listener:function(event) {
				switch(event.getType()) {
					case SOC.ServiceEvent.REGISTERED:
						return self._onServiceArrival(event.getReference());
					case SOC.ServiceEvent.MODIFIED:
						return self._onServiceModified(event.getReference());
					case SOC.ServiceEvent.UNREGISTERING:
						return self._onServiceDeparture(event.getReference());
					case SOC.ServiceEvent.MODIFIED_ENDMATCH:
						return self._onServiceDeparture(event.getReference());
				}
			}};
		}
		ServiceDependency.prototype.setServiceComponent = function(sc) {
			return this._serviceComponent = sc;
		};
		ServiceDependency.prototype.onStart = function() {
			this._state = HUBU.ServiceDependency.UNRESOLVED;
			this._startTracking();
			return this._computeDependencyState();
		};
		ServiceDependency.prototype.onStop = function() {
			this._stopTracking();
			this._ungetAllServices();
			this._refs = [];
			return this._state = HUBU.ServiceDependency.UNRESOLVED;
		};
		ServiceDependency.prototype._ungetAllServices = function() {
			var entry, _i, _len, _ref, _results;
			_ref = this._refs;
			_results = [];
			for (_i = 0, _len = _ref.length;_i < _len;_i++) {
				entry = _ref[_i];
				if (!(entry.service != null)) {
					continue;
				}
				entry.service = null;
				_results.push(this._hub.ungetService(this._component, entry.reference));
			}
			return _results;
		};
		ServiceDependency.prototype._startTracking = function() {
			var ref, refs, _i, _len, _results;
			this._hub.registerServiceListener(this._listener);
			refs = this._hub.getServiceReferences(this._contract, this._filter);
			_results = [];
			for (_i = 0, _len = refs.length;_i < _len;_i++) {
				ref = refs[_i];
				_results.push(this._onServiceArrival(ref));
			}
			return _results;
		};
		ServiceDependency.prototype._stopTracking = function() {
			return this._hub.unregisterServiceListener(this._listener);
		};
		ServiceDependency.prototype.isValid = function() {
			return this._state === HUBU.ServiceDependency.RESOLVED;
		};
		ServiceDependency.prototype.getName = function() {
			return this._name;
		};
		ServiceDependency.prototype.getContract = function() {
			return this._contract;
		};
		ServiceDependency.prototype.getFilter = function() {
			return this._filter;
		};
		ServiceDependency.prototype.isAggregate = function() {
			return this._aggregate;
		};
		ServiceDependency.prototype.isOptional = function() {
			return this._optional;
		};
		ServiceDependency.prototype._computeDependencyState = function() {
			var oldState;
			oldState = this._state;
			if (this._optional || this._refs.length > 0) {
				this._state = HUBU.ServiceDependency.RESOLVED;
			} else {
				this._state = HUBU.ServiceDependency.UNRESOLVED;
			}
			if (oldState !== this._state) {
				return this._serviceComponent.computeState();
			}
		};
		ServiceDependency.prototype._onServiceArrival = function(ref) {
			var entry, refEntry, _i, _len, _ref;
			HUBU.logger.debug("Service arrival detected for " + this._component.getComponentName());
			_ref = this._refs;
			for (_i = 0, _len = _ref.length;_i < _len;_i++) {
				entry = _ref[_i];
				if (entry.reference === ref) {
					refEntry = entry;
				}
			}
			if (refEntry == null) {
				refEntry = {reference:ref, service:null};
				this._refs.push(refEntry);
				if (this._aggregate) {
					this._inject(refEntry);
				} else {
					if (this._refs.length === 1) {
						this._inject(refEntry);
					}
				}
				return this._computeDependencyState();
			}
		};
		ServiceDependency.prototype._onServiceDeparture = function(ref) {
			var entry, newRef, refEntry, _i, _len, _ref;
			HUBU.logger.debug("Service departure detected for " + this._component.getComponentName());
			_ref = this._refs;
			for (_i = 0, _len = _ref.length;_i < _len;_i++) {
				entry = _ref[_i];
				if (entry.reference === ref) {
					refEntry = entry;
				}
			}
			if (refEntry != null) {
				HUBU.UTILS.removeElementFromArray(this._refs, refEntry);
				if (refEntry.service != null) {
					this._deinject(refEntry);
					this._hub.ungetService(this._component, ref);
					refEntry.service = null;
				}
				if (this._refs.length > 0) {
					newRef = this._refs[0];
					if (!this._aggregate) {
						return this._inject(newRef);
					}
				} else {
					return this._computeDependencyState();
				}
			}
		};
		ServiceDependency.prototype._onServiceModified = function(ref) {
			var entry, refEntry, _i, _len, _ref;
			_ref = this._refs;
			for (_i = 0, _len = _ref.length;_i < _len;_i++) {
				entry = _ref[_i];
				if (entry.reference === ref) {
					refEntry = entry;
				}
			}
			if (refEntry == null) {
				return this._onServiceArrival(ref);
			}
		};
		ServiceDependency.prototype._inject = function(entry) {
			var svc;
			svc = this._hub.getService(this._serviceComponent, entry.reference);
			entry.service = svc;
			if (this._field != null && this._aggregate) {
				if (this._component[this._field] == null) {
					this._component[this._field] = [svc];
				} else {
					this._component[this._field].push(svc);
				}
			}
			if (this._field != null && !this._aggregate) {
				this._component[this._field] = svc;
			}
			if (this._bind != null) {
				return this._bind.apply(this._component, [svc, entry.reference]);
			}
		};
		ServiceDependency.prototype._deinject = function(entry) {
			if (this._field != null && this._aggregate) {
				HUBU.UTILS.removeElementFromArray(this._component[this._field], entry.service);
			}
			if (this._field != null && !this._aggregate) {
				this._component[this._field] = null;
			}
			if (this._unbind != null) {
				return this._unbind.apply(this._component, [entry.service, entry.reference]);
			}
		};
		ServiceDependency.prototype.locateServices = function() {
			var ref, refs, svc, _i, _len;
			svc = [];
			refs = this._hub.getServiceReferences(this._contract, this._filter);
			for (_i = 0, _len = refs.length;_i < _len;_i++) {
				ref = refs[_i];
				svc.push(this._hub.getService(this._component, ref));
			}
			return svc;
		};
		return ServiceDependency;
	}();
	HUBU.ProvidedService = ProvidedService = function() {
		ProvidedService.UNREGISTERED = 0;
		ProvidedService.REGISTERED = 1;
		ProvidedService.prototype._hub = null;
		ProvidedService.prototype._contract = null;
		ProvidedService.prototype._properties = null;
		ProvidedService.prototype._registration = null;
		ProvidedService.prototype._serviceComponent = null;
		ProvidedService.prototype._component = null;
		ProvidedService.prototype._preRegistration = null;
		ProvidedService.prototype._postRegistration = null;
		ProvidedService.prototype._preUnregistration = null;
		ProvidedService.prototype._postUnRegistration = null;
		function ProvidedService(component, contract, properties, preRegistration, postRegistration, preUnregistration, postUnregistration, hub) {
			this._component = component;
			this._contract = contract;
			this._hub = hub;
			this._properties = properties;
			if (preRegistration != null) {
				this._preRegistration = HUBU.UTILS.isFunction(preRegistration) ? preRegistration : this._component[preRegistration];
				if (this._preRegistration == null) {
					throw new Exception("preRegistration method " + preRegistration + " not found on component");
				}
			}
			if (postRegistration != null) {
				this._postRegistration = HUBU.UTILS.isFunction(postRegistration) ? postRegistration : this._component[postRegistration];
				if (this._postRegistration == null) {
					throw new Exception("postRegistration method " + postRegistration + " not found on component");
				}
			}
			if (preUnregistration != null) {
				this._preUnregistration = HUBU.UTILS.isFunction(preUnregistration) ? preUnregistration : this._component[preUnregistration];
				if (this._preUnregistration == null) {
					throw new Exception("preUnregistration method " + preUnregistration + " not found on component");
				}
			}
			if (postUnregistration != null) {
				this._postUnRegistration = HUBU.UTILS.isFunction(postUnregistration) ? postUnregistration : this._component[postUnregistration];
				if (this._postUnRegistration == null) {
					throw new Exception("postUnregistration method " + postUnregistration + " not found on component");
				}
			}
		}
		ProvidedService.prototype.setServiceComponent = function(sc) {
			return this._serviceComponent = sc;
		};
		ProvidedService.prototype._register = function() {
			var proxy;
			if (this._registration != null) {
				return false;
			}
			if (this._preRegistration != null) {
				this._preRegistration.apply(this._component, []);
			}
			proxy = HUBU.UTILS.createProxyForContract(this._contract, this._component);
			this._registration = this._hub.registerService(this._component, this._contract, this._properties, proxy);
			HUBU.logger.debug("Service from " + this._component.getComponentName() + " registered");
			if (this._postRegistration != null) {
				this._postRegistration.apply(this._component, [this._registration]);
			}
			return true;
		};
		ProvidedService.prototype._unregister = function() {
			if (this._registration == null) {
				return false;
			}
			if (this._preUnregistration != null) {
				this._preUnregistration.apply(this._component, [this._registration]);
			}
			this._hub.unregisterService(this._registration);
			this._registration = null;
			if (this._postUnRegistration != null) {
				return this._postUnRegistration.apply(this._component, []);
			}
		};
		ProvidedService.prototype.onStart = function() {
		};
		ProvidedService.prototype.onStop = function() {
			return this._unregister();
		};
		ProvidedService.prototype.onValidation = function() {
			return this._register();
		};
		ProvidedService.prototype.onInvalidation = function() {
			return this._unregister();
		};
		return ProvidedService;
	}();
	HUBU.ServiceOrientation = ServiceOrientation = function() {
		ServiceOrientation.prototype._hub = null;
		ServiceOrientation.prototype._registry = null;
		ServiceOrientation.prototype._components = [];
		function ServiceOrientation(hubu) {
			var registry, self;
			this._hub = hubu;
			this._registry = new SOC.ServiceRegistry(this._hub);
			this._components = [];
			registry = this._registry;
			self = this;
			this._hub.getServiceRegistry = function() {
				return registry;
			};
			this._hub.registerService = function(component, contract, properties, svcObject) {
				return registry.registerService(component, contract, properties, svcObject);
			};
			this._hub.unregisterService = function(registration) {
				return registry.unregisterService(registration);
			};
			this._hub.getServiceReferences = function(contract, filter) {
				return registry.getServiceReferences(contract, filter);
			};
			this._hub.getServiceReference = function(contract, filter) {
				var refs;
				refs = registry.getServiceReferences(contract, filter);
				if (refs.length !== 0) {
					return refs[0];
				}
				return null;
			};
			this._hub.getService = function(component, reference) {
				return registry.getService(component, reference);
			};
			this._hub.ungetService = function(component, reference) {
				return registry.ungetService(component, reference);
			};
			this._hub.registerServiceListener = function(listenerConfiguration) {
				return registry.registerServiceListener(listenerConfiguration);
			};
			this._hub.unregisterServiceListener = function(listenerConfiguration) {
				return registry.unregisterServiceListener(listenerConfiguration);
			};
			this._hub.requireService = function(description) {
				self.requireService(description);
				return this;
			};
			this._hub.provideService = function(description) {
				self.provideService(description);
				return this;
			};
			this._hub.locateService = function(component, name) {
				var cmpEntry, dep, entry, svc, _i, _len, _ref;
				_ref = self._components;
				for (_i = 0, _len = _ref.length;_i < _len;_i++) {
					entry = _ref[_i];
					if (entry.component === component) {
						cmpEntry = entry;
					}
				}
				if (cmpEntry == null) {
					return null;
				}
				dep = cmpEntry.serviceComponent.getServiceDependencyByName(name);
				if (dep == null) {
					throw new Exception("No dependency " + name + " on component " + cmpEntry.component.getComponentName());
				}
				svc = dep.locateServices();
				if (svc === null || svc.length === 0) {
					return null;
				}
				return svc[0];
			};
			this._hub.locateServices = function(component, name) {
				var cmpEntry, dep, entry, svc, _i, _len, _ref;
				_ref = self._components;
				for (_i = 0, _len = _ref.length;_i < _len;_i++) {
					entry = _ref[_i];
					if (entry.component === component) {
						cmpEntry = entry;
					}
				}
				if (cmpEntry == null) {
					return null;
				}
				dep = cmpEntry.serviceComponent.getServiceDependencyByName(name);
				if (dep == null) {
					throw new Exception("No dependency " + name + " on component " + cmpEntry.component.getComponentName());
				}
				svc = dep.locateServices();
				if (svc === null || svc.length === 0) {
					return[];
				}
				return svc;
			};
		}
		ServiceOrientation.prototype.unregisterComponent = function(cmp) {
			var entry, _i, _len, _ref;
			_ref = this._components;
			for (_i = 0, _len = _ref.length;_i < _len;_i++) {
				entry = _ref[_i];
				if (!(entry != null && entry.component === cmp)) {
					continue;
				}
				entry.serviceComponent.onStop();
				HUBU.UTILS.removeElementFromArray(this._components, entry);
			}
			return this._registry.unregisterServices(cmp);
		};
		ServiceOrientation.prototype.registerComponent = function(comp, config) {
			var cmpEntry, entry, _i, _len, _ref;
			_ref = this._components;
			for (_i = 0, _len = _ref.length;_i < _len;_i++) {
				entry = _ref[_i];
				if (entry.component === comp) {
					cmpEntry = entry;
				}
			}
			if (cmpEntry == null) {
				cmpEntry = {"component":comp, "serviceComponent":new HUBU.ServiceComponent(comp)};
				this._components.push(cmpEntry);
				if (this._hub.isStarted()) {
					return cmpEntry.serviceComponent.onStart();
				}
			}
		};
		ServiceOrientation.prototype.requireService = function(description) {
			var aggregate, bind, component, contract, field, filter, name, optional, req, unbind;
			component = description.component, contract = description.contract, filter = description.filter, aggregate = description.aggregate, optional = description.optional, field = description.field, bind = description.bind, unbind = description.unbind, name = description.name;
			if (component == null) {
				throw new Exception("Cannot require a service without a valid component");
			}
			if (aggregate == null) {
				aggregate = false;
			}
			if (optional == null) {
				optional = false;
			}
			if (contract == null) {
				contract = null;
			}
			if (filter == null) {
				filter = null;
			}
			if (field == null && bind == null && name == null) {
				throw new Exception("Cannot require a service - field or bind must be set");
			}
			if (field == null) {
				field = null;
			}
			if (bind == null) {
				bind = null;
			}
			if (unbind == null) {
				unbind = null;
			}
			if (name == null) {
				name = contract;
			}
			if (field == null && bind == null) {
				optional = true;
			}
			req = new HUBU.ServiceDependency(component, contract, filter, aggregate, optional, field, bind, unbind, name, this._hub);
			return this._addServiceDependencyToComponent(component, req);
		};
		ServiceOrientation.prototype.provideService = function(description) {
			var component, contract, postRegistration, postUnregistration, preRegistration, preUnregistration, properties, ps;
			component = description.component, contract = description.contract, properties = description.properties, preRegistration = description.preRegistration, postRegistration = description.postRegistration, preUnregistration = description.preUnregistration, postUnregistration = description.postUnregistration;
			if (component == null) {
				throw new Exception("Cannot provided a service without a valid component");
			}
			if (contract == null) {
				throw new Exception("Cannot provided a service without a valid contract");
			}
			if (properties == null) {
				properties = {};
			}
			ps = new HUBU.ProvidedService(component, contract, properties, preRegistration, postRegistration, preUnregistration, postUnregistration, this._hub);
			return this._addProvidedServiceToComponent(component, ps);
		};
		ServiceOrientation.prototype._addServiceDependencyToComponent = function(comp, req) {
			var cmpEntry, entry, newComponent, _i, _len, _ref;
			newComponent = false;
			_ref = this._components;
			for (_i = 0, _len = _ref.length;_i < _len;_i++) {
				entry = _ref[_i];
				if (entry.component === comp) {
					cmpEntry = entry;
				}
			}
			if (cmpEntry == null) {
				cmpEntry = {"component":comp, "serviceComponent":new HUBU.ServiceComponent(comp)};
				this._components.push(cmpEntry);
				newComponent = true;
			}
			cmpEntry.serviceComponent.addRequiredService(req);
			if (newComponent && this._hub.isStarted()) {
				return cmpEntry.serviceComponent.onStart();
			}
		};
		ServiceOrientation.prototype._addProvidedServiceToComponent = function(comp, ps) {
			var cmpEntry, entry, newComponent, _i, _len, _ref;
			newComponent = false;
			_ref = this._components;
			for (_i = 0, _len = _ref.length;_i < _len;_i++) {
				entry = _ref[_i];
				if (entry.component === comp) {
					cmpEntry = entry;
				}
			}
			if (cmpEntry == null) {
				cmpEntry = {"component":comp, "serviceComponent":new HUBU.ServiceComponent(comp)};
				this._components.push(cmpEntry);
				newComponent = true;
			}
			cmpEntry.serviceComponent.addProvidedService(ps);
			if (this._hub.isStarted() && newComponent) {
				return cmpEntry.serviceComponent.onStart();
			}
		};
		ServiceOrientation.prototype.start = function() {
			var entry, _i, _len, _ref, _results;
			_ref = this._components;
			_results = [];
			for (_i = 0, _len = _ref.length;_i < _len;_i++) {
				entry = _ref[_i];
				_results.push(entry.serviceComponent.onStart());
			}
			return _results;
		};
		ServiceOrientation.prototype.stop = function() {
			var entry, _i, _len, _ref, _results;
			_ref = this._components;
			_results = [];
			for (_i = 0, _len = _ref.length;_i < _len;_i++) {
				entry = _ref[_i];
				_results.push(entry.serviceComponent.onStop());
			}
			return _results;
		};
		return ServiceOrientation;
	}();
	getHubuExtensions().service = ServiceOrientation;
}).call(this);
// -- File: /Users/guyveraghtert/sources/h-ubu/target/classes/assets/js/Hub.js ( Input 7 ) -- //
(function() {
	var Hub;
	HUBU.Hub = Hub = function() {
		Hub.prototype._components = null;
		Hub.prototype._started = false;
		Hub.prototype._extensions = null;
		Hub.prototype._parentHub = null;
		Hub.prototype._name = null;
		function Hub() {
			this._components = [];
			this._started = false;
			this._extensions = null;
		}
		Hub.prototype.configure = function(parent, configuration) {
			var ext, name, _ref;
			if (parent != null) {
				this._parentHub = parent;
			}
			if (this._name == null) {
				this._name = (configuration != null ? configuration.component_name : void 0) != null ? configuration.component_name : "hub";
			}
			if (this._extensions == null) {
				this._extensions = [];
				_ref = getHubuExtensions();
				for (name in _ref) {
					ext = _ref[name];
					this._extensions.push(new ext(this));
				}
			} else {
				HUBU.logger.debug("Hub already initialized");
			}
			return this;
		};
		Hub.prototype.getParentHub = function() {
			return this._parentHub;
		};
		Hub.prototype.getComponents = function() {
			return this._components;
		};
		Hub.prototype.getComponent = function(name) {
			var cmp, fc, n, _i, _len, _ref;
			if (name == null) {
				return null;
			}
			_ref = this._components;
			for (_i = 0, _len = _ref.length;_i < _len;_i++) {
				cmp = _ref[_i];
				fc = cmp.getComponentName;
				if (fc != null && HUBU.UTILS.isFunction(fc)) {
					n = fc.apply(cmp, []);
					if (n === name) {
						return cmp;
					}
				}
			}
			return null;
		};
		Hub.prototype.registerComponent = function(component, configuration) {
			var ext, _i, _len, _ref;
			if (component == null) {
				throw new Exception("Cannot register component - component is null");
			}
			if (!HUBU.UTILS.isComponent(component)) {
				if (component.getComponentName) {
					throw new Exception(component.getComponentName() + " is not a valid component");
				} else {
					throw new Exception(component + " is not a valid component");
				}
			}
			if (this._extensions === null) {
				this.configure();
			}
			if (this.getComponent(component.getComponentName()) != null) {
				HUBU.logger.info("Component " + component.getComponentName() + " already registered");
				return this;
			}
			this._components.push(component);
			if (configuration != null && configuration.component_name != null) {
				component["__name__"] = configuration.component_name;
				component.getComponentName = function() {
					return this["__name__"];
				};
			}
			if (component.__hub__ == null && component.hub == null) {
				component.__hub__ = this;
				component.hub = function() {
					return this.__hub__;
				};
			}
			HUBU.logger.debug("Registering component " + component.getComponentName());
			HUBU.logger.debug("Configuring component " + component.getComponentName());
			component.configure(this, configuration);
			_ref = this._extensions;
			for (_i = 0, _len = _ref.length;_i < _len;_i++) {
				ext = _ref[_i];
				HUBU.UTILS.invoke(ext, "registerComponent", [component, configuration]);
			}
			if (this._started) {
				HUBU.logger.debug("Starting component " + component.getComponentName());
			}
			HUBU.logger.debug("Component " + component.getComponentName() + " registered");
			return this;
		};
		Hub.prototype.createInstance = function(factory, configuration) {
			var instance;
			if (factory == null) {
				throw new Exception("Cannot create instance - the given factory / constructor is null");
			}
			if (!HUBU.UTILS.isFunction(factory)) {
				throw new Exception("Cannot create instance - the given factory " + "/ constructor is not a function");
			}
			instance = new factory;
			return this.registerComponent(instance, configuration);
		};
		Hub.prototype.unregisterComponent = function(component) {
			var cmp, ext, idx, _i, _len, _ref;
			if (component == null) {
				return this;
			}
			cmp = null;
			if (HUBU.UTILS.typeOf(component) === "string") {
				cmp = this.getComponent(component);
				if (cmp == null) {
					return this;
				}
			} else {
				if (!HUBU.UTILS.isComponent(component)) {
					throw(new Exception("Cannot unregister component, it's not a valid component")).add("component", component);
				} else {
					cmp = component;
				}
			}
			if (this._extensions === null) {
				this.configure();
			}
			idx = HUBU.UTILS.indexOf(this._components, cmp);
			if (idx !== -1) {
				_ref = this._extensions;
				for (_i = 0, _len = _ref.length;_i < _len;_i++) {
					ext = _ref[_i];
					HUBU.UTILS.invoke(ext, "unregisterComponent", [cmp]);
				}
				cmp.stop();
				this._components.splice(idx, 1);
			} else {
				HUBU.logger.info("Component " + cmp.getComponentName() + " not unregistered - not on the hub");
			}
			return this;
		};
		Hub.prototype.start = function() {
			var ext, _i, _len, _ref;
			if (this._started) {
				return this;
			}
			if (this._extensions === null) {
				this.configure();
			}
			_ref = this._extensions;
			for (_i = 0, _len = _ref.length;_i < _len;_i++) {
				ext = _ref[_i];
				HUBU.UTILS.invoke(ext, "start", []);
			}
			this._started = true;
			return this;
		};
		Hub.prototype.stop = function() {
			var cmp, ext, _i, _j, _len, _len1, _ref, _ref1;
			if (!this._started) {
				return this;
			}
			this._started = false;
			_ref = this._components;
			for (_i = 0, _len = _ref.length;_i < _len;_i++) {
				cmp = _ref[_i];
				cmp.stop();
			}
			_ref1 = this._extensions;
			for (_j = 0, _len1 = _ref1.length;_j < _len1;_j++) {
				ext = _ref1[_j];
				HUBU.UTILS.invoke(ext, "stop", []);
			}
			return this;
		};
		Hub.prototype.isStarted = function() {
			return this._started;
		};
		Hub.prototype.reset = function() {
			var ext, name, _i, _len, _ref;
			this.stop();
			name = this._name;
			if (this._extensions === null) {
				this.configure();
			}
			_ref = this._extensions;
			for (_i = 0, _len = _ref.length;_i < _len;_i++) {
				ext = _ref[_i];
				HUBU.UTILS.invoke(ext, "reset", []);
			}
			this._components = [];
			this._extensions = null;
			this._name = name;
			return this;
		};
		Hub.prototype.getComponentName = function() {
			return this._name;
		};
		return Hub;
	}();
	getGlobal().hub = (new HUBU.Hub).configure(null, {component_name:"root"});
}).call(this);
