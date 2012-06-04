/*
 * AutoCAD DXF Javascript Library
 * http://khoaho.github.com/dxf.js/
 *
 * Copyright (c) 2012 by Khoa Ho
 * Licensed under MIT license
 * Version: 1.0.0
 */
var DxfReader = Class({
	$statics: {

		ObtainAlignment: function (horizontal, vertical) {
			var alignment = DwwTextAlignment.BaselineLeft;
			if (horizontal == 0 && vertical == 3) {
				alignment = DwwTextAlignment.TopLeft;
			}
			else if (horizontal == 1 && vertical == 3) {
				alignment = DwwTextAlignment.TopCenter;
			}
			else if (horizontal == 2 && vertical == 3) {
				alignment = DwwTextAlignment.TopRight;
			}
			else if (horizontal == 0 && vertical == 2) {
				alignment = DwwTextAlignment.MiddleLeft;
			}
			else if (horizontal == 1 && vertical == 2) {
				alignment = DwwTextAlignment.MiddleCenter;
			}
			else if (horizontal == 2 && vertical == 2) {
				alignment = DwwTextAlignment.MiddleRight;
			}
			else if (horizontal == 0 && vertical == 1) {
				alignment = DwwTextAlignment.BottomLeft;
			}
			else if (horizontal == 1 && vertical == 1) {
				alignment = DwwTextAlignment.BottomCenter;
			}
			else if (horizontal == 2 && vertical == 1) {
				alignment = DwwTextAlignment.BottomRight;
			}
			else if (horizontal == 0 && vertical == 0) {
				alignment = DwwTextAlignment.BaselineLeft;
			}
			if (horizontal == 1 && vertical == 0) {
				alignment = DwwTextAlignment.BaselineCenter;
			}
			else if (horizontal == 2 && vertical == 0) {
				alignment = DwwTextAlignment.BaselineRight;
			}
			return alignment;
		}
	},

	constructor: function () {
		// header
		this.Version = "";
		this.HandleSeed = null;
		this.Comments = "";

		// tables
		this.ApplicationIds = null;
		this.Layers = null;
		this.Linetypes = null;
		this.TextStyles = null;

		// blocks
		this.Blocks = null;

		// entities
		this.Arcs = null;
		this.Circles = null;
		this.Ellipses = null;
		this.Points = null;
		this.Face3ds = null;
		this.Solids = null;
		this.Inserts = null;
		this.Lines = null;
		this.Polylines = null;
		this.Texts = null;
		this.MTexts = null;
	},

	// Methods
	Read: function () {

		var code = this.ReadCodePair();
		while (code.Value !== DwwStringCode.EndOfFile) {
			if (code.Value === DwwStringCode.BeginSection) {
				code = this.ReadCodePair();
				switch (code.Value) {
					case DwwStringCode.HeaderSection:
						this.ReadHeader();
						break;
					case DwwStringCode.ClassSection:
						this.ReadClasses();
						break;
					case DwwStringCode.TableSection:
						this.ReadTables();
						break;
					case DwwStringCode.BlockSection:
						this.ReadBlocks();
						break;
					case DwwStringCode.EntitySection:
						this.ReadEntities();
						break;
					case DwwStringCode.ObjectSection:
						this.ReadObjects();
						break;
					default:
						throw "";
				}
			}
			code = this.ReadCodePair();
		}
	},

	//#region Section methods
	ReadHeader: function () {

	},

	ReadClasses: function () {

	},

	ReadTables: function () {

	},

	ReadApplicationIds: function () {
		var code = this.ReadCodePair();
		while (code.Value !== DwwStringCode.EndTable) {
			if (code.Value === DwwStringCode.ApplicationIDTable) {
				var appId = this.ReadApplicationId(code);
				this.ApplicationIds.push(appId.Name, appId);
			} else {
				code = this.ReadCodePair();
			}
		}
	},

	ReadApplicationId: function (codeValuePair) {
		var appId = "", handle = "";
		codeValuePair = this.ReadCodePair();
		while (codeValuePair.Code !== 0) {
			switch (codeValuePair.Code) {
				case 2:
					if (!codeValuePair.Value)
						throw "";
					appId = codeValuePair.Value;
					break;
				case 5:
					handle = codeValuePair.Value;
					break;
			}
			codeValuePair = this.ReadCodePair();
		}
		var result = new DwwApplicationRegistry(appId);
		result.ID = handle;
		return result;
//		return new ApplicationRegistry(appId) {
//			this.Handle = handle;
//		};
	},

	ReadBlocks: function () {

	},

	ReadBlock: function (codeValuePair) {

	},

	ReadBlockEntity: function (codeValuePair) {

	},

	ReadAttributeDefinition: function (codeValuePair) {

	},

	ReadAttribute: function (block, codeValuePair) {

	},

	ReadEntities: function () {

	},

	ReadObjects: function () {

	},
	//#endregion

	//#region Layer methods
	ReadLayers: function () {

	},

	ReadLayer: function (codeValuePair) {

	},
	//#endregion

	//#region Linetype methods
	ReadLinetypes: function () {

	},

	ReadLinetype: function (codeValuePair) {

	},
	//#endregion

	//#region TextStyle methods
	ReadTextStyles: function () {

	},

	ReadTextStyle: function (codeValuePair) {

	},
	//#endregion

	//#region Entity methods
	ReadArc: function (codeValuePair) {

	},

	ReadCircle: function (codeValuePair) {

	},

	ReadEllipse: function (codeValuePair) {

	},

	ReadPoint: function (codeValuePair) {

	},

	ReadFace3d: function (codeValuePair) {

	},

	ReadSolid: function (codeValuePair) {

	},

	ReadInsert: function (codeValuePair) {

	},

	ReadLine: function (codeValuePair) {

	},

	ReadLineweightPolyline: function (codeValuePair) {

	},

	ReadPolyline: function (codeValuePair) {

	},

	ReadText: function (codeValuePair) {

	},

	ReadVertex: function (codeValuePair) {

	},

	ReadUnknownEntity: function (codeValuePair) {

	},
	//#endregion

	ReadCodePair: function () {

	},

	ReadXDataRecord: function (appId, codeValuePair) {

	},

	GetBlock: function (blockName) {

	},

	GetLayer: function (layerName) {

	},

	GetLinetype: function (linetypeName) {

	},

	GetTextStyle: function (textStyleName) {

	}
});

var CodeValuePair = Class({
	constructor: function (code, value) {
		this.Code = code;
		this.Value = value;
	}
});
