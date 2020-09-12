module.exports = {
	extends: ['react-app', 'prettier', 'prettier/react'],
	rules: {
		'comma-dangle': ['error', 'never'],
		indent: [
			'error',
			'tab',
			{
				SwitchCase: 1
			}
		],
		'react/jsx-indent': ['error', 'tab'],
		// 'react/jsx-first-prop-new-line': [1, 'multiline'],
		// 'react/jsx-max-props-per-line': [1,
		// 	{
		// 		'maximum': 1
		// 	}
		// ],
		'jsx-quotes': ['error', 'prefer-double'],
		'react/jsx-closing-bracket-location': 1,
		semi: ['warn', 'always'],
		'key-spacing': ['warn', { 'beforeColon': false, 'afterColon': true }]
	}
};
