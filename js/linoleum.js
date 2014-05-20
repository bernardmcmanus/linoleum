(function() {

    var config = {
        enabled: true,
        margin: {
            left: 10,
            right: 10,
            top: 10,
            bottom: 10
        },
        stackPosition: {
            x: 0,
            y: 0
        },
        indexAttribute: 'data-index',
        stickyClass: 'sticky',
        distroDelay: 200,
        distroSelector: null,
        duration: 300,
        easing: 'ease'
    };

    config.tile = {
        indexAttribute: config.indexAttribute,
        stickyClass: config.stickyClass,
        perspective: 10000,
        thickness: 0.0001,
        modal: {
            x: null,
            y: null,
            z: 5000
        }
    };


    var callbacks = {
        onTileInclude: function() {},
        onTileExclude: function() {},
        beforeFilter: function() {},
        afterFilter: function() {},
        beforeSort: function() {},
        afterSort: function() {}
    };


    window.linoleum = function( selector , options ) {

        var els = document.querySelectorAll( selector );

        if (els.length < 1) {
            throw 'Error: You must pass a valid selector to the linoleum constructor.';
        }

        $.extend( this , callbacks );
        this.options = $.extend( true , config , ( options || {} ));
        this.listeners = {};

        var tiles = [];

        Array.prototype.forEach.call( els , function( element , i ) {
            tiles.push( new linoleum.tile( element , this.options.tile ));
            var index = element.dataset[ this.options.indexAttribute ];
            if (typeof index === 'undefined') {
                element.setAttribute( this.options.indexAttribute , i );
            }
        }.bind( this ));

        var that = $.extend( tiles , this );

        if (!that.options.enabled) {
            that.disable();
        }
        else {
            that.enable();
        }

        that.stickyIndexes = getStickyIndexes( that );

        return that;
    };

    linoleum.prototype = {

        distribute: function( selector , options , callback ) {

            selector = selector || this.distroSelector;

            if (!this._setView( 'distribute' )) {
                return;
            }

            if (this.count( true ) < 1) {
                return;
            }

            if (!selector || selector === '') {
                throw 'Error: You must pass a valid selector to linoleum.distribute.';
            }

            this.distroSelector = selector;

            if (!document.querySelector( selector )) {
                throw 'Error: You must pass a valid selector to linoleum.distribute.';
            }

            this._startListen( 'sizer' );

            options = $.extend({
                margin: this.options.margin,
                duration: this.options.duration,
                easing: this.options.easing
            }, (options || {}));

            var grid = _distribute( this , options , function() {
                this.enable();
                callback.call( this );
            });

            this.Columns = grid.Columns;
            this.Rows = grid.Rows;
            this.sizeSizer();

            return this;
        },

        stack: function( position , options , callback ) {

            if (!this._setView( 'stack' )) {
                return;
            }

            this._stopListen( 'sizer' );

            position = $.extend( config.stackPosition , (position || {}));

            options = $.extend({
                duration: this.options.duration,
                easing: this.options.easing
            }, (options || {}));

            callback = callback || function() {};

            var t = null;

            for (var i = 0; i < this.count( true ); i++) {
                if (this[i].view !== 'home') {
                    t = i;
                    break;
                }
            }

            if (t !== null) {
                this[t].setView( 'home' , options , function() {
                    _stack( this , position , options , function() {
                        //this.sizeSizer();
                        callback.apply( this , arguments );
                    });
                }.bind( this ));
            }
            else {
                _stack( this , position , options , function() {
                    //this.sizeSizer();
                    callback.apply( this , arguments );
                });
            }

            return this;
        },

        sort: function( func ) {

            func = func || function() { return 0; };

            var that = this;
            
            that.beforeSort();
            
            var sticky = that.getSticky();
            var tiles = that.getTiles().sort( func );

            sticky.forEach(function( tile , i ) {
                var index = that.stickyIndexes[i];
                tiles.splice( index , 0 , tile );
            });
            
            $.extend( that , tiles );
            
            that.afterSort();
        },

        filter: function( exclude ) {
            
            exclude = exclude || [];

            var that = this;

            that.beforeFilter();

            that.forEach(function( tile ) {

                if (tile.isSticky()) {
                    return;
                }

                var i = tile.getIndex();
                
                if (exclude.indexOf( i ) >= 0) {
                    tile.exclude();
                    that.onTileExclude( tile );
                }
                else if (!tile.isIncluded()) {
                    tile.include();
                    that.onTileInclude( tile );
                }
            });

            that.afterFilter();
        },

        count: function( countExcluded ) {
            countExcluded = (typeof countExcluded !== 'undefined' ? countExcluded : false);
            var count = 0;
            this.forEach(function( tile ) {
                if (tile.isIncluded() || countExcluded) {
                    count++;
                }
            });
            return count;
        },

        getTiles: function( getSticky ) {
            getSticky = (typeof getSticky !== 'undefined' ? getSticky : false);
            var list = [];
            this.forEach(function( tile ) {
                if (!tile.isSticky() || getSticky) {
                    list.push( tile );
                }
            });
            return list;
        },

        getSticky: function() {
            var list = [];
            this.forEach(function( tile ) {
                if (tile.isSticky()) {
                    list.push( tile );
                }
            });
            return list;
        },

        getIncluded: function() {
            var list = [];
            this.forEach(function( tile ) {
                if (tile.isIncluded()) {
                    list.push( tile );
                }
            });
            return list;
        },

        getExcluded: function() {
            var list = [];
            this.forEach(function( tile ) {
                if (!tile.isIncluded()) {
                    list.push( tile );
                }
            });
            return list;
        },

        _setView: function ( view ) {
            
            if (this.view === view) {
                return true;
            }

            this._stopListen( this.view );

            if (view === 'distribute') {
                this._activate();
            }
            else {
                this._deactivate();
            }

            this._startListen( view );
            this.view = view;
            
            return true;
        },

        _startListen: function( type ) {

            if (this.listeners[ type ] || typeof listeners[ type ] !== 'function') {
                return;
            }
            
            this.listeners[ type ] = listeners[ type ].bind( this );
            startListen[ type ].call( this , this.listeners[ type ] );
        },

        _stopListen: function( type ) {

            if (!type) {
                return;
            }
            
            if (!this.listeners[ type ] || typeof listeners[ type ] !== 'function') {
                return;
            }

            stopListen[ type ].call( this , this.listeners[ type ] );
            delete this.listeners[ type ];
        },

        isEnabled: function() {
            return this.enabled === true;
        },

        enable: function() {
            
            this.forEach(function( tile ) {
                tile.enable();
            });
            
            this.enabled = true;
        },

        disable: function( evenActive ) {
            
            this.forEach(function( tile ) {
                if (!evenActive && $(tile).hasClass( 'active' )) {
                    return;
                }
                tile.disable();
            });
            
            this.enabled = false;
        },

        _activate: function() {
            $(this).css( 'pointer-events' , '' );
        },

        _deactivate: function() {
            $(this).css( 'pointer-events' , 'none' );
        },

        sizeSizer: function( options ) {

            if (typeof this.Rows === 'undefined') {
                return;
            }

            options = $.extend({
                margin: this.options.margin
            } , ( options || {} ));

            var parent = document.querySelector( this.distroSelector );
            var totalY = getTotalY( this , this.Rows , options );

            $(parent).children( '.sizer' ).css( 'height' , totalY + 'px' );
        },

        destroy: function() {
            this._stopListen( this.view );
            this._stopListen( 'sizer' );
        }
    };


    function getStickyIndexes( instance ) {
        var sticky = [];
        instance.forEach(function( tile ) {
            if (tile.isSticky()) {
                sticky.push( tile.getIndex() );
            }
        });
        return sticky;
    }


    function _stack( instance , translate , options , callback ) {

        var xformTile = $.extend({
            type: 'transform',
            translate: translate,
        }, options );

        var xformInner = $.extend({
            type: 'transform',
            rotate: {x: 1, a: 80}
        }, options );

        var completed = 0;

        function position( tile , resolve ) {
            resolve = resolve || function() {};
            $(tile).hx( xformTile );
            $(tile).find( '.inner' )
            .hx( xformInner )
            .done( resolve );
        }

        function exec() {

            var targetSet = instance.getIncluded();
            var promiseSet = [];
            
            targetSet.forEach(function( tile ) {
                promiseSet.push(
                    new Promise(function( resolve ) {
                        position( tile , resolve );
                    })
                );
            });
            
            Promise.all( promiseSet ).then( callback.bind( instance ));
        }

        exec();
    }


    function _distribute( instance , options , callback ) {

        callback = callback || function() {};
        var parent = document.querySelector( instance.distroSelector );
        var containerDims = parent.getBoundingClientRect();
        var Columns = 0;
        var Rows = 0;
        var completed = 0;

        function position( tile , row , col , resolve ) {

            resolve = resolve || function() {};

            var ox = getCenterOffsetX( instance , tile , Columns , options );

            var t = {
                x: (col * tile.dims.width) + (options.margin.left * (col + 1)) + (options.margin.right * (col + 1)) + ox,
                y: (row * tile.dims.height) + (options.margin.bottom * row) + (options.margin.top * (row + 1))
            };

            tile.setHome( t );

            $(tile).hx({
                type: 'transform',
                translate: t,
                easing: options.easing,
                duration: options.duration
            });

            $(tile).find( '.inner' ).hx({
                type: 'transform',
                rotate: null,
                duration: options.duration,
                easing: options.easing
            })
            .done( resolve );
        }

        function exec() {

            var totalX = getTotalX( instance , options );
            Columns = getCols( instance , totalX , containerDims );
            Rows = getRows( instance , Columns );

            var i = 0;
            var targetSet = instance.getIncluded();
            var promiseSet = [];


            for (var row = 0; row < Rows; row++) {
                for (var col = 0; col < Columns; col++) {
                    
                    if (i >= instance.count()) {
                        continue;
                    }
                    
                    promiseSet.push(
                        new Promise(function( resolve ) {
                            position( targetSet[i] , row , col , resolve );
                        })
                    );

                    i++;
                }
            }

            Promise.all( promiseSet ).then( callback.bind( instance ));
        }

        exec();

        return {
            Columns: Columns,
            Rows: Rows
        };
    }

    function getCenterOffsetX( instance , tile , cols , options ) {
        var parent = document.querySelector( instance.distroSelector );
        var parentDims = parent.getBoundingClientRect();
        var marginX = options.margin.left + options.margin.right;
        return (parentDims.width - (tile.dims.width * cols) - (marginX * (cols + 1))) / 2;
    }

    function getTotalX( instance , options ) {
        var marginX = options.margin.left + options.margin.right;
        return (instance[0].dims.width * instance.count()) + (marginX * (instance.count() + 1));
    }

    function getTotalY( instance , rows , options ) {
        var marginY = options.margin.top + options.margin.bottom;
        return (instance[0].dims.height * rows) + (marginY * (rows + 1));
    }

    function getInstanceX( instance , totalX ) {
        return totalX / instance.count();
    }

    function getInstanceY( rows , totalY ) {
        return totalY / rows;
    }

    function getRows( instance , cols ) {
        return Math.ceil( instance.count() / cols );
    }

    function getCols( instance , totalX , containerDims ) {
        
        var instX = getInstanceX( instance , totalX );
        var cols = 0;
        
        while ((cols * instX) < containerDims.width) {
            cols++;
        }

        if ((cols * instX) > containerDims.width) {
            cols -= 1;
        }

        return cols;
    }


    var listeners = {

        distribute: function( e ) {

            var parent = document.querySelector( this.distroSelector );
            var dims = parent.getBoundingClientRect();
            
            var totalX = getTotalX( this , this.options );
            var cols = getCols( this , totalX , dims );
            
            if (this.Columns === cols) {
                var opt = $.extend( {} , this.options , {
                    duration: 0,
                    fallback: false
                });
                _distribute( this , opt );
                return;
            }

            var optionSet = null;

            var handle = function() {
                var grid = _distribute( this , optionSet );
                this.Columns = grid.Columns;
                this.Rows = grid.Rows;
                this.sizeSizer();
            }.bind( this );

            if (this.options.distroDelay) {

                optionSet = this.options;
                var timeout = setTimeout( handle , this.options.distroDelay );

                $(window).on( 'resize orientationchange' , function timer() {
                    $(window).off( 'resize orientationchange' , timer );
                    clearTimeout( timeout );
                });
            }
            else {

                optionSet = {
                    duration: 0,
                    fallback: false,
                    margin: this.options.margin
                };

                $(window).on( 'resize orientationchange' , handle );
            }
        },

        sizer: function( e ) {

            var parent = document.querySelector( this.distroSelector );
            var dims = parent.getBoundingClientRect();
            var top = parseInt(getComputedStyle( parent ).top , 10 );

            function size( h ) {
                h = ((typeof h !== 'undefined' && typeof h !== 'object') ? h : ($(window).height() - dims.top - $(window).scrollTop()));
                $(parent).children( '.sizer' ).css( 'min-height' , h + 'px' );
            }

            size();
        }
    };


    var startListen = {

        distribute: function( listener ) {
            $(window).on( 'resize orientationchange' , listener );
        },

        sizer: function( listener ) {
            $(window).on( 'resize orientationchange' , listener );
            listener();
        }
    };


    var stopListen = {

        distribute: function( listener ) {
            $(window).off( 'resize orientationchange' , listener );
        },

        sizer: function( listener ) {
            $(window).off( 'resize orientationchange' , listener );
        }
    };

    
}());




























