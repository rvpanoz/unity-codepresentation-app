'use strict';

define(['lib', 'app'], function () {

	var Message = app.define(null, {
		extend: app.classes.model,
		mk_fields: {
			ID: 'int',
			MESSAGE_TEXT: 'string',
		  CREATED_AT: 'date'
		}
	});

  var Messages = app.define(null, {
    extend: app.classes.collection,
    model: Message,
		comparator: function(m1, m2) {
			var ca1 = m1.get('CREATED_AT');
			var ca2 = m2.get('CREATED_AT');

			return ca2 > ca1;
		}
  });

	var Instructor = app.define(null, {
		extend: app.classes.model,
		mk_fields: {
			ID: 'int',
			USERNAME: {
				type: 'string',
				required: true
			},
			ROOMNAME: {
				type: 'string',
				required: true
			},
			ISLOGGEDIN: 'int',
			ONLINE_STATUS: {
				type: 'string',
				calc: function() {
					var ISLOGGEDIN = this.get('ISLOGGEDIN');
					return (ISLOGGEDIN === 1) ? "<span class='online'>" : "<span class='offline'>";
				}
			},
			CREATED_AT: 'date'
		}
	});

	var Instructors = app.define(null, {
		extend: app.classes.collection,
		model: Instructor
	});

  return {
    Message: Message,
    Messages: Messages,
		Instructor: Instructor,
		Instructors: Instructors
  }
});
