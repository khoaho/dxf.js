/*
 * AutoCAD DXF Javascript Library
 * http://khoaho.github.com/dxf.js/
 *
 * Copyright (c) 2012 by Khoa Ho
 * Licensed under MIT license
 * Version: 1.0.0
 */
var DxfWriter = Class({
	constructor: function () {
		this.ReservedHandles = 10;
		this.ActiveSection = DwwStringCode.Unknown;
		this.ActiveTable = DwwStringCode.Unknown;
		this.IsFileOpened = false;
		this.IsHeader = false;
		this.IsClassSection = false;
		this.IsTableSection = false;
		this.IsBlockDefinition = false;
		this.IsBlockEntity = false;
		this.IsEntitySection = false;
		this.IsObjectSection = false;
		this.Output = null;
		this.Write = null;
		this.Version = null;
	},

	// Methods
	//#region Public methods
	Open: function () {

	},

	Close: function () {

	},

	BeginSection: function () {

	},

	EndSection: function () {
		if (this.ActiveSection === DwwStringCode.Unknown) {
			throw "";
		}
		this.WriteCodePair(0, DwwStringCode.EndSection);
		switch (this.ActiveSection) {
			case DwwStringCode.HeaderSection:
				this.IsEntitySection = false;
				break;
			case DwwStringCode.ClassSection:
				this.IsEntitySection = false;
				break;
			case DwwStringCode.TableSection:
				this.IsTableSection = false;
				break;
			case DwwStringCode.BlockSection:
				this.IsBlockDefinition = true;
				break;
			case DwwStringCode.EntitySection:
				this.IsEntitySection = false;
				break;
			case DwwStringCode.ObjectSection:
				this.IsEntitySection = false;
				break;
			default:
		}
		this.ActiveSection = DwwStringCode.Unknown;
	},

	BeginTable: function (table) {
		if (!this.IsFileOpened) {
			throw "";
		}
		if (this.ActiveTable !== DwwStringCode.Unknown) {
			throw "";
		}
		this.WriteCodePair(0, DwwStringCode.Table);
		this.WriteCodePair(2, table);
		this.WriteCodePair(5, this.ReservedHandles++);
		this.WriteCodePair(100, DwwSubclassMarker.Table);

		if (table === DwwStringCode.DimensionStyleTable)
			this.WriteCodePair(100, DwwSubclassMarker.DimensionStyleTable);
		this.ActiveTable = table;
	},

	EndTable: function () {
		if (this.ActiveTable === DwwStringCode.Unknown) {
			throw "";
		}
		this.WriteCodePair(0, DwwStringCode.EndTable);
		this.ActiveTable = DwwStringCode.Unknown;
	},
	//#endregion

	//#region Header section
	WriteComment: function (comment) {
		if (comment) {
			this.WriteCodePair(999, comment);
		}
	},

	WriteSystemVariable: function (headerVariable) {
		if (this.ActiveSection !== DwwStringCode.HeaderSection) {
			throw "";
		}
		this.WriteCodePair(headerVariable.NAME_CODE_GROUP, headerVariable.Name);
		this.WriteCodePair(headerVariable.CodeGroup, headerVariable.Value);
	},
	//#endregion

	//#region Table section
	RegisterApplication: function (applicationRegistry) {
		if (this.ActiveTable !== DwwStringCode.ApplicationIDTable) {
			throw "";
		}
		this.WriteCodePair(0, DwwStringCode.ApplicationIDTable);
		this.WriteCodePair(5, applicationRegistry.ID);
		this.WriteCodePair(100, DwwSubclassMarker.TableRecord);

		this.WriteCodePair(100, DwwSubclassMarker.ApplicationId);
		this.WriteCodePair(2, applicationRegistry);
		this.WriteCodePair(70, 0);
	},

	WriteViewport: function (viewport) {
		if (this.ActiveTable !== DwwStringCode.ViewportTable) {
			throw "";
		}
		this.WriteCodePair(0, viewport.CodeName);
		this.WriteCodePair(5, viewport.ID);
		this.WriteCodePair(100, DwwSubclassMarker.TableRecord);

		this.WriteCodePair(100, DwwSubclassMarker.Viewport);
		this.WriteCodePair(2, viewport);
		this.WriteCodePair(70, 0);

		this.WriteCodePair(10, viewport.LowerLeftCorner.X);
		this.WriteCodePair(20, viewport.LowerLeftCorner.Y);

		this.WriteCodePair(11, viewport.UpperRightCorner.X);
		this.WriteCodePair(21, viewport.UpperRightCorner.Y);

		this.WriteCodePair(12, viewport.LowerLeftCorner.X - viewport.UpperRightCorner.X);
		this.WriteCodePair(22, viewport.UpperRightCorner.Y - viewport.LowerLeftCorner.Y);

		this.WriteCodePair(13, viewport.SnapBasePoint.X);
		this.WriteCodePair(23, viewport.SnapBasePoint.Y);

		this.WriteCodePair(14, viewport.SnapSpacing.X);
		this.WriteCodePair(24, viewport.SnapSpacing.Y);

		this.WriteCodePair(15, viewport.GridSpacing.X);
		this.WriteCodePair(25, viewport.GridSpacing.Y);

		var direction = viewport.Camera - viewport.Target;
		this.WriteCodePair(16, direction.X);
		this.WriteCodePair(26, direction.Y);
		this.WriteCodePair(36, direction.Z);

		this.WriteCodePair(17, viewport.Target.X);
		this.WriteCodePair(27, viewport.Target.Y);
		this.WriteCodePair(37, viewport.Target.Z);
	},

	WriteDimensionStyle: function (dimensionStyle) {
		if (this.ActiveTable !== DwwStringCode.DimensionStyleTable) {
			throw "";
		}
		this.WriteCodePair(0, dimensionStyle.CodeName);
		this.WriteCodePair(105, dimensionStyle.ID);
		this.WriteCodePair(100, DwwSubclassMarker.TableRecord);

		this.WriteCodePair(100, DwwSubclassMarker.DimensionStyle);
		this.WriteCodePair(2, dimensionStyle);
		this.WriteCodePair(70, 0); // flag
	},

	WriteBlockRecord: function (blockRecord) {
		if (this.ActiveTable !== DwwStringCode.BlockRecordTable) {
			throw "";
		}
		this.WriteCodePair(0, blockRecord.CodeName);
		this.WriteCodePair(5, blockRecord.ID);
		this.WriteCodePair(100, DwwSubclassMarker.TableRecord);

		this.WriteCodePair(100, DwwSubclassMarker.BlockRecord);
		this.WriteCodePair(2, blockRecord);
	},

	WriteLineType: function (linetype) {
		if (this.Version === DwwAcadVersion.AutoCAD12)
			if (linetype.Name === "ByLayer" || linetype.Name === "ByBlock")
				return;
		if (this.ActiveTable !== DwwStringCode.LineTypeTable) {
			throw "";
		}
		this.WriteCodePair(0, linetype.CodeName);
		this.WriteCodePair(5, linetype.ID);
		this.WriteCodePair(100, DwwSubclassMarker.TableRecord);

		this.WriteCodePair(100, DwwSubclassMarker.LineType);
		this.WriteCodePair(70, 0);
		this.WriteCodePair(2, linetype);
		this.WriteCodePair(3, linetype.Description);
		this.WriteCodePair(72, 65);
		this.WriteCodePair(73, linetype.Segments.length);
		this.WriteCodePair(40, linetype.Length());
		for (var segment in linetype.Segments) {
			this.WriteCodePair(49, segment);
			if (this.Version !== DwwAcadVersion.AutoCAD12) {
				this.WriteCodePair(74, 0);
			}
		}
	},

	WriteLayer: function (layer) {
		if (this.ActiveTable !== DwwStringCode.LayerTable) {
			throw "";
		}
		this.WriteCodePair(0, layer.CodeName);
		this.WriteCodePair(5, layer.ID);
		this.WriteCodePair(100, DwwSubclassMarker.TableRecord);

		this.WriteCodePair(100, DwwSubclassMarker.Layer);
		this.WriteCodePair(70, 0);
		this.WriteCodePair(2, layer);

		// a negative color represents a hidden layer
		if (layer.IsVisible) {
			this.WriteCodePair(62, layer.Color.Index);
		} else {
			this.WriteCodePair(62, -layer.Color.Index);
		}
		this.WriteCodePair(6, layer.Linetype.Name);
		if (this.Version !== DwwAcadVersion.AutoCAD12)
			this.WriteCodePair(390, DwwLayer.PlotStyleHandle);
	},

	WriteTextStyle: function (textStyle) {
		if (this.ActiveTable !== DwwStringCode.TextStyleTable) {
			throw "";
		}
		this.WriteCodePair(0, textStyle.CodeName);
		this.WriteCodePair(5, textStyle.ID);
		this.WriteCodePair(100, DwwSubclassMarker.TableRecord);

		this.WriteCodePair(100, DwwSubclassMarker.TextStyle);
		this.WriteCodePair(2, textStyle);
		this.WriteCodePair(3, textStyle.Font);

		if (textStyle.IsVertical) {
			this.WriteCodePair(70, 4);
		} else {
			this.WriteCodePair(70, 0);
		}

		if (textStyle.IsBackward && textStyle.IsUpsideDown) {
			this.WriteCodePair(71, 6);
		} else if (textStyle.IsBackward) {
			this.WriteCodePair(71, 2);
		} else if (textStyle.IsUpsideDown) {
			this.WriteCodePair(71, 4);
		} else {
			this.WriteCodePair(71, 0);
		}

		this.WriteCodePair(40, textStyle.Height);
		this.WriteCodePair(41, textStyle.WidthFactor);
		this.WriteCodePair(42, textStyle.Height);
		this.WriteCodePair(50, textStyle.ObliqueAngle);
	},
	//#endregion

	//#region Block section
	WriteBlock: function (block, entityObjects) {
		if (this.Version === DwwAcadVersion.AutoCAD12) {
			if (block.Name === "*Model_Space" || block.Name === "*Paper_Space") {
				return;
			}
		}
		if (this.ActiveSection !== DwwStringCode.BlockSection) {
			throw "";
		}
		this.WriteCodePair(0, block.CodeName);
		this.WriteCodePair(5, block.ID);

		this.WriteCodePair(100, DwwSubclassMarker.Entity);
		this.WriteCodePair(8, block.Layer);
		this.WriteCodePair(100, DwwSubclassMarker.BlockBegin);
		this.WriteCodePair(2, block);

		// flags
		if (block.Attributes.length === 0) {
			this.WriteCodePair(70, 0);
		} else {
			this.WriteCodePair(70, 2);
		}
		this.WriteCodePair(10, block.BasePoint.X);
		this.WriteCodePair(20, block.BasePoint.Y);
		this.WriteCodePair(30, block.BasePoint.Z);
		this.WriteCodePair(3, block);

		for (var attributeDefinition in block.Attributes) {
			this.WriteAttributeDefinition(attributeDefinition);
		}

		// block entities, if version is AutoCAD12, we will write the converted entities
		this.IsBlockEntity = true;
		for (var entity in entityObjects) {
			this.WriteEntity(entity);
		}
		this.IsBlockEntity = false;
		this.WriteBlockEnd(block.End);
	},

	WriteBlockEnd: function (blockEnd) {
		this.WriteCodePair(0, blockEnd.CodeName);
		this.WriteCodePair(5, blockEnd.ID);

		this.WriteCodePair(100, DwwSubclassMarker.Entity);
		this.WriteCodePair(8, blockEnd.Layer);
		this.WriteCodePair(100, DwwSubclassMarker.BlockEnd);
	},
	//#endregion

	//#region Entity section
	WriteEntity: function (entityObject) {
		switch (entityObject.Type) {
			case DwwEntityType.Arc:
				this.WriteArc(entityObject);
				break;
			case DwwEntityType.Circle:
				this.WriteCircle(entityObject);
				break;
			case DwwEntityType.Ellipse:
				this.WriteEllipse(entityObject);
				break;
			case DwwEntityType.NurbsCurve:
				this.WriteNurbsCurve(entityObject);
				break;
			case DwwEntityType.Point:
				this.WritePoint(entityObject);
				break;
			case DwwEntityType.Face3d:
				this.WriteFace3d(entityObject);
				break;
			case DwwEntityType.Solid:
				this.WriteSolid(entityObject);
				break;
			case DwwEntityType.Insert:
				this.WriteInsert(entityObject);
				break;
			case DwwEntityType.Line:
				this.WriteLine(entityObject);
				break;
			case DwwEntityType.LightweightPolyline:
				this.WriteLightweightPolyline(entityObject);
				break;
			case DwwEntityType.Polyline:
				this.WritePolyline(entityObject);
				break;
			case DwwEntityType.Polyline3d:
				this.WritePolyline3d(entityObject);
				break;
			case DwwEntityType.PolyfaceMesh:
				this.WritePolyfaceMesh(entityObject);
				break;
			case DwwEntityType.Text:
				this.WriteText(entityObject);
				break;
			default:
				throw "";
		}
	},

	WriteArc: function (arc) {
		if (this.ActiveSection !== DwwStringCode.EntitySection && !this.IsBlockEntity) {
			throw "";
		}
		this.WriteCodePair(0, arc.CodeName);
		this.WriteCodePair(5, arc.ID);
		this.WriteCodePair(100, DwwSubclassMarker.Entity);
		this.WriteEntityCommonCodes(arc);
		this.WriteCodePair(100, DwwSubclassMarker.Circle);

		this.WriteCodePair(39, arc.Thickness);
		this.WriteCodePair(10, arc.Center.X);
		this.WriteCodePair(20, arc.Center.Y);
		this.WriteCodePair(30, arc.Center.Z);
		this.WriteCodePair(40, arc.Radius);
		this.WriteCodePair(210, arc.Normal.X);
		this.WriteCodePair(220, arc.Normal.Y);
		this.WriteCodePair(230, arc.Normal.Z);

		this.WriteCodePair(100, DwwSubclassMarker.Arc);
		this.WriteCodePair(50, arc.StartAngle);
		this.WriteCodePair(51, arc.EndAngle);

		this.WriteXData(arc.XData);
	},

	WriteCircle: function (circle) {
		if (this.ActiveSection !== DwwStringCode.EntitySection && !this.IsBlockEntity) {
			throw "";
		}
		this.WriteCodePair(0, circle.CodeName);
		this.WriteCodePair(5, circle.ID);
		this.WriteCodePair(100, DwwSubclassMarker.Entity);
		this.WriteEntityCommonCodes(circle);
		this.WriteCodePair(100, DwwSubclassMarker.Circle);

		this.WriteCodePair(39, circle.Thickness);
		this.WriteCodePair(10, circle.Center.X);
		this.WriteCodePair(20, circle.Center.Y);
		this.WriteCodePair(30, circle.Center.Z);
		this.WriteCodePair(40, circle.Radius);
		this.WriteCodePair(210, circle.Normal.X);
		this.WriteCodePair(220, circle.Normal.Y);
		this.WriteCodePair(230, circle.Normal.Z);

		this.WriteXData(circle.XData);
	},

	WriteEllipse: function (ellipse) {
		if (this.ActiveSection !== DwwStringCode.EntitySection && !this.IsBlockEntity) {
			throw "";
		}
		if (this.Version === DwwAcadVersion.AutoCAD12) {
			this.WriteEllipseAsPolyline(ellipse);
			return;
		}
		this.WriteCodePair(0, ellipse.CodeName);
		this.WriteCodePair(5, ellipse.ID);
		this.WriteCodePair(100, DwwSubclassMarker.Entity);
		this.WriteEntityCommonCodes(ellipse);
		this.WriteCodePair(100, DwwSubclassMarker.Ellipse);

		this.WriteCodePair(10, ellipse.Center.X);
		this.WriteCodePair(20, ellipse.Center.Y);
		this.WriteCodePair(30, ellipse.Center.Z);

		var sin = 0.5 * ellipse.MajorAxis * Math.sin(ellipse.Rotation * DwwMath.DegreeToRadian);
		var cos = 0.5 * ellipse.MajorAxis * Math.cos(ellipse.Rotation * DwwMath.DegreeToRadian);
		var axisPoint = null; // MathHelper.Transform()

		this.WriteCodePair(11, axisPoint.X);
		this.WriteCodePair(21, axisPoint.Y);
		this.WriteCodePair(31, axisPoint.Z);

		this.WriteCodePair(210, ellipse.Normal.X);
		this.WriteCodePair(220, ellipse.Normal.Y);
		this.WriteCodePair(230, ellipse.Normal.Z);

		this.WriteCodePair(40, ellipse.MinorAxis / ellipse.MajorAxis);
		this.WriteCodePair(41, ellipse.StartAngle * DwwMath.DegreeToRadian);
		this.WriteCodePair(42, ellipse.EndAngle * DwwMath.DegreeToRadian);

		this.WriteXData(ellipse.XData);
	},

	WriteEllipseAsPolyline: function (ellipse) {
		// draw the ellipse as a polyline, as it is not supported in AutoCAD 12 dxf files
		this.WriteCodePair(0, DwwObjectCode.Polyline);
		this.WriteEntityCommonCodes(ellipse);

		// close polyline
		this.WriteCodePair(70, 1);

		// dummy points
		this.WriteCodePair(10, 0.0);
		this.WriteCodePair(20, 0.0);
		this.WriteCodePair(30, ellipse.Center.Z);

		this.WriteCodePair(39, ellipse.Thickness);

		this.WriteCodePair(210, ellipse.Normal.X);
		this.WriteCodePair(220, ellipse.Normal.Y);
		this.WriteCodePair(230, ellipse.Normal.Z);

		//Obsolete; formerly an “entities follow flag” (optional; ignore if present)
		//but its needed to load the dxf file in AutoCAD
		this.WriteCodePair(66, "1");

		this.WriteXData(ellipse.XData);
	},

	WriteNurbsCurve: function (nurbsCurve) {

	},

	WriteSolid: function (solid) {

	},

	WriteFace3d: function (face) {

	},

	WriteInsert: function (insert) {

	},

	WriteLine: function (line) {

	},

	WriteRectangle: function (rectangle) {

	},

	WritePolyline: function (polyline) {

	},

	WriteLightweightPolyline: function (polyline) {

	},

	WritePolyline3d: function (polyline) {

	},

	WritePolyfaceMesh: function (mesh) {

	},

	WritePoint: function (point) {

	},

	WriteText: function (text) {

	},
	//#endregion

	//#region Entity section
	WriteDictionary: function (dictionary) {

	},

	WriteAttributeDefinition: function (attribute) {

	},

	WriteAttributeReference: function (attribute, insertionPoint) {

	},

	WriteXData: function (xData) {

	},

	WriteEntityCommonCodes: function (entity) {

	},

	WriteCodePair: function (code, value) {

	}
	//#endregion

});

var HeaderVariable = Class({
	constructor: function () {
		this.NAME_CODE_GROUP = 9;
		this.Name = "";
		this.CodeGroup = "";
		this.Value = "";
	}
});