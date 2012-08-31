"use strict";

define(
		[	'src/richTextToolbar',
			'src/xmlUtility'
		], function (
			CSLEDIT_richTextToolbar,
			CSLEDIT_xmlUtility
		) {
	var CSLEDIT_RichTextEditor = function (containerElement, onChange) {
		var that = this;

		this.editor = $('<div>')
			.attr('contenteditable', 'true')
			.addClass('editor')
			.css("cursor", "text");

		if (containerElement.css("position") !== "absolute" &&
				containerElement.css("position") !== "relative") {
			console.log("Setting position to relative");
			containerElement.css("position", "relative");
		}
		
		var changed = function () {
			CSLEDIT_richTextToolbar.updateButtonStates();
			if (onChange) {
				onChange(that.value());
			}
		};

		this.editor.append(containerElement.html());
		containerElement.html("");
		containerElement.append(this.editor);
		CSLEDIT_richTextToolbar.attachTo(containerElement, this.editor, changed);

		this.editor.mouseup(changed);
		this.editor.keyup(changed);
		this.editor.bind("drop", changed);

		this.editor.bind("paste", function (e) {
			var clone = that.editor.clone();

			containerElement.css({
				overflow: "hidden",
				height: containerElement.height()
			});
			containerElement.append(clone);
			that.editor.css({
				"position": "absolute",
				"left": "-1000px",
				"width": "500px"
			});

			setTimeout(function () {
				changed();
				clone.remove();
				that.editor.css({
					"position" : "",
					"left" : 0,
					"width" : ""
				});
				containerElement.css({
					overflow: "",
					height: ""
				});
				containerElement.append(that.editor);
			}, 1);
		});
	};

	CSLEDIT_RichTextEditor.prototype.value = function (newValue) {
		if (typeof(newValue) === "undefined") {
			var cleaned = CSLEDIT_xmlUtility.cleanInput(this.editor.html(), true);
			if (cleaned !== this.editor.html()) {
				this.editor.html(cleaned);
			}
			return CSLEDIT_xmlUtility.cleanInput(cleaned);
		} else {
			this.editor.html(CSLEDIT_xmlUtility.cleanInput(newValue));
		}
	};

	return CSLEDIT_RichTextEditor;
});
