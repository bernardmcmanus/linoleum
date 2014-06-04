(function( window ) {


    var Config = {
        margin: {
            left: 10,
            right: 10,
            top: 10,
            bottom: 10
        },
        indexAttribute: 'data-index',
        stickyClass: 'sticky',
        excludeClass: 'exclude',
        disableClass: 'disable',
        activeClass: 'active',
        distroDelay: 200,
        duration: 400,
        easing: 'ease'
    };

    Config.tile = {
        indexAttribute: Config.indexAttribute,
        stickyClass: Config.stickyClass,
        excludeClass: Config.excludeClass,
        disableClass: Config.disableClass,
        activeClass: Config.activeClass,
        perspective: 10000,
        thickness: 0.0001
    };


    var callbacks = {
        onTileInclude: function() {},
        onTileExclude: function() {},
        beforeFilter: function() {},
        afterFilter: function() {},
        beforeSort: function() {},
        afterSort: function() {}
    };


    function Linoleum( selector , options ) {

        var els = document.querySelectorAll( selector );

        if (els.length < 1) {
            throw new TypeError( 'Invalid selector.' );
        }

        var that = this;

        that.options = $.extend( true , Config , ( options || {} ));
        that.cache = {};
        that.enabled = true;
        that.container = null;

        $.extend( that , callbacks );

        that.handleEvent = that._handleEvent.bind( that );
        $(window).on( 'linoleum resize orientationchange' , that.handleEvent );

        Array.prototype.forEach.call( els , function( element , i ) {

            that.push(
                new Linoleum.Tile( element , that.options.tile )
            );
            
            var index = element.dataset[ that.options.indexAttribute ];
            
            if (typeof index === 'undefined') {
                element.setAttribute( that.options.indexAttribute , i );
            }

        });

        Object.defineProperty( that , 'sticky' , {
            get: function() {
                return that.filter(function( tile ) {
                    return tile.sticky;
                })
                .map(function( tile ) {
                    return tile.index;
                });
            }
        });

        Object.defineProperty( that , 'included' , {
            get: function() {
                return that.reduce(function( p , c ) {
                    p += (c.included ? 1 : 0);
                    return p;
                }, 0);
            }
        });

        Object.defineProperty( that , 'totalWidth' , {
            get: function() {
                return that.reduce(function( p , c ) {
                    p += (c.included ? c.bcr.width : 0);
                    return p;
                }, 0);
            }
        });

        Object.defineProperty( that , 'marginX' , {
            get: function() {
                return that.options.margin.left + that.options.margin.right;
            }
        });

        Object.defineProperty( that , 'totalX' , {
            get: function() {
                return that.totalWidth + (that.marginX * that.included);
            }
        });

        Object.defineProperty( that , 'averageX' , {
            get: function() {
                return (that.totalX / that.included);
            }
        });

        Object.defineProperty( that , 'totalHeight' , {
            get: function() {
                return that.getIncluded().reduce(function( p , c , i ) {
                    p += (i < that.rows ? c.bcr.height : 0);
                    return p;
                }, 0);
            }
        });

        Object.defineProperty( that , 'marginY' , {
            get: function() {
                return that.options.margin.top + that.options.margin.bottom;
            }
        });

        Object.defineProperty( that , 'totalY' , {
            get: function() {
                return that.totalHeight + (that.marginY * that.rows);
            }
        });

        Object.defineProperty( that , 'averageY' , {
            get: function() {
                return that.totalY / that.rows;
            }
        });

        Object.defineProperty( that , 'containerBCR' , {
            get: function() {
                if (!that.container) {
                    return {};
                }
                return that.container.getBoundingClientRect();
            }
        });

        Object.defineProperty( that , 'columns' , {
            get: function() {
                if (!that.container) {
                    return 0;
                }
                return Math.floor( that.containerBCR.width / that.averageX ) || 1;
            }
        });

        Object.defineProperty( that , 'rows' , {
            get: function() {
                if (!that.container) {
                    return 0;
                }
                return Math.ceil( that.included / that.columns );
            }
        });
    }

    
    Linoleum.prototype = Object.create( Array.prototype );


    Linoleum.prototype._handleEvent = function( e , data ) {

        switch (e.type) {

            case 'resize':
            case 'orientationchange':
                this._onViewportChangeEvent( e , data );
            break;
        }
    };


    Linoleum.prototype._updateCache = function() {
        
        var cache = this.cache;
        
        cache.columns = this.columns;
        cache.rows = this.rows;
    };


    Linoleum.prototype._onViewportChangeEvent = function( e , data ) {

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
    };


    Linoleum.prototype.distribute = function( selector , options , callback , _method ) {

        var that = this;
        options = options || {};
        callback = callback || function() {};

        that.container = (selector ? document.querySelector( selector ) : that.container);
        that.view = 'distribute';

        if (!that.container) {
            throw new TypeError( 'linoleum.distribute requires a container.' );
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
            }

            that._updateCache();
            callback();
        });

        that.sizeSizer();

        return that;
    };


    Linoleum.prototype.lSort = function( func ) {

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

    Linoleum.prototype.lFilter = function( func ) {

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

    
    Linoleum.prototype.getSticky = function() {
        return this.filter(function( tile ) {
            return tile.sticky;
        });
    };


    Linoleum.prototype.getIncluded = function() {
        return this.filter(function( tile ) {
            return tile.included;
        });
    };


    Linoleum.prototype.enable = function() {
        this.forEach(function( tile ) {
            tile.enable();
        });
        this.enabled = true;
    };


    Linoleum.prototype.disable = function( evenActive ) {
        this.forEach(function( tile ) {
            if (!evenActive && tile.active) {
                return;
            }
            tile.disable();
        });
        this.enabled = false;
    };


    Linoleum.prototype.sizeSizer = function( options ) {
        $(this.container).children( '.sizer' ).css( 'height' , this.totalY + 'px' );
    };


    Linoleum.prototype.destroy = function() {
        $(window).off( 'linoleum resize orientationchange' , this.handleEvent );
    };


    function defineGrid( instance ) {

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
                $(tile).hx( hxTile );
                $(tile).find( '.inner' ).hx( hxInner );
            }
        });

        if (method !== 'zero') {
            var tiles = $.extend( [] , $(instance) );
            var inners = $.extend( [] , $(instance).find( '.inner' ) );
            $(tiles.concat( inners )).hx( 'done' , callback );
        }
    }


    function createTileHomeView( translate ) {
        return {
            tile: function( tile ) {
                tile._hx.components.transform = [];
                tile._hx.order.transform = [];
                return {
                    type: 'transform',
                    translate: translate
                };
            },
            inner: function( tile ) {
                var inner = tile.querySelector( '.inner' );
                inner._hx.components.transform = [];
                inner._hx.order.transform = [];
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


    window.Linoleum = Linoleum;

    
}( window ));




























