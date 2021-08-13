// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "css-units" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('css-units.helloWorld', function () {
		// The code you place here will be executed every time your command is executed
		const editor = vscode.window.activeTextEditor;

		if(!editor) {
			vscode.window.showInformationMessage('Please select a CSS Unit!');
			return;
		}

		const text = editor.document.getText(editor.selection);
		if (containsUnits(text)) {
			// vscode.window.showInformationMessage(`Selected Text: ${text}`);

			const quickPick = vscode.window.createQuickPick();

			let responseOne = getRelativeResponse(text);
			let responseTwo = getAbsoluteResponse(text);

			responseOne = Object.keys(responseOne).map(key => responseOne[key]);
			responseTwo = Object.keys(responseTwo).map(key => responseTwo[key]);

			quickPick.items = [...responseOne, ...responseTwo];
			
			quickPick.items = quickPick.items.map((x) => (
				x.indexOf('absolute') === 0 
				? {label: x.substring(x.indexOf(' ') + 1), detail: "Absolute Unit"} 
				: {label: x, detail: "Relative Unit"} 
			));
			
			quickPick.onDidChangeSelection((item) => {
				if(item) {					
					editor.edit((edit) => {
						edit.replace(editor.selection, item[0].label);
					})
					quickPick.dispose();


				}
			})

			quickPick.onDidHide(() => quickPick.dispose());
			quickPick.show();
		}
		else {
			vscode.window.showInformationMessage('Selected input does not contain px, em, rem, ex or vmin unit!');
		}
		
		

	});

	context.subscriptions.push(disposable);
}

function containsUnits (text) {
	return text.indexOf('px') > -1 || text.indexOf('em') > -1 || text.indexOf('rem') > -1 || text.indexOf('ex') > -1 || text.indexOf('vmin') > -1;
}


function getRelativeResponse (value) {
	let units;

	if (value.indexOf('px') > -1) {
		
		let number = parseFloat(value.substring(0, value.indexOf('px')));
		units = convertFromPixel(number);
	}
	else {
		let number;
		if (value.indexOf('em') > -1) {
			number = value.substring(0, value.indexOf('em'));
		}
		else if (value.indexOf('rem') > -1) {
			number = value.substring(0, value.indexOf('rem'));
		}
		else if (value.indexOf('ex') > -1) {
			number = value.substring(0, value.indexOf('ex'));
		}
		else if (value.indexOf('vmin') > -1) {
			number = value.substring(0, value.indexOf('vmin'));
		}
		number = parseFloat(number);
		units = convertFromRemOrEm(number);
	}

	return units;
}

function getAbsoluteResponse (value) {

	let units;

	if (value.indexOf('px') > -1) {
		
		let number = parseFloat(value.substring(0, value.indexOf('px')));
		units = convertFromPixelToAbsolute(number);
	}
	else {
		let number;
		if (value.indexOf('em') > -1) {
			number = value.substring(0, value.indexOf('em'));
		}
		else if (value.indexOf('rem') > -1) {
			number = value.substring(0, value.indexOf('rem'));
		}
		else if (value.indexOf('ex') > -1) {
			number = value.substring(0, value.indexOf('ex'));
		}
		else if (value.indexOf('vmin') > -1) {
			number = value.substring(0, value.indexOf('vmin'));
		}
		number = parseFloat(number);
		units = convertFromEmToAbsolute(number);
	}

	return units;
}

function convertFromPixel(pixels) {

	let units = {
		em: pixels / 16 + " em",
		ex: pixels / 16 + " ex",
		ch: (pixels / 2.54).toFixed(3) + " ch",
		rem: pixels / 16 + " rem",
		vh: pixels / 100 + " vh",
		vmin: pixels / 16 + " vmin",
		vmax: pixels / 2 + " vmax",
		percent: pixels / 100 + " %"
	}

	return units;
}

function convertFromRemOrEm(em) {

	let units = {
		px: "absolute " + em * 16 + " px",
		em: em + " em",
		ex: em + " ex",
		ch: (em * 16) / 2.54 + " ch",
		rem: em + " rem",
		vh: (em * 16) / 100 + " vh",
		vmin: em + " vmin",
		vmax: (em * 16) / 2 + " vmax",
		percent: (em * 16) / 100 + " %"
	}

	return units;
}

function convertFromPixelToAbsolute (pixel) {

	let units = {
		cm: "absolute " + pixel * 0.02 + " cm",
		mm: "absolute " + pixel * 0.26 + " mm",
		in: "absolute " + pixel * 2.54 + " in",
		pt: "absolute " + pixel * 0.03 + " pt",
		pc: "absolute " + pixel * 0.35 + " pc",
	}

	return units;
}

function convertFromEmToAbsolute (em) {

	let pixel = em * 16;
	let units = convertFromPixelToAbsolute(pixel);
	return units;

}

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
