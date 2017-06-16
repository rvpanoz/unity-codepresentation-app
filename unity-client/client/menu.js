define(function() {
  return {
    id: 'panel-container',
    xtype: 'treemenu',
		follow: true,
    items: [{
        text: 'Home',
        href: {
          cls: 'home'
        }
      },{
        text: 'Javascript',
        href: {
          cls: 'rooms/javascript-room'
        }
      }
    ]
  };
});
