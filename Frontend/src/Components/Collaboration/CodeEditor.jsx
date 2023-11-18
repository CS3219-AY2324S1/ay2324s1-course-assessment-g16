import "./CodeEditor.css";
import Editor from "@monaco-editor/react";
import React, {useState, useEffect} from "react";
import {getUserId} from "../../User/UserState";

const CodeEditor = ({
	code,
	setCode,
	language,
	setLanguage,
	isReadOnly,
	socket,
}) => {
	const OriginalResizeObserver = window.ResizeObserver;

	const [originalCode, setOriginalCode] = useState(code);
	const [originalLanguage, setOriginalLanguage] = useState(language);
	const [shouldEmit, setShouldEmit] = useState(false);

	useEffect(() => {
		if (shouldEmit) {
			socket.emit("update-code", code);
			setOriginalCode(code);
			setShouldEmit(false);
		}
	}, [code]);

	// Monaco Editor Resize Fix (https://github.com/microsoft/vscode/issues/183324#issuecomment-1575484617)
	window.ResizeObserver = function (callback) {
		const wrappedCallback = (entries, observer) => {
			window.requestAnimationFrame(() => {
				callback(entries, observer);
			});
		};

		return new OriginalResizeObserver(wrappedCallback);
	};

	for (let staticMethod in OriginalResizeObserver) {
		if (OriginalResizeObserver.hasOwnProperty(staticMethod)) {
			window.ResizeObserver[staticMethod] =
				OriginalResizeObserver[staticMethod];
		}
	}

	const toCode = (collabInput) => {
		collabInput.sort((a, b) => {
			return a.line - b.line;
		});
		return collabInput.map((item) => item.code).join("\n");
	};

	const toCollabInput = (code) => {
		return code.split("\n").map((line, index) => {
			//if a new line is being added
			if (index >= originalCode.length) {
				setShouldEmit(true);
				return {line: index + 1, code: line, lastModifier: getUserId()};
			} else {
				//if the code on an existing line number is changed
				if (line != originalCode[index].code) {
					setShouldEmit(true);
					return {line: index + 1, code: line, lastModifier: getUserId()};
				} else {
					return {
						line: index + 1,
						code: line,
						lastModifier: originalCode[index].lastModifier,
					};
				}
			}
		});
	};

	const handleChange = (value, e) => {
		setCode(toCollabInput(value));
	};

	const handleLanguageChange = (e) => {
		let value = e.target.value;
		setLanguage(value);
		if (value !== originalLanguage) {
			socket.emit("update-language", value);
			setOriginalLanguage(value);
		}
	};

	return (
		<div className="code-editor">
			<div className="language-dropdown-div">
				<div>Language: </div>
				<select
					value={language.toLowerCase()}
					onChange={handleLanguageChange}
					className="language-dropdown"
				>
					<option value="python">Python</option>
					<option value="cpp">C++</option>
					<option value="java">Java</option>
					<option value="javascript">Javascript</option>
					<option value="sql">SQL</option>
				</select>
			</div>
			<Editor
				language={language.toLowerCase()}
				theme="vs-light"
				value={toCode(code)}
				onChange={handleChange}
				options={{
					inlineSuggest: true,
					fontSize: "16px",
					formatOnType: true,
					minimap: {enabled: false},
					readOnly: isReadOnly,
				}}
			/>
		</div>
	);
};

export default CodeEditor;
