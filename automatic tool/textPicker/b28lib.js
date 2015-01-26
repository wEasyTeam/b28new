exports.b28lib = function () {
	
	function unique(inputs) {
		var res = [];
		var json = {};
		if (!inputs) {
			return [];
		}
		for (var i = 0; i < inputs.length; i++) {
			if (!json[inputs[i]]) {
				res.push(inputs[i]);
				json[inputs[i]] = 1;
			}
		}
		return res;
	}

	return {
		getPageData: function () {
			var nodeValueArray = [];

			function listNode(element) {
				if (!element) {
					return [];
				}

				var firstChild = element.firstChild,
					nextSibling = element.nextSibling,
					nodeType = element.nodeType,
					btnStr = "submit,reset,button",
					curValue, isInputButton;

				//handle element node
				if (nodeType === 1) {
					
					// Hander elements common attribute need to replace
					curValue = element.getAttribute("alt");
					if (curValue && /\S/.test(curValue)) {
						//curValue = curValue.trim();
						nodeValueArray.push(curValue);

					}
					curValue = element.getAttribute("placeholder");
					if (curValue && /\S/.test(curValue)) {
						//curValue = curValue.trim();
						nodeValueArray.push(curValue);

					}
					curValue = element.getAttribute("title");
					if (curValue && /\S/.test(curValue)) {
						//curValue = curValue.trim();
						nodeValueArray.push(curValue);

					}
					
					isInputButton = element.nodeName.toLowerCase() == "input" &&
								(btnStr.indexOf(element.getAttribute("type")) !== -1);
					if (isInputButton) {
						curValue = element.value;
					}
					if (curValue &&	/\S/.test(curValue)) {
						//curValue = curValue.trim();
						nodeValueArray.push(curValue);

					}
				
				//handle textNode
				} else if (nodeType === 3 && /\S/.test(element.nodeValue)) {
					//curValue = element.nodeValue.trim();
					nodeValueArray.push(curValue);

				}
				//translate siblings
				if (nextSibling) {
					listNode(nextSibling);
				}

				//translate firstChild
				if(firstChild) {
					listNode(firstChild);
				}
			}

			this.getNodeValue = function (element) {
				if (!element) {
					return [];
				}
				listNode(element);
				return unique(nodeValueArray);
			};
		},
		getResData: function () {
			var regqutoe = /('|")(((?!\1).)+([^\x00-\xff]+).*)\1/g;

			function matchArr(string) {
				var arr = string.match(regqutoe);
				for (var i in arr) {
					arr[i] = arr[i].replace(/^["']|['"]$/g, '');
				}
				return arr;
			}

			this.getResValue = function (string) {
				return unique(matchArr(string));
			};
		},
		unique: unique
	};
}();