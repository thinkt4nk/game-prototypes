/*!
 * move
 * Copyright(c) 2011 TJ Holowaychuk <tj@vision-media.ca>
 * MIT Licensed
 */

;(function(exports){

  /**
   * Computed style.
   */

  var current = getComputedStyle || currentStyle;

  /**
   * Map of prop -> type for numeric values.
   */

  var map = {
      'top': 'px'
    , 'bottom': 'px'
    , 'left': 'px'
    , 'right': 'px'
    , 'width': 'px'
    , 'height': 'px'
    , 'font-size': 'px'
    , 'margin': 'px'
    , 'margin-top': 'px'
    , 'margin-bottom': 'px'
    , 'margin-left': 'px'
    , 'margin-right': 'px'
    , 'padding': 'px'
    , 'padding-top': 'px'
    , 'padding-bottom': 'px'
    , 'padding-left': 'px'
    , 'padding-right': 'px'
  };

  /**
   * Initialize a `Move` instance with the given `selector`.
   *
   * @param {String} selector
   * @return {Move}
   * @api public
   */

  exports.move = function(selector) {
    return new Move(move.select(selector));
  };

  /**
   * Library version.
   */

  exports.move.version = '0.0.3';

  /**
   * Defaults.
   * 
   *   `duration` - default duration of 500ms
   * 
   */

  move.defaults = {
    duration: 500
  };

  /**
   * Easing functions.
   */

  move.ease = {
      'in': 'ease-in'
    , 'out': 'ease-out'
    , 'in-out': 'ease-in-out'
    , 'snap': 'cubic-bezier(0,1,.5,1)'
  };

  /**
   * Default element selection utilized by `move(selector)`.
   *
   * Override to implement your own selection, for example
   * with jQuery one might write:
   *
   *     move.select = function(selector) {
   *       return jQuery(selector).get(0);
   *     };
   *
   * @param {Object|String} selector
   * @return {Element}
   * @api public
   */

  move.select = function(selector){
    if ('string' != typeof selector) return selector;
    return document.getElementById(selector)
      || document.querySelectorAll(selector)[0];
  };

  /**
   * EventEmitter.
   */

  function EventEmitter() {
    this.callbacks = {};
  }

  /**
   * Listen on the given `event` with `fn`.
   *
   * @param {String} event
   * @param {Function} fn
   */

  EventEmitter.prototype.on = function(event, fn){
    (this.callbacks[event] = this.callbacks[event] || [])
      .push(fn);
    return this;
  };

  /**
   * Emit `event` with the given args.
   *
   * @param {String} event
   * @param {Mixed} ...
   */

  EventEmitter.prototype.emit = function(event){
    var args = Array.prototype.slice.call(arguments, 1)
      , callbacks = this.callbacks[event]
      , len;

    if (callbacks) {
      len = callbacks.length;
      for (var i = 0; i < len; ++i) {
        callbacks[i].apply(this, args)
      }
    }

    return this;
  };

  /**
   * Initialize a new `Move` with the given `el`.
   *
   * @param {Element} el
   * @api public
   */

  exports.Move = function Move(el) {
    if (!(this instanceof Move)) return new Move(el);
    EventEmitter.call(this);
    this.el = el;
    this._props = {};
    this._rotate = 0;
    this._transitionProps = [];
    this._transforms = [];
    this.duration(move.defaults.duration)
  };

  /**
   * Inherit from `EventEmitter.prototype`.
   */

  Move.prototype = new EventEmitter;
  Move.prototype.constructor = Move;

  /**
   * Buffer `transform`.
   *
   * @param {String} transform
   * @return {Move} for chaining
   * @api private
   */

  Move.prototype.transform = function(transform){
    this._transforms.push(transform);
    return this;
  };

  /**
   * Skew `x` and `y`.
   *
   * @param {Number} x
   * @param {Number} y
   * @return {Move} for chaining
   * @api public
   */

  Move.prototype.skew = function(x, y){
    y = y || 0;
    return this.transform('skew('
      + x + 'deg, '
      + y + 'deg)');
  };

  /**
   * Skew x by `n`.
   *
   * @param {Number} n
   * @return {Move} for chaining
   * @api public
   */

  Move.prototype.skewX = function(n){
    return this.transform('skewX(' + n + 'deg)');
  };

  /**
   * Skew y by `n`.
   *
   * @param {Number} n
   * @return {Move} for chaining
   * @api public
   */

  Move.prototype.skewY = function(n){
    return this.transform('skewY(' + n + 'deg)');
  };

  /**
   * Translate `x` and `y` axis.
   *
   * @param {Number} x
   * @param {Number} y
   * @return {Move} for chaining
   * @api public
   */

  Move.prototype.translate = 
  Move.prototype.to = function(x, y){
    y = y || 0;
    return this.transform('translate('
      + x + 'px, '
      + y + 'px)');
  };

  /**
   * Translate on the x axis to `n`.
   *
   * @param {Number} n
   * @return {Move} for chaining
   * @api public
   */

  Move.prototype.translateX =
  Move.prototype.x = function(n){
    return this.transform('translateX(' + n + 'px)');
  };

  /**
   * Translate on the y axis to `n`.
   *
   * @param {Number} n
   * @return {Move} for chaining
   * @api public
   */

  Move.prototype.translateY =
  Move.prototype.y = function(n){
    return this.transform('translateY(' + n + 'px)');
  };

  /**
   * Scale the x and y axis by `x`, or 
   * individually scale `x` and `y`.
   *
   * @param {Number} x
   * @param {Number} y
   * @return {Move} for chaining
   * @api public
   */

  Move.prototype.scale = function(x, y){
    y = null == y ? x : y;
    return this.transform('scale('
      + x + ', '
      + y + ')');
  };

  /**
   * Scale x axis by `n`.
   *
   * @param {Number} n
   * @return {Move} for chaining
   * @api public
   */

  Move.prototype.scaleX = function(n){
    return this.transform('scaleX(' + n + ')');
  };

  /**
   * Scale y axis by `n`.
   *
   * @param {Number} n
   * @return {Move} for chaining
   * @api public
   */

  Move.prototype.scaleY = function(n){
    return this.transform('scaleY(' + n + ')');
  };

  /**
   * Rotate `n` degrees.
   *
   * @param {Number} n
   * @return {Move} for chaining
   * @api public
   */

  Move.prototype.rotate = function(n){
    return this.transform('rotate(' + n + 'deg)');
  };

  /**
   * Set transition easing function to to `fn` string.
   *
   * When:
   *
   *   - null "ease" is used
   *   - "in" "ease-in" is used
   *   - "out" "ease-out" is used
   *   - "in-out" "ease-in-out" is used
   *
   * @param {String} fn
   * @return {Move} for chaining
   * @api public
   */

  Move.prototype.ease = function(fn){
    fn = move.ease[fn] || fn || 'ease';
    return this.setVendorProperty('transition-timing-function', fn);
  };

  /**
   * Set duration to `n`.
   *
   * @param {Number|String} n
   * @return {Move} for chaining
   * @api public
   */

  Move.prototype.duration = function(n){
    n = this._duration = 'string' == typeof n
      ? parseFloat(n) * 1000
      : n;
    return this.setVendorProperty('transition-duration', n + 'ms');
  };

  /**
   * Delay the animation by `n`.
   *
   * @param {Number|String} n
   * @return {Move} for chaining
   * @api public
   */

  Move.prototype.delay = function(n){
    n = 'string' == typeof n
      ? parseFloat(n) * 1000
      : n;
    return this.setVendorProperty('transition-delay', n + 'ms');
  };

  /**
   * Set `prop` to `val`, deferred until `.end()` is invoked.
   *
   * @param {String} prop
   * @param {String} val
   * @return {Move} for chaining
   * @api public
   */

  Move.prototype.setProperty = function(prop, val){
    this._props[prop] = val;
    return this;
  };

  /*
   * Checks if position property is set
   *
   * @param {String} prop
   */
  Move.prototype.hasPositionProperty = function(prop) {
    if( prop === 'top' || prop === 'bottom' )
    {
      return 'undefined' !== typeof this._props['top'] || 'undefined' !== typeof this._props['bottom'];
    }
    if( prop === 'left' || prop === 'right' )
    {
      return 'undefined' !== typeof this._props['left'] || 'undefined' !== typeof this._props['right'];
    }
  };

  /*
   * Gets the value of a position property
   *
   * @param {String} prop
   */
  Move.prototype.getPositionProperty = function(prop) {
    if( typeof this._props[prop] !== 'undefined' ) {
      return this._props[prop];
    }
  };

  /**
   * Set a vendor prefixed `prop` with the given `val`.
   *
   * @param {String} prop
   * @param {String} val
   * @return {Move} for chaining
   * @api public
   */

  Move.prototype.setVendorProperty = function(prop, val){
    this.setProperty('-webkit-' + prop, val);
    this.setProperty('-moz-' + prop, val);
    this.setProperty('-ms-' + prop, val);
    this.setProperty('-o-' + prop, val);
    return this;
  };

  /**
   * Set `prop` to `value`, deferred until `.end()` is invoked
   * and adds the property to the list of transition props.
   *
   * @param {String} prop
   * @param {String} val
   * @return {Move} for chaining
   * @api public
   */

  Move.prototype.set = function(prop, val){
    this.transition(prop);
    if ('number' == typeof val && map[prop]) val += map[prop]; 
    this._props[prop] = val;
    return this;
  };

  /*
   * Set containment for Move object
   *
   * @param {Object} container
   */
  Move.prototype.contain = function(container)
  {
    if( typeof container === 'string' )
    {
      // selector containment
      var container = $(container);
      if( container.length > 0 )
      {
        var offset = container.offset()
          , left = offset.left
          , top = offset.top
          , right = left + container.width()
          , bottom = top + container.height()
          ;
        
        this.contain({
          left : '+' + left + '-' + right,
          top : '+' + top + '-' + bottom,
        });
      }
    }
    else if( typeof container === 'object' ) {
      if( typeof container.top !== 'undefined' ) {
        this.setContainment('top',container.top);
      }
      if( typeof container.right !== 'undefined' ) {
        this.setContainment('right',container.right);
      }
      if( typeof container.bottom !== 'undefined' ) {
        this.setContainment('bottom',container.bottom);
      }
      if( typeof container.left !== 'undefined' ) {
        this.setContainment('left',container.left);
      }
    }
    this.on('start',function() {
      this.getContainment().applyContainment(this)
    }.bind(this));
    // return for chaining
    return this;
  };

  /*
   * Containment constructor, class for containing moving objects
   *
   */
  Containment = function() {
    // stub
  };

  /*
   * Set containment property
   *
   * @param {String} prop
   * @param {String} val
   */
  Containment.prototype.set = function(prop,val) {
    var _prop = this._prop || {};
    _prop[prop] = val;
    this._prop = _prop;
    return this;
  };

  /*
   * Apply containment for each containment property, allows for competing constraints for single properties, as well
   *
   * @param {Move} move
   * TODO: Allow for competing, converse properties when only a single property is set for x and y
   */
  Containment.prototype.applyContainment = function(move) {
    $.each(this._prop, function(prop, val) {
      if( move.hasPositionProperty(prop) ) {
        var operations = {};
        operations[val[0]] = {
          value : parseInt(val.split('').slice(1).join('')),
          prop : prop
        };
        // two constraints
        var split_vals = val.split(/[\+\-]/);
        if( split_vals.length > 2 )
        {
          var second_attr = (val.indexOf('+') > val.indexOf('-')) ? '+' : '-';
          operations = {};
          operations[val[0]] = {
            value : split_vals[1],
            prop : prop
          };
          operations[second_attr] = {
            value : split_vals[2],
            prop : prop
          };
        }
        $.each(operations, function(operator, operation) {
          this.applyPropertyContainment(move,operator,operation.prop,operation.value);
        }.bind(this));
      }
    }.bind(this));
  };

  Containment.prototype.applyPropertyContainment = function(move,operator,prop,value)
  {
    var move_position = move.translatePosition(prop,value);
    if( operator === '+' )
    {
      // apply greater than
      if( move_position.el_value < move_position.dest_value )
      {
        console.log(move_position.el_value + ' < ' + move_position.dest_value);
        move.set(move_position.property,move_position.dest_value);
      }
    }
    else if( operator === '-' )
    {
      // apply less than
      if( move_position.el_value > move_position.dest_value )
      {
        console.log(move_position.el_value + ' > ' + move_position.dest_value);
        move.set(move_position.property,move_position.dest_value);
      }
    }
  }

  Move.prototype.translatePosition = function(prop,value)
  {
    if (typeof this._props[prop] !== 'undefined') {
      // return as-is
      return {
        property: prop,
        dest_value: value,
        el_value: parseInt(this.getPositionProperty(prop).replace(/(.*)px$/,'$1'))
      };
    }
    else {
      // translate
      var object_attr = (prop === 'top' || prop === 'bottom') ? 'height' : 'width';
      // set converse property
      var property = 'top';
      if( prop !== 'bottom' )
      {
        if( $.inArray(prop,['left','right']) )
        {
          property = (prop === 'left') ? 'right' : 'left';
        } else {
          property = 'bottom';
        }
      }
      var window_val = $(document)[object_attr]();
      console.log([window_val,document]);
      var object_val = $(this.el)[object_attr]();
      var converse_el_val = parseInt(this.getPositionProperty(property).replace(/(.*)px$/,'$1'));
      var translated_el_val =  window_val - converse_el_val - object_val;
      var translated_dest_val = window_val - value - object_val;
      console.log('converting ' + prop + ':' + converse_el_val + ' => ' + translated_el_val + ', window:' + window_val + ',object:' + object_val);
      console.log('converting ' + property + ':' + value + ' => ' + translated_dest_val + ', window:' + window_val + ',object:' + object_val);
      return {
        property: property,
        el_value: translated_el_val,
        dest_value: translated_dest_val
      }
    }
  }

  /**
   * Get containment singleton
   *
   * @api public
   */
  Move.prototype.getContainment = function()
  {
    if( 'undefined' === typeof this._containment )
    {
      this._containment = new Containment;
    }
    return this._containment;
  }

  /**
   * Set containment property
   *
   * @param {String} prop
   * @param {String} val
   * @return {Containment} for chaining
   */
  Move.prototype.setContainment = function(prop, val)
  {
    return this.getContainment().set(prop,val);
  };

  /**
   * Increment `prop` by `val`, deferred until `.end()` is invoked
   * and adds the property to the list of transition props.
   *
   * @param {String} prop
   * @param {Number} val
   * @return {Move} for chaining
   * @api public
   */

  Move.prototype.add = function(prop, val){
    var self = this;
    return this.on('start', function(){
      var curr = parseInt(self.current(prop), 10);
      self.set(prop, curr + val + 'px');
    });
  };

  /**
   * Decrement `prop` by `val`, deferred until `.end()` is invoked
   * and adds the property to the list of transition props.
   *
   * @param {String} prop
   * @param {Number} val
   * @return {Move} for chaining
   * @api public
   */

  Move.prototype.sub = function(prop, val){
    var self = this;
    return this.on('start', function(){
      var curr = parseInt(self.current(prop), 10);
      self.set(prop, curr - val + 'px');
    });
  };

  /**
   * Get computed or "current" value of `prop`.
   *
   * @param {String} prop
   * @return {String}
   * @api public
   */

  Move.prototype.current = function(prop){
    return current(this.el).getPropertyValue(prop);
  };

  /**
   * Add `prop` to the list of internal transition properties.
   *
   * @param {String} prop
   * @return {Move} for chaining
   * @api private
   */

  Move.prototype.transition = function(prop){
    if (!this._transitionProps.indexOf(prop)) return this;
    this._transitionProps.push(prop);
    return this;
  };

  /**
   * Commit style properties, aka apply them to `el.style`.
   *
   * @return {Move} for chaining
   * @see Move#end()
   * @api private
   */

  Move.prototype.applyProperties = function(){
    var props = this._props
      , el = this.el;

    for (var prop in props) {
      if (props.hasOwnProperty(prop)) {
        el.style.setProperty(prop, props[prop], '');
      }
    }

    return this;
  };

  /**
   * Re-select element via `selector`, replacing
   * the current element.
   *
   * @param {String} selector
   * @return {Move} for chaining
   * @api public
   */

  Move.prototype.move =
  Move.prototype.select = function(selector){
    this.el = move.select(selector);
    return this;
  };

  /**
   * Defer the given `fn` until the animation
   * is complete. `fn` may be one of the following:
   *
   *   - a function to invoke
   *   - an instanceof `Move` to call `.end()`
   *   - nothing, to return a clone of this `Move` instance for chaining
   *
   * @param {Function|Move} fn
   * @return {Move} for chaining
   * @api public
   */

  Move.prototype.then = function(fn){
    // invoke .end()
    if (fn instanceof Move) {
      this.on('end', function(){
        fn.end();
      });
    // callback
    } else if ('function' == typeof fn) {
      this.on('end', fn);
    // chain
    } else {
      var clone = new Move(this.el);
      // inherit transforms, not sure why
      clone._transforms = this._transforms.slice(0);
      this.then(clone);
      clone.parent = this;
      return clone;
    }

    return this;
  };

  /**
   * Pop the move context.
   *
   * @return {Move} parent Move
   * @api public
   */

  Move.prototype.pop = function(){
    return this.parent;
  };

  /**
   * Start animation, optionally calling `fn` when complete.
   *
   * @param {Function} fn
   * @return {Move} for chaining
   * @api public
   */

  Move.prototype.end = function(fn){
    var self = this;

    // emit "start" event
    this.emit('start');

    // transforms
    if (this._transforms.length) {
      this.setVendorProperty('transform', this._transforms.join(' '));
    }

    // transition properties
    this.setVendorProperty('transition-properties', this._transitionProps.join(', '));
    this.applyProperties();

    // callback given
    if (fn) this.then(fn);

    // emit "end" when complete
    setTimeout(function(){
      self.emit('end');
    }, this._duration);

    return this;
  };

})(this);
