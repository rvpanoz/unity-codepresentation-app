define([
  'schema', 'home-cfg', 'lib', 'app'
], function(schema, fcfg) {

  var HomeHandler = app.define(null, {
    extend: 'app.classes.ContentHandler',
    view: fcfg,
    initialize: function() {
      this.cfg = fcfg.call(this);
      this.ready();
    }
  });

  return HomeHandler;
});
