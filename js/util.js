define([], function() {

  return {
    notNull: function( subject ) {
      return subject !== null && typeof subject != 'undefined';
    },
    ensureArray: function( subject ) {
      return (subject.jquery ? subject.toArray() : (Array.isArray( subject ) ? subject : [ subject ]));
    }
  };

});