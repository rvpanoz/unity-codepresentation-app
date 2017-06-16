define(function () {
	return function () {
		return {
			items: [{
					xtype: 'grid',
					columns: 2,
					items: [{
						className: 'code-container',
						items: [{
							xtype: 'textarea',
							itemId: 'code-area'
						}, {
							itemId: 'console-output'
						}]
					}, {
						className: 'users-container',
						items: [{
							html: '<h2>Instructors </h2>'
						}, {
							xtype: 'list',
							multiSelect: false,
							collection: this.instructors,
							items: [{
								body: '<%= USERNAME %> <%= ONLINE_STATUS %>'
							}]
						}]
					}]
				},
				{
					xtype: 'spacer',
					height: 25
				},
				{
					xtype: 'grid',
					columns: 2,
					items: [{
						className: 'messages-area',
						items: [{
							className: 'messages-actions',
							items: [{
								xtype: 'textarea',
								itemId: 'message-area',
								className: 'message-area'
							}, {
								xtype: 'button',
								itemId: 'btn-send-msg',
								className: 'btn-send-msg',
								text: 'Send'
							}]
						}]
					}, {
						className: 'messages-list-container',
						items: [{
							html: '<h2>Messages </h2>'
						}, {
							xtype: 'list',
							className: 'messages-list',
							multiSelect: false,
							collection: this.messages,
							items: [{
								body: '<%= MESSAGE_TEXT %>'
							}]
						}]
					}]
				}
				// {
				// 	xtype: 'grid',
				// 	columns: 1,
				// 	items: [{
				// 		xtype: 'spacer',
				// 		height: 25
				// 	}, {
				// 		xtype: 'button',
				// 		itemId: 'btn-disconnect',
				// 		text: 'Disconnect'
				// 	}]
				// }
			]
		};
	}
});
