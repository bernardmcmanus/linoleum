define([ 'util' , 'asap' , 'grid' ], function( util , asap , Grid ) {


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
    that.duration = 400;
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
              grid.distribute( options ).hx( 'done' , function() {
                //resolve( true );
              });
              resolve( true );
            });
          }
          else {
            that.$emit( NUDGE , [ grid ] , function( e ) {
              grid.nudge();
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



















