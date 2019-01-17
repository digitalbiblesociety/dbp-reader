const exec = require('child_process').exec;
exec(
	'cd ./node_modules/redux-persist-immutable; npm run build; echo "built redux-persist-immutable"; cd ../../',
	function(err, stdout, stderr) {
		if (err) {
			throw err;
		}
	},
);
