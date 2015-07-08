require.config({
	baseUrl: '../js/libs',
	paths: {
		'pages'   : '../pages',
		'plugins' : '../plugins',
		'utils'   : '../utils',
	},
	shim: {
		'modernizr': {
			exports: 'Modernizr'
		},
		'detectizr': {
			deps    : ['modernizr'],
			exports : 'Modernizr.Detectizr'
		},
	},

	waitSeconds: 15,

	urlArgs: 'ts=' + (new Date()).getTime(),

});