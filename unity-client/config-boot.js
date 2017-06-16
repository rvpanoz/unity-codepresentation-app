unity_boot.hook = function (step) {
	switch (step) {
	case 1:
		require.config({
			paths: {
				'schema': './schema',
				'common': './common',
				'codemirror': './bower_components/codemirror/lib/codemirror'
			}
		});
		break;
		case 2:
		requirejs([
			'css!./bower_components/codemirror/theme/cobalt'
		]);
		break;
	default:

	}
};
