function toJQueryDOMScript(node) {
	function toJQueryDOMScriptHelper(script_lines, node, var_name) {
		script_lines.push("var " + var_name + " = $('<" + node.tagName.toLowerCase() + "/>');");
		for (var i = 0 ; i != node.attributes.length ; ++i) {
			var attribute = node.attributes[i];
			if (attribute.name == "class") {
				script_lines.push(var_name + ".addClass(\"" + attribute.value.replace(/\\/g, '\\\\').replace(/\"/g, '\\"') + "\");");
			}
			else if (attribute.name == "style") {
				var re = /([^ :;]+)\s*:\s*([^ :;]+)/g;
				var m = re.exec(attribute.value);
				while (m !== null) {
					script_lines.push(var_name + ".css(\"" + m[1].replace(/\\/g, '\\\\').replace(/\"/g, '\\"') + "\", \"" + m[2].replace(/\\/g, '\\\\').replace(/\"/g, '\\"') + "\");");
					m = re.exec(attribute.value);
				}
			}
			else {
				script_lines.push(var_name + ".attr(\"" + attribute.name.replace(/\\/g, '\\\\').replace(/\"/g, '\\"') + "\", \"" + attribute.value.replace(/\\/g, '\\\\').replace(/\"/g, '\\"') + "\");");
			}
		}
		if (node.children.length > 0) {
			for (var i = 0 ; i != node.children.length ; ++i) {
				script_lines.push("");
				var child_var_name = var_name + "_" + i;
				toJQueryDOMScriptHelper(script_lines, node.children[i], child_var_name);
				script_lines.push(var_name + ".append(" + child_var_name + ");");
			}
		}
		else if (node.textContent.length > 0) {
			script_lines.push(var_name + ".text(\"" + node.textContent.replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/\"/g, '\\"') + "\");")
		}
	}

	var script_lines = new Array();
	toJQueryDOMScriptHelper(script_lines, node, "$elt");
	var data = new Blob([script_lines.join("\n")], {type: 'application/javascript'});

	var a = document.createElement("a");
	document.body.appendChild(a);
	a.style = "display: none";
	var url = window.URL.createObjectURL(data);
	console.log(url);
	a.href = url;
	a.download = "script.js";
	a.click();
}
