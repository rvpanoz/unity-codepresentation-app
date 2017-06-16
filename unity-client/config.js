define(['app', 'lib', 'app-data'], function() {

  //app configuration
  app.config = {
    layout: {
      panel: true,
      panelAutoOpen: false,
    },
    lang: 'en'
  };

  //setup home url
  app.homeUrl = {
    cls: 'home'
  }

  return app.config;
});
