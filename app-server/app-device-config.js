var endpoint_dispatcher_url = 'http://127.0.0.1:32200/dispatch';

module.exports = {
  config:function () {
    return {
      name:'app_device',
      endpoints:{
        'dispatcher': {
          enforce_rpc: true,
          url:endpoint_dispatcher_url
        }
      }
    };
  }
};
