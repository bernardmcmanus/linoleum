define([], function() {

  return {
    notNull: function( subject ) {
      return subject !== null && typeof subject != 'undefined';
    }
  };

});