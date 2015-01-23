define([ 'util' , 'tile' ] , function( util , Tile ) {


  function Grid( selector , options ) {

    var that = this;

    $.extend( true , that , options );

    that.rows = 0;
    that.cols = 0;

    $(selector).toArray().map(function( element , i ) {
      var tile = new Tile( element );
      tile.index = util.notNull( tile.index ) ? tile.index : i;
      return tile;
    })
    .sort(function( a , b ) {
      return a.index - b.index;
    })
    .forEach(function( td ) {
      that.push( td );
    });

    Object.defineProperties( that , {
      count: {
        get: function() {
          return that.get().length;
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
          var elements = that.elements();
          return {
            width: $(elements).outerWidth(),
            height: $(elements).outerHeight()
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
      }
    });
  }


  Grid.prototype = (function() {

    var proto = Object.create( Array.prototype );

    proto.get = function( filters ) {
      
      var that = this;
      
      filters = $.extend( Tile.defaults , filters );

      return that.filter(function( tile ) {
        for (var key in filters) {
          if (filters[key] !== tile[key]) {
            return false;
          }
        }
        return true;
      });
    };

    proto.elements = function( filters ) {
      var that = this;
      return that.get( filters ).map(function( tile ) {
        return tile.element;
      });
    };

    proto.inverse = function( subset ) {
      var that = this;
      return that.filter(function( tile ) {
        return subset.indexOf( tile ) < 0;
      });
    };

    proto._filter = function( func ) {

      var that = this;
      var sticky = that.get({ sticky: true });
      var include = that.filter( func );
      var exclude = that.inverse( include );

      include.forEach(function( tile ) {
        tile.write({ included: true });
      });

      exclude.forEach(function( tile ) {
        tile.write({ included: false });
      });
      
      console.log('include',include);
      console.log('exclude',exclude);

      return that;
    };

    proto._sort = function( func ) {
      var that = this;
      var tiles = that.get().sort( func );
      return that._swap( tiles );
    };

    proto._swap = function( swap ) {
      var that = this;
      var length = swap.length;
      var i = 0;
      while (i < length) {
        that[i] = swap[i];
        i++;
      }
      return that;
    };

    proto.resize = function( container , force ) {
      var that = this;
      var layout = that._buildLayout( container , force );
      if (layout) {
        that.layout = layout;
        return true;
      }
      return false;
    };

    proto.distribute = function( options ) {
      
      var that = this;
      var elements = that.elements();
      var layout = that.layout;

      $(elements)
      .hx()
      .detach()
      .clear();

      if (options.delay) {
        $(elements).hx( 'defer' , options.delay );
      }

      return $(elements)
      .hx()
      .animate({
        type: 'transform',
        translate: function( element , i ) {
          return layout[i];
        },
        duration: options.duration,
        easing: options.easing
      });
    };

    proto._buildLayout = function( container , force ) {
      
      var that = this;
      var c = that._getCols( container );
      var r = that._getRows( c );
      var layout = [];

      if (force || (c != that.cols || r != that.rows)) {
        for (var i = 0; i < r; i++) {
          for (var j = 0; j < c; j++) {
            layout.push({
              x: that._getX( j ),
              y: that._getY( i )
            });
          }
        }
        that.rows = r;
        that.cols = c;
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

    proto._getCols = function( container ) {
      var that = this;
      var count = that.count;
      var oSize = that.oSize;
      var bcr = container.getBoundingClientRect();
      var cols = Math.floor( bcr.width / oSize.width );
      return cols <= count ? cols : count;
    };

    proto._getRows = function( cols ) {
      var that = this;
      return Math.ceil( that.count / cols ) || 0;
    };

    return proto;

  }());


  return Grid;

});



















