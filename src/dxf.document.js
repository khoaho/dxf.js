/*
 * AutoCAD DXF Javascript Library
 * http://khoaho.github.com/dxf.js/
 *
 * Copyright (c) 2012 by Khoa Ho
 * Licensed under MIT license
 * Version: 1.0.0
 */
var DxfDocument = Class({

	// Methods
	Save:function (fileName, dxfVersion) {
		this.ReassignHandlersAndDefaultObjects();
		this.version = dxfVersion;

		if (this.version == DwwAcadVersion.AutoCAD12) {

		} else {

		}

		var dxfWriter = new DxfWriter(fileName, dxfVersion);
		dxfWriter.Open();

		// Header section

	},

	ReassignHandlersAndDefaultObjects:function () {

	}
});
