/*! linoleum - 0.3.0 - Bernard McManus - nightly - g31302d - 2015-01-27 */


(function ( root , factory ) {
  if (typeof define == 'function' && define.amd) {
    define([] , factory );
  }
  else {
    root.Linoleum = factory();
  }
}( this , function() {var define, requireModule, require, requirejs;

(function() {
  var registry = {}, seen = {};

  define = function(name, deps, callback) {
    registry[name] = {
      deps: deps,
      callback: callback
    };
  };

  requirejs = require = requireModule = function(name) {
    requirejs._eak_seen = registry;

    if (seen[name]) {
      return seen[name];
    }
    seen[name] = {};

    if (!registry[name]) {
      throw new Error("Could not find module " + name);
    }

    var mod = registry[name],
      deps = mod.deps,
      callback = mod.callback,
      reified = [],
      exports;

    for (var i = 0, l = deps.length; i < l; i++) {
      if (deps[i] === 'exports') {
        reified.push(exports = {});
      } else {
        reified.push(requireModule(resolve(deps[i])));
      }
    }

    var value = callback.apply(this, reified);
    return seen[name] = exports || value;

    function resolve(child) {
      if (child.charAt(0) !== '.') {
        return child;
      }
      var parts = child.split("/");
      var parentBase = name.split("/").slice(0, - 1);

      for (var i = 0, l = parts.length; i < l; i++) {
        var part = parts[i];

        if (part === '..') {
          parentBase.pop();
        } else if (part === '.') {
          continue;
        } else {
          parentBase.push(part);
        }
      }

      return parentBase.join("/");
    }
  };
})();
define("amd-loader", function(){});

/*! emoney - 0.2.3 - Bernard McManus - master - g75a578 - 2015-01-10 */
(function(){function a(){var b=B.now(),c=a.last,d=.001;return c=(b===C.floor(c)?c:b)+d,a.last=c,c}function b(a){return a.length}function c(a,b){return a.indexOf(b)}function d(a){return z.isArray(a)}function e(a){return d(a)?a:a!==y?[a]:[]}function f(a,b){return e(a).forEach(b)}function g(a){return A.create(a)}function h(a,b,c){A.defineProperty(a,b,c)}function i(a,b){delete a[b]}function j(a){return A.keys(a)}function k(a){return z[D].shift.call(a)}function l(a){return z[D].pop.call(a)}function m(a,b,c){return z[D].slice.call(a,b||0,c)}function n(a){return a[b(a)-1]}function o(a,b){return typeof b==G?typeof a==b:a instanceof b}function p(a){return o(a,E)?a:function(){}}function q(a){var b={};for(var c in a)h(b,c,{value:a[c]});return b}function r(a){return(a||{})[L]?a[L]:a}function s(a,b){return a===b?null:a}function t(a){var b=this;return o(b,t)?void b.__init(b,a||{}):new t(a)}function u(b,c){var d=this;d.target=b,d.type=c,d[M]=!1,d[N]=!1,d.timeStamp=a()}function v(b,c,d){var f=this;f.func=b,f.context=c,f.uts=a(),f.bindArgs=e(d),f._reset(f)}function w(a,b){var d=a.map(function(a){return a.func});return c(d,b)}function x(){var a=g(S);return a.__init=function(a,b){for(var c in b)a[c]=b[c];T(a)},a.$watch=function(a){var b=this;return f(a,function(a){a.$when(H,b)}),b},a.$ignore=function(a){var b=this;return f(a,function(a){a.$dispel(H,!0,b)}),b},a.$$enq=function(a){var b=this;b.__stack.push(a)},a.$$flush=function(a){var c,d=this,e=d.__stack;if(!d.__inprog||a){for(d.__inprog=!0;b(e);)try{c=k(e),a||c()}catch(f){throw d.$$flush(!0),f}d.__inprog=!1}},a}var y,z=Array,A=Object,B=Date,C=Math,D=(Error,"prototype"),E="function",F="object",G="string",H="*",I="$when",J="$emit",K="$dispel",L="handleE$",M="cancelBubble",N="defaultPrevented",O=t,P=u;u[D]={preventDefault:function(){this[N]=!0},stopPropagation:function(){this[M]=!0}};var Q=v;v[D]={_reset:function(a){a.before=p(),a.after=p()},invoke:function(a,b){var c=this;if(!a[M]){var d=c.func,f=m(c.bindArgs).concat(e(b));f.unshift(a),c.before(a,d),d.apply(c.context,f),a[N]||c.after(a,d),c._reset(c)}}};var R=function(a){return a&&o(a,F)&&L in a},S={$once:function(){var a=this,b=a.__parse(I,arguments);return a._$when(arguments,function(c){c.before=function(c,d){a.$dispel(b[0],!0,d)}}),a.$$flush(),a},$when:function(){var a=this;return a._$when(arguments),a.$$flush(),a},$emit:function(){var a=this,b=a.__parse(J,arguments);return a.$$enq(function(){f(b[0],function(c){c!=H&&a.__invoke(c,b[1],b[2])})}),a.$$flush(),a},$dispel:function(){var a=this,b=a.__parse(K,arguments),c=r(b[2]);return a.$$enq(function(){f(b[0],function(d){a.__remove(d,c,!!b[1])})}),a.$$flush(),a},_$when:function(a,b){b=p(b);var c=this,d=c.__parse(I,a),e=r(d[2]),g=s(d[2],e);c.$$enq(function(){f(d[0],function(a){var f=c.__add(a,e,g,d[1]);b(f)})})},__parse:function(a,d){{var g=this,h=[];g.__events}return d=m(d),f([0,1,2],function(f){f?2>f?(h[2]=o(n(d),E)||R(n(d))?l(d):null,h[2]=a!=K?h[2]||g:h[2]):h[1]=d[0]:(h[0]=k(d)||e(a!=I?g.__events:H),a==J&&(h[0]=1!=b(h[0])||c(h[0],H)?h[0]:g.__events))}),h},__get:function(a,b){var c=this,d=c.handlers,f=a?e(d[a]):d;return a&&b&&a!=H&&(f=c.__get(H).concat(f).sort(function(a,b){return a.uts-b.uts})),f},__invoke:function(a,b,c){var d=this,e=d.__get(a,!0),g=new P(d,a);f(e,function(a){a.invoke(g,b)}),g[N]||p(c)(g)},__add:function(a,b,c,d){var e=this,f=new Q(b,c,d),g=e.__get(a);return g.push(f),e.handlers[a]=g,f},__remove:function(a,c,d){for(var e,f=this,g=f.__get(),h=f.__get(a),j=0;j<b(h);)e=c?w(h,c):j,e>=0&&(d||a!=H)&&(h.splice(e,1),j--),j++;b(h)?g[a]=h:i(g,a)}},T=function(a){h(a,"__stack",{value:[]}),h(a,"__inprog",{value:!1,writable:!0}),h(a,"__events",{get:function(){return j(a.handlers)}}),h(a,"handlers",{value:{}}),h(a,L,{value:p(a[L]).bind(a)})},U=x(),V=function(a){var b=q(g(U));for(var c in a)b[c]=a[c];return b};O[D]=q(U),O.is=R,O.create=V,O.construct=T;var W=O;"function"==typeof define&&define.amd?define('emoney',[],function(){return W}):"object"==typeof exports?module.exports=W:this.E$=W}).call(this);
define('util',[], function() {

  function is( subject , test ) {
    return (typeof test == 'string') ? (typeof subject == test) : (subject instanceof test);
  }

  function notNull( subject ) {
    return subject !== null && !is( subject , 'undefined' );
  }

  function ensureArray( subject ) {
    return (subject.jquery ? subject.toArray() : (Array.isArray( subject ) ? subject : [ subject ]));
  }

  function arrayCast( subject ) {
    return Array.prototype.slice.call( subject , 0 );
  }

  function inverse( full , partial ) {
    return full.filter(function( element ) {
      return partial.indexOf( element ) < 0;
    });
  }

  function last( subject ) {
    return subject[( subject.length || 1 ) - 1 ];
  }

  function getIndexes( elements ) {
    return ensureArray( elements ).map(function( element ) {
      return is( element , 'number' ) ? element : Linoleum.getAttr( element , Linoleum.INDEX );
    });
  }

  function bcr( subject ) {
    return subject.getBoundingClientRect();
  }

  return {
    is: is,
    notNull: notNull,
    ensureArray: ensureArray,
    arrayCast: arrayCast,
    inverse: inverse,
    last: last,
    getIndexes: getIndexes,
    bcr: bcr
  };

});




















define('asap',[], function() {

  var UNDEFINED;
  var UNDEFINED_STR = '' + UNDEFINED;

  var len = 0;
  var toString = {}.toString;

  function asap( callback , arg ) {
    queue[len] = callback;
    queue[len + 1] = arg;
    len += 2;
    if (len == 2) {
      scheduleFlush();
    }
  }

  var browserWindow = (typeof window != UNDEFINED_STR) ? window : UNDEFINED;
  var browserGlobal = browserWindow || {};
  var BrowserMutationObserver = browserGlobal.MutationObserver || browserGlobal.WebKitMutationObserver;
  var isNode = typeof process != UNDEFINED_STR && {}.toString.call(process) == '[object process]';

  var isWorker = typeof Uint8ClampedArray != UNDEFINED_STR &&
    typeof importScripts != UNDEFINED_STR &&
    typeof MessageChannel != UNDEFINED_STR;


  function useMutationObserver() {
    var iterations = 0;
    var observer = new BrowserMutationObserver(flush);
    var node = document.createTextNode('');
    observer.observe(node, { characterData: true });

    return function() {
      node.data = (iterations = ++iterations % 2);
    };
  }

  // web worker
  function useMessageChannel() {
    var channel = new MessageChannel();
    channel.port1.onmessage = flush;
    return function () {
      channel.port2.postMessage(0);
    };
  }

  function useSetTimeout() {
    return function() {
      setTimeout(flush, 1);
    };
  }

  var queue = new Array(1000);

  function flush() {
    for (var i = 0; i < len; i+=2) {
      var callback = queue[i];
      var arg = queue[i+1];

      callback(arg);

      queue[i] = UNDEFINED;
      queue[i+1] = UNDEFINED;
    }

    len = 0;
  }

  var scheduleFlush;

  if (BrowserMutationObserver) {
    scheduleFlush = useMutationObserver();
  } else if (isWorker) {
    scheduleFlush = useMessageChannel();
  } else {
    scheduleFlush = useSetTimeout();
  }

  return asap;

});




















define('tile',[ 'util' ], function( util ) {


  var PROPERTIES = [ 'index' , 'sort' , 'sticky' , 'excluded' , 'disabled' ];


  function Tile( element ) {

    var that = this;

    that.element = element;

    PROPERTIES.forEach(function( key ) {
      var cKey = key.toUpperCase();
      var val = Linoleum.getAttr( element , Linoleum[cKey] );
      that[key] = util.notNull( val ) ? val : Tile.defaults[key];
    });
  }


  Object.defineProperties( Tile , {
    defaults: {
      get: function() {
        return {
          sticky: false,
          excluded: false,
          disabled: false
        };
      }
    }
  });


  Tile.prototype = {

    init: function( index ) {
      var that = this;
      that.index = index;
      that.sort = index;
      return that;
    },

    write: function( options ) {
      var that = this;
      var element = that.element;
      $.extend( that , options );
      element.setAttribute( Linoleum.INDEX , that.index );
      element.setAttribute( Linoleum.SORT_INDEX , that.sort );
      element.setAttribute( Linoleum.STICKY , that.sticky );
      element.setAttribute( Linoleum.EXCLUDED , that.excluded );
      element.setAttribute( Linoleum.DISABLED , that.disabled );
      return that;
    }
  };


  return Tile;

});




















define('grid',[ 'util' , 'tile' ], function( util , Tile ) {


  function Grid( selector , options ) {

    var that = this;

    $.extend( true , that , options );

    that.rows = 0;
    that.cols = 0;
    that.busy = false;
    that.bcr = null;
    that._layout = null;

    that.add( $(selector) );

    Object.defineProperties( that , {
      count: {
        get: function() {
          return that.get().length;
        }
      },
      firstVisible: {
        get: function() {
          return $(that.elements()).filter( ':visible' ).get( 0 );
        }
      },
      last: {
        get: function() {
          return that.slice( 0 ).sort(function( a , b ) {
            return a.index - b.index;
          })
          .pop();
        }
      },
      layout: {
        get: function() {
          return that._layout.map(function( coords ) {
            delete coords.x;
            coords.x = coords.x + that.offset;
            return coords;
          });
        }
      },
      marginX: {
        get: function() {
          var margin = that.margin;
          return margin.left + margin.right;
        }
      },
      marginY: {
        get: function() {
          var margin = that.margin;
          return margin.top + margin.bottom;
        }
      },
      iSize: {
        get: function() {
          var bcr = util.bcr( that.firstVisible );
          return {
            width: bcr.width,
            height: bcr.height
          };
        }
      },
      oSize: {
        get: function() {
          var iSize = that.iSize;
          return {
            width: iSize.width + that.marginX,
            height: iSize.height + that.marginY
          };
        }
      },
      size: {
        get: function() {
          var oSize = that.oSize;
          return {
            width: oSize.width * that.cols,
            height: oSize.height * that.rows
          };
        }
      },
      offset: {
        get: function() {
          var bcr = that.bcr;
          return bcr ? (bcr.width - that.size.width) / 2 : 0;
        }
      }
    });
  }


  Grid.prototype = (function() {

    var proto = Object.create( Array.prototype );

    proto.add = function( elements ) {
      var that = this;
      var last = that.last;
      util.ensureArray( elements ).forEach(function( element , i ) {
        that.push(
          new Tile( element ).init( i + ( last ? last.index : 0 ))
        );
      });
      return that._order();
    };

    proto.remove = function( elements ) {
      var that = this;
      var remove = util.ensureArray( elements );
      var tiles = that.get( true ).filter(function( tile ) {
        return remove.indexOf( tile.element ) < 0;
      });
      return that._swap( tiles )._order();
    };

    proto._order = function() {
      var that = this;
      that.sort(function( a , b ) {
        return a.index - b.index;
      })
      .map(function( tile , i ) {
        return tile.write({ index: i });
      })
      .sort(function( a , b ) {
        return a.sort - b.sort;
      })
      .map(function( tile , i ) {
        return tile.write({ sort: i });
      });
      return that;
    };

    proto.get = function( filters ) {
      
      var that = this;
      var normal = [], sticky = [], tiles = that;

      if (filters !== true) {
        filters = $.extend( Tile.defaults , { sticky: '*' } , filters );
        tiles = tiles.filter(function( tile ) {
          for (var key in filters) {
            if (filters[key] !== '*' && filters[key] !== tile[key]) {
              return false;
            }
          }
          return true;
        });
      }

      /*tiles.forEach(function( tile ) {
        if (tile.sticky) {
          sticky.push( tile );
        }
        else {
          normal.push( tile );
        }
      });

      normal = normal.sort(function( a , b ) {
        return a.sort - b.sort;
      });

      sticky.forEach(function( tile ) {
        normal.splice( tiles.indexOf( tile ) + 1 , 0 , tile );
      });

      return normal;*/

      return tiles.sort(function( a , b ) {
        var aIndex = a.sticky ? a.index + 1 : a.sort;
        var bIndex = b.sticky ? b.index - 1 : b.sort;
        return aIndex - bIndex;
      });
    };

    proto.elements = function( filters ) {
      var that = this;
      return that.get( filters ).map(function( tile ) {
        return tile.element;
      });
    };

    proto._filter = function( func ) {

      var that = this;
      var sticky = that.get({ sticky: true });
      var include = that.filter( func );
      var exclude = util.inverse( that , include );
      //var swap = [].concat( sticky , include , exclude );

      include.forEach(function( tile ) {
        tile.write({ excluded: false });
      });

      exclude.forEach(function( tile ) {
        tile.write({ excluded: true });
      });
      
      /*console.log('include',include);
      console.log('exclude',exclude);*/

      return that;
    };

    proto._sort = function( func ) {
      var that = this;
      that.sort( func ).forEach(function( tile , i ) {
        tile.write({ sort: i });
      });
      return that;
    };

    proto._swap = function( swap ) {
      var that = this;
      that.splice( 0 );
      while (swap.length) {
        that.push( swap.shift() );
      }
      return that;
    };

    proto.resize = function( container , force ) {
      var that = this;
      var layout = that._buildLayout( container , force );
      if (layout) {
        that._layout = layout.map(function( coords ) {
          return Object.create( coords );
        });
        return true;
      }
      return false;
    };

    proto.distribute = function( options ) {
      
      var that = this;
      var elements = that.elements();
      var layout = that.layout;

      that.busy = true;

      $(elements)
      .hx()
      .detach()
      .clear();

      if (options.delay) {
        $(elements).hx( 'defer' , options.delay );
      }

      return $(elements)
      .hx( options.method , {
        type: 'transform',
        translate: function( element , i ) {
          return layout[i];
        },
        duration: options.duration,
        easing: options.easing
      })
      .then(function( resolve ) {
        that.busy = false;
        resolve();
      });
    };

    proto.nudge = function( options ) {
      
      var that = this;
      var elements = that.elements();
      var layout;

      if (that.busy) {
        that.distribute($.extend( options , { delay: 0 }));
      }
      else {
        layout = that.layout;
        $(elements)
        .hx()
        .zero({
          type: 'transform',
          translate: function( element , i ) {
            return layout[i];
          }
        });
        /*$(elements)
        .hx()
        .update({
          type: 'transform',
          translate: function( element , i ) {
            return layout[i];
          }
        })
        .paint();*/
      }

    };

    proto._buildLayout = function( container , force ) {
      
      var that = this;
      var bcr = util.bcr( container );
      var c = that._getCols( bcr.width );
      var r = that._getRows( c );
      var layout = [];

      that.bcr = bcr;

      if (force || (c != that.cols || r != that.rows)) {
        that.rows = r;
        that.cols = c;
        for (var i = 0; i < r; i++) {
          for (var j = 0; j < c; j++) {
            layout.push({
              x: that._getX( j ),
              y: that._getY( i )
            });
          }
        }
      }
      else {
        layout = false;
      }

      return layout;
    };

    proto._getX = function( col ) {
      var that = this;
      var margin = that.margin;
      var iSize = that.iSize;
      return (iSize.width + that.marginX) * col + (that.marginX / 2);
    };

    proto._getY = function( row ) {
      var that = this;
      var margin = that.margin;
      var iSize = that.iSize;
      return (iSize.height + that.marginY) * row + (that.marginY / 2);
    };

    proto._getCols = function( width ) {
      var that = this;
      var count = that.count;
      var oSize = that.oSize;
      var cols = Math.floor( width / oSize.width );
      return cols <= count ? cols : count;
    };
    /*proto._getCols = function( container ) {
      var that = this;
      var count = that.count;
      var oSize = that.oSize;
      var bcr = util.bcr( container );
      var cols = Math.floor( bcr.width / oSize.width );
      return cols <= count ? cols : count;
    };*/

    proto._getRows = function( cols ) {
      var that = this;
      return Math.ceil( that.count / cols ) || 0;
    };

    return proto;

  }());


  return Grid;

});




















define('linoleum',[ 'util' , 'asap' , 'grid' ], function( util , asap , Grid ) {


  var DOM_EVENTS = [ 'resize' , 'orientationchange' ];
  var SIZER_CLASS = 'linoleum-sizer';
  var DISTRIBUTE = 'distribute';
  var NUDGE = 'nudge';
  var RESIZE = 'resize';
  var SORT = 'sort';
  var FILTER = 'filter';
  var ERROR = 'error';
  var ADD = 'add';
  var REMOVE = 'remove';


  function Linoleum( selector , options ) {

    var that = this;

    that.method = 'animate';
    that.duration = 300;
    that.delay = 200;
    that.easing = 'ease';
    that.margin = buildMarginObject( 5 );

    $.extend( true , that , options );

    if (!util.is( that.margin , 'object' )) {
      that.margin = buildMarginObject( that.margin );
    }

    that.enabled = true;
    that.container = null;

    that.grid = new Grid( selector , {
      margin: that.margin
    });

    E$.construct( that );

    Object.defineProperties( that , {
      distroOpts: {
        get: function() {
          return {
            method: that.method,
            duration: that.duration,
            easing: that.easing,
            delay: that.delay,
            force: true
          };
        }
      },
      elements: {
        get: function() {
          return that.grid.elements( true );
        }
      }/*,
      included: {
        get: function() {
          return that.grid.elements({ included: true });
        }
      },
      excluded: {
        get: function() {
          return that.grid.elements({ included: false });
        }
      }*/
    });

    DOM_EVENTS.forEach(function( evt ) {
      window.addEventListener( evt , that );
    });
  }


  Linoleum._defineAttr = function( name ) {
    return 'data-linoleum-' + name;
  };


  Linoleum.getAttr = function( subject , attr ) {
    var val = subject.getAttribute( attr );
    switch (attr) {
      case Linoleum.INDEX:
      case Linoleum.SORT_INDEX:
        return isNaN(parseInt( val , 10 )) ? null : parseInt( val , 10 );
      case Linoleum.STICKY:
      case Linoleum.EXCLUDED:
      case Linoleum.DISABLED:
        return util.notNull( val ) ? ( 'true' ? true : false ) : null;
      default:
        return val;
    }
  };


  Linoleum.INDEX = Linoleum._defineAttr( 'index' );

  Linoleum.SORT_INDEX = Linoleum._defineAttr( 'sort' );

  Linoleum.STICKY = Linoleum._defineAttr( 'sticky' );

  Linoleum.EXCLUDED = Linoleum._defineAttr( 'excluded' );

  Linoleum.DISABLED = Linoleum._defineAttr( 'disabled' );


  Linoleum.prototype = E$.create({

    subset: function( filters ) {
      var that = this;
      return $(that.grid.elements( filters ));
    },

    sticky: function( elements , value ) {
      var that = this;
      that._toggleTile( elements , 'sticky' , value );
    },

    excluded: function( elements , value ) {
      var that = this;
      that._toggleTile( elements , 'excluded' , value );
    },

    disabled: function( elements , value ) {
      var that = this;
      that._toggleTile( elements , 'disabled' , value );
    },

    _toggleTile: function( elements , property , value ) {

      var that = this;
      var grid = that.grid;
      var indexes = util.getIndexes( elements );
      
      grid.forEach(function( tile ) {
        var newval = util.is( value , 'undefined' ) ? !tile[property] : value;
        var write = {};
        write[property] = newval;
        if (indexes.indexOf( tile.index ) >= 0) {
          that.$emit(( 'tile.' + property ) , [ tile , newval ] , function( e ) {
            tile.write( write );
          });
        }
      });
    },

    handleEvent: function( e , data ) {

      var that = this;

      switch (e.type) {

        case 'resize':
        case 'orientationchange':
          that.distribute({ force: false }).then(function( isResize ) {
            if (isResize) {
              that.$emit( RESIZE , [ that.grid ]);
            }
          });
        break;
      }
    },

    sizer: function() {
      var that = this;
      var grid = that.grid;
      asap(function() {
        var sizer = document.createElement( 'div' );
        var container = that.container;
        if (!$(container).find( '.' + SIZER_CLASS ).length) {
          $(sizer).addClass( SIZER_CLASS ).appendTo( container );
          that.$when( DISTRIBUTE , function( e ) {
            $(sizer).css({
              width: grid.size.width,
              height: grid.size.height
            });
          });
        }
      });
      return that;
    },

    distribute: function( /*selector , options*/ ) {

      var that = this;
      var grid = that.grid;
      var args = util.arrayCast( arguments );
      var selector = util.is( args[0] , 'string' ) ? args.shift() : null;
      var options = args.pop();

      that.container = $(selector).get( 0 ) || that.container;
      options = $.extend( that.distroOpts , options );

      return new Promise(function( resolve ) {
        asap(function() {
          if (grid.resize( that.container , options.force )) {
            that.$emit( DISTRIBUTE , [ grid ] , function( e ) {
              grid.distribute( options )/*.hx( 'done' , function() {
                resolve( true );
              })*/;
              resolve( true );
            });
          }
          else {
            that.$emit( NUDGE , [ grid ] , function( e ) {
              grid.nudge( options );
              resolve( false );
            });
          }
        });
      })
      .catch(function( err ) {
        that.$emit( ERROR , err );
      });
    },

    sort: function( func ) {

      var that = this;
      var grid = that.grid;
      
      return new Promise(function( resolve ) {
        grid._sort( func || function() { return 0; });
        that.$emit( SORT , [ grid ] , resolve );
        reject();
      })
      .catch(function( err ) {
        if (err) {
          that.$emit( ERROR , err );
        }
      });
    },

    filter: function( func ) {

      var that = this;
      var grid = that.grid;
      
      return new Promise(function( resolve ) {
        grid._filter( func || function() { return true; });
        that.$emit( FILTER , [ grid ] , resolve );
        reject();
      })
      .catch(function( err ) {
        if (err) {
          that.$emit( ERROR , err );
        }
      });
    },

    add: function( elements ) {
      var that = this;
      that.$emit( ADD , [ elements ] , function( e ) {
        that.grid.add( elements );
      });
    },

    remove: function( elements ) {
      var that = this;
      that.$emit( REMOVE , [ elements ] , function( e ) {
        that.grid.remove( elements );
      });
    }

  });


  function buildMarginObject( val ) {
    var margin = {};
    [
      'left',
      'right',
      'top',
      'bottom'
    ]
    .forEach(function( key ) {
      margin[key] = val;
    });
    return margin;
  }


  return Linoleum;

});




















  var Linoleum = require( 'linoleum' );
  Linoleum.Grid = require( 'grid' );
  Linoleum.Tile = require( 'tile' );
  return Linoleum;
}));