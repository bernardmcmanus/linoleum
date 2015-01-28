define([ 'util' , 'tile' ], function( util , Tile ) {


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



















