window.Linoleum = (function( window , document , Object , Array , Error , $ , E$ ) {


  function Linoleum( selector , options ) {

    var that = this;

    that.duration = 400;
    that.delay = 200;
    that.easing = 'ease';
    that.margin = {
      left: 5,
      right: 5,
      top: 5,
      bottom: 5
    };

    $.extend( true , that , options );

    //that.cache = {};
    that.enabled = true;
    that.container = null;

    that.grid = new Linoleum.Grid( selector , {
      margin: that.margin
    });

    E$.construct( that );

    Object.defineProperties( that , {
      hxOptions: {
        get: function() {
          return {
            duration: that.duration,
            easing: that.easing,
            delay: that.delay
          };
        }
      }
    });

    that.handleEvent = that.handleEvent.bind( that );

    $(window).on( 'resize orientationchange' , that.handleEvent );
  }


  Linoleum.defineView = function( name , components ) {
    Linoleum.Tile.defineView( name , components );
  };


  Linoleum._defineAttr = function( name ) {
    return 'data-linoleum-' + name;
  };


  Linoleum._getAttr = function( subject , attr ) {
    var value = subject.getAttribute( attr );
    switch (attr) {
      case Linoleum.INDEX:
        return parseInt( value , 10 );
      default:
        return value;
    }
  };


  Linoleum.INDEX = Linoleum._defineAttr( 'index' );

  Linoleum.STICKY = Linoleum._defineAttr( 'sticky' );

  Linoleum.EXCLUDED = Linoleum._defineAttr( 'excluded' );

  Linoleum.DISABLED = Linoleum._defineAttr( 'disabled' );


  Linoleum.prototype = E$.create({

    handleEvent: function( e , data ) {

      var that = this;

      switch (e.type) {

        case 'resize':
        case 'orientationchange':
          that.distribute();
        break;
      }
    },

    distribute: function( selector , options ) {

      var that = this;
      var grid = that.grid;

      that.container = $(selector).get( 0 ) || that.container;
      options = $.extend( that.hxOptions , options );
      
      if (grid.distribute( that.container , options )) {
        $(grid).hx( 'done' , function() {
          $(document).trigger( 'linoleum.resize' , [ grid ]);
        });
      }
    }

  });


  /*Linoleum.prototype = */(function() {

    var proto = E$.create({});

    proto.handleEvent = function( e , data ) {

      var that = this;

      switch (e.type) {

        case 'resize':
        case 'orientationchange':
          $(that.grid).hx().detach().clear().defer( that.delay );
          that.distribute();
        break;
      }
    };

    proto.distribute = function( selector ) {
      var that = this;
      var grid = that.grid;
      that.container = $(selector).get( 0 ) || that.container;
      grid.distribute( that.container ).done(function() {
        $(document).trigger( 'linoleum.resize' , [ grid ]);
      });
    };

    /*proto._updateCache = function() {

      var cache = this.cache;

      cache.columns = this.columns;
      cache.rows = this.rows;
    };*/

    /*proto._onViewportChangeEvent = function( e , data ) {

      var that = this;

      if (that.view !== 'distribute') {
        return;
      }

      if ((that.columns === that.cache.columns) || !that.options.distroDelay) {
        that.distribute( null , {} , null , 'zero' );
        return;
      }

      that.rejectViewPromise = that.rejectViewPromise || function() {};
      that.rejectViewPromise();

      var viewPromise, viewPromiseTO;

      viewPromise = new Promise(function( resolve , reject ) {
        that.rejectViewPromise = reject;
        viewPromiseTO = setTimeout( resolve , that.options.distroDelay );
      });

      viewPromise.then(function() {
        that.distribute();
      });

      viewPromise.catch(function() {
        clearTimeout( viewPromiseTO );
      });
    };*/

    /*proto.distribute = function( selector , options , callback , _method ) {

      var that = this;
      options = options || {};
      callback = callback || function() {};

      that.container = (selector ? document.querySelector( selector ) : that.container);
      that.view = 'distribute';

      if (!that.container) {
        throw new Error( 'linoleum.distribute requires a container.' );
      }

      options = $.extend({
        duration: that.options.duration,
        easing: that.options.easing
      } , options );

      that.grid = defineGrid( that );

      _distribute( that , options , _method , function() {

        if (_method !== 'zero') {
          $(document).trigger( 'linoleum.distribute' , {
            rows: that.rows,
            columns: that.columns
          });
          that._updateCache();
        }
        
        callback();
      });

      that.resize();

      return that;
    };*/

    proto.lSort = function( func ) {

      func = func || function() { return 0; };

      var that = this;

      that.beforeSort();

      var sticky = that.getSticky();

      var tiles = that
        .filter(function( tile ) {
          return !tile.sticky;
        })
        .sort( func );

      sticky.forEach(function( tile , i ) {
        var index = that.sticky[i];
        tiles.splice( index , 0 , tile );
      });

      $.extend( that , tiles );

      that.afterSort();

      return that;
    };

    proto.lFilter = function( func ) {

      func = func || function() { return true; };

      var that = this;

      that.beforeFilter();

      var sticky = that.getSticky();

      var tiles = that
        .filter(function( tile ) {

          if (tile.sticky) {
            return false;
          }

          var result = func( tile );

          if (!result) {
            tile.exclude();
          }
          else {
            tile.include();
          }

          return true;
        });

      sticky.forEach(function( tile , i ) {
        var index = that.sticky[i];
        tiles.splice( index , 0 , tile );
      });

      $.extend( that , tiles );
      that.afterFilter();
      return that;
    };

    proto.getSticky = function() {
      return this.filter(function( tile ) {
        return tile.sticky;
      });
    };

    proto.getIncluded = function() {
      return this.filter(function( tile ) {
        return tile.included;
      });
    };

    proto.enable = function() {
      this.forEach(function( tile ) {
        tile.enable();
      });
      this.enabled = true;
    };

    proto.disable = function( evenActive ) {
      this.forEach(function( tile ) {
        if (!evenActive && tile.active) {
          return;
        }
        tile.disable();
      });
      this.enabled = false;
    };

    proto.resize = function( options ) {

      if ($(this.container).children( '.sizer' ).height() === this.totalY) {
        return;
      }

      $(this.container).children( '.sizer' ).css( 'height' , this.totalY + 'px' );

      $(document).trigger( 'linoleum.resize' , {
        rows: this.rows,
        columns: this.columns
      });
    };

    proto.destroy = function() {
      $(window).off( 'resize orientationchange' , this.handleEvent );
    };

    return proto;

  }());


  /*function defineGrid( instance ) {

    var grid = [];
    var i = 0;

    for (var row = 0; row < instance.rows; row++) {

      for (var col = 0; col < instance.columns; col++) {

        if (i >= instance.included) {
          break;
        }

        grid.push(
          getGridPosition( instance , instance[i] , row , col )
        );

        i++;
      }
    }

    return grid;
  }

  function getGridPosition( instance , tile , row , col ) {
    return {
      x: (col * tile.bcr.width) + (instance.marginX * (col + 1)) + getCenterOffsetX( instance , tile ),
      y: (row * tile.bcr.height) + (instance.options.margin.top * (row + 1)) + (instance.options.margin.bottom * row)
    };
  }


  function _distribute( instance , options , method , callback ) {

    instance.getIncluded().forEach(function( tile , i ) {

      var translate = instance.grid[i];

      tile.defineView( 'home' , createTileHomeView( translate ));

      if (tile.active) {
        return;
      }

      var hxTile = {
        type: 'transform',
        translate: translate,
        easing: options.easing,
        duration: options.duration
      };

      var hxInner = {
        type: 'transform',
        rotate: null,
        duration: options.duration,
        easing: options.easing
      };

      if (method === 'zero') {
        $(tile).hx( 'zero' , hxTile );
        $(tile).find( '.inner' ).hx( 'zero' , hxInner );
      }
      else {
        $(tile).hx().animate( hxTile );
        $(tile).find( '.inner' ).hx().animate( hxInner );
      }
    });

    if (method !== 'zero') {
      $(instance).hx( 'done' , callback );
    }
  }


  function createTileHomeView( translate ) {
    return {
      method: 'animate',
      tile: function( tile ) {
        $(tile).hx().reset( 'transform' );
        return {
          type: 'transform',
          translate: translate
        };
      },
      inner: function( tile ) {
        var inner = tile.querySelector( '.inner' );
        $(inner).hx().reset( 'transform' );
        return {
          type: 'transform'
        };
      },
      after: function( tile ) {
        tile.deactivate();
      }
    };
  }


  function getCenterOffsetX( instance , tile ) {
    return (instance.containerBCR.width - (tile.bcr.width * instance.columns) - (instance.marginX * (instance.columns + 1))) / 2;
  }


  function descriptor( get , set ) {
    return {
      get: get,
      set: set
    };
  }*/


  return Linoleum;


}( window , document , Object , Array , Error , jQuery , E$ ));














