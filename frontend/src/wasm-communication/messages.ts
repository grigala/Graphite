/* eslint-disable max-classes-per-file */

import { z } from "zod";

import { ICON_LIST, type IconName, iconSizes } from "@/utility-functions/icons";
import { getWasmInstance } from "@/wasm-communication/editor";

import type MenuList from "@/components/floating-menus/MenuList.vue";

// ============================================================================
// Add additional classes below to replicate Rust's `FrontendMessage`s and data structures.
//
// Remember to add each message to the `messageConstructors` export at the bottom of the file.
//
// Read class-transformer docs at https://github.com/typestack/class-transformer#table-of-contents
// for details about how to transform the JSON from wasm-bindgen into classes.
// ============================================================================

export const UpdateNodeGraphVisibility = z.object({
	visible: z.boolean(),
});

export const DocumentDetails = z.object({
	name: z.string(),
	isSaved: z.boolean(),
});

export const FrontendDocumentDetails = z
	.object({
		id: z.bigint(),
	})
	.merge(DocumentDetails);

export const UpdateOpenDocumentsList = z.object({
	openDocuments: FrontendDocumentDetails.array(),
});
export const IndexedDbDocumentDetails = z
	.object({
		id: z.bigint().transform((val) => val.toString()),
	})
	.merge(DocumentDetails);

export const TriggerIndexedDbWriteDocument = z.object({
	document: z.string(),
	details: IndexedDbDocumentDetails,
	version: z.string(),
});

export const TriggerIndexedDbRemoveDocument = z.object({
	// Use a string since IndexedDB can not use BigInts for keys
	documentId: z.bigint().transform((val) => val.toString()),
});

// Rust enum `Key`
export const KeyRaw = z.string();
// Serde converts a Rust `Key` enum variant into this format (via a custom serializer) with both the `Key` variant name (called `RawKey` in TS) and the localized `label` for the key
export const Key = z.object({ key: KeyRaw, label: z.string() });
export const KeysGroup = Key.array();
export const ActionKeys = z.object({ keys: KeysGroup });

export const MouseMotion = z.string();

export const HintInfo = z.object({
	keyGroups: KeysGroup.array(),
	keyGroupsMac: z.optional(KeysGroup.array()),
	mouse: MouseMotion.optional(),
	label: z.string(),
	plus: z.boolean(),
});

export const HintGroup = HintInfo.array();

export const HintData = HintGroup.array();

export const UpdateInputHints = z.object({
	hintData: HintData,
});

export const RGBA = z.object({
	r: z.number(),
	g: z.number(),
	b: z.number(),
	a: z.number(),
});

export const HSVA = z.object({
	h: z.number(),
	s: z.number(),
	v: z.number(),
	a: z.number(),
});

const To255Scale = z.number().transform((val) => val * 255);

export const Color = z.object({
	red: To255Scale,
	green: To255Scale,
	blue: To255Scale,
	alpha: z.number(),
});

export function colorToRgba(color: z.infer<typeof Color>): z.infer<typeof RGBA> {
	return { r: color.red, g: color.green, b: color.blue, a: color.alpha };
}

export function colorToRgbaCSS(color: z.infer<typeof Color>): string {
	const { r, g, b, a } = colorToRgba(color);
	return `rgba(${r}, ${g}, ${b}, ${a})`;
}

export const UpdateActiveDocument = z.object({
	documentId: z.bigint(),
});

export const DisplayDialogPanic = z.object({
	panicInfo: z.string(),
	header: z.string(),
	description: z.string(),
});

const iconNameParser = z.enum(Object.keys(ICON_LIST) as [IconName]);

export const DisplayDialog = z.object({
	icon: iconNameParser,
});

export const UpdateDocumentArtwork = z.object({
	svg: z.string(),
});

export const UpdateDocumentOverlays = z.object({
	svg: z.string(),
});

export const UpdateDocumentArtboards = z.object({
	svg: z.string(),
});

const TupleToVec2 = z.tuple([z.number(), z.number()]).transform(([x, y]) => ({ x, y }));
const BigIntTupleToVec2 = z.tuple([z.bigint(), z.bigint()]).transform(([x, y]) => ({ x: Number(x), y: Number(y) }));

export type XY = { x: number; y: number };

export const UpdateDocumentScrollbars = z.object({
	position: TupleToVec2,
	size: TupleToVec2,
	multiplier: TupleToVec2,
});

export const UpdateDocumentRulers = z.object({
	origin: TupleToVec2,
	spacing: z.number(),
	interval: z.number(),
});

export const UpdateEyedropperSamplingState = z.object({
	mousePosition: TupleToVec2.optional(),

	primaryColor: z.string(),

	secondaryColor: z.string(),

	setColorChoice: z.enum(["Primary", "Secondary"]).optional(),
});

const mouseCursorIconCSSNames = {
	Default: "default",
	None: "none",
	ZoomIn: "zoom-in",
	ZoomOut: "zoom-out",
	Grabbing: "grabbing",
	Crosshair: "crosshair",
	Text: "text",
	Move: "move",
	NSResize: "ns-resize",
	EWResize: "ew-resize",
	NESWResize: "nesw-resize",
	NWSEResize: "nwse-resize",
} as const;
export type MouseCursor = keyof typeof mouseCursorIconCSSNames;
export type MouseCursorIcon = typeof mouseCursorIconCSSNames[MouseCursor];

export const UpdateMouseCursor = z.object({
	cursor: z.enum(Object.keys(mouseCursorIconCSSNames) as [MouseCursor]),
});

export const TriggerFileDownload = z.object({
	document: z.string(),
	name: z.string(),
});

export const TriggerLoadAutoSaveDocuments = z.object({});

export const TriggerLoadPreferences = z.object({});

export const TriggerOpenDocument = z.object({});

export const TriggerImport = z.object({});

export const TriggerPaste = z.object({});

export const TriggerRasterDownload = z.object({
	svg: z.string(),
	name: z.string(),
	mime: z.string(),
	size: TupleToVec2,
});

export const TriggerImaginateCheckServerStatus = z.object({
	hostname: z.string(),
});

export const ImaginateBaseImage = z.object({
	svg: z.string(),
	size: z.tuple([z.number(), z.number()]),
});

export const ImaginateGenerationParameters = z.object({
	seed: z.number(),
	samples: z.number(),
	samplingMethod: z.string(),
	denoisingStrength: z.number().optional(),
	cfgScale: z.number(),
	prompt: z.string(),
	negativePrompt: z.string(),
	resolution: BigIntTupleToVec2,
	restoreFaces: z.boolean(),
	tiling: z.boolean(),
});

export const TriggerImaginateGenerate = z.object({
	parameters: ImaginateGenerationParameters,
	baseImage: ImaginateBaseImage.optional(),
	hostname: z.string(),
	refreshFrequency: z.number(),
	documentId: z.bigint(),
	layerPath: z.any().transform((val) => val as BigUint64Array),
});

export const TriggerImaginateTerminate = z.object({
	documentId: z.bigint(),
	layerPath: z.any().transform((val) => val as BigUint64Array),
	hostname: z.string(),
});

export const TriggerRefreshBoundsOfViewports = z.object({});

export const TriggerRevokeBlobUrl = z.object({
	url: z.string(),
});

export const TriggerSavePreferences = z.object({
	preferences: z.record(z.unknown()),
});

export const DocumentChanged = z.object({});

type UpdateDocumentLayerTreeStructureReturn = {
	layerId: bigint;
	children: UpdateDocumentLayerTreeStructureReturn[];
};

const DataBuffer = z.object({
	pointer: z.bigint(),
	length: z.bigint(),
});

export const UpdateDocumentLayerTreeStructure = z.object({ dataBuffer: DataBuffer }).transform((value) => newUpdateDocumentLayerTreeStructure(value));

export function newUpdateDocumentLayerTreeStructure(input: { dataBuffer: z.infer<typeof DataBuffer> }): UpdateDocumentLayerTreeStructureReturn {
	const pointerNum = Number(input.dataBuffer.pointer);
	const lengthNum = Number(input.dataBuffer.length);

	// TODO: Fix hacky way that this message works
	const wasm = getWasmInstance();
	const wasmMemoryBuffer = wasm.wasmMemory().buffer;

	// Decode the folder structure encoding
	const encoding = new DataView(wasmMemoryBuffer, pointerNum, lengthNum);

	// The structure section indicates how to read through the upcoming layer list and assign depths to each layer
	const structureSectionLength = Number(encoding.getBigUint64(0, true));
	const structureSectionMsbSigned = new DataView(wasmMemoryBuffer, pointerNum + 8, structureSectionLength * 8);

	// The layer IDs section lists each layer ID sequentially in the tree, as it will show up in the panel
	const layerIdsSection = new DataView(wasmMemoryBuffer, pointerNum + 8 + structureSectionLength * 8);

	let layersEncountered = 0;
	let currentFolder: z.infer<typeof UpdateDocumentLayerTreeStructure> = { layerId: BigInt(-1), children: [] };
	const currentFolderStack = [currentFolder];

	for (let i = 0; i < structureSectionLength; i += 1) {
		const msbSigned = structureSectionMsbSigned.getBigUint64(i * 8, true);
		const msbMask = BigInt(1) << BigInt(64 - 1);

		// Set the MSB to 0 to clear the sign and then read the number as usual
		const numberOfLayersAtThisDepth = msbSigned & ~msbMask;

		// Store child folders in the current folder (until we are interrupted by an indent)
		for (let j = 0; j < numberOfLayersAtThisDepth; j += 1) {
			const layerId = layerIdsSection.getBigUint64(layersEncountered * 8, true);
			layersEncountered += 1;

			const childLayer: z.infer<typeof UpdateDocumentLayerTreeStructure> = { layerId, children: [] };
			currentFolder.children.push(childLayer);
		}

		// Check the sign of the MSB, where a 1 is a negative (outward) indent
		const subsequentDirectionOfDepthChange = (msbSigned & msbMask) === BigInt(0);
		// Inward
		if (subsequentDirectionOfDepthChange) {
			currentFolderStack.push(currentFolder);
			currentFolder = currentFolder.children[currentFolder.children.length - 1];
		}
		// Outward
		else {
			const popped = currentFolderStack.pop();
			if (!popped) throw Error("Too many negative indents in the folder structure");
			if (popped) currentFolder = popped;
		}
	}

	return currentFolder;
}

export const DisplayEditableTextbox = z.object({
	text: z.string(),
	lineWidth: z.number().optional(),
	fontSize: z.number(),
	color: Color,
});

export const ImaginateImageData = z.object({
	path: z.any().transform((val) => val as BigUint64Array),
	mime: z.string(),
	imageData: z.any().transform((val) => val as Uint8Array),
});

export const UpdateImageData = z.object({
	documentId: z.bigint(),
	imageData: ImaginateImageData.array(),
});

export const DisplayRemoveEditableTextbox = z.object({});

const emptyStringUndefined = z.string().transform((value) => (value === "" ? undefined : value));

export const LayerType = z.enum(["Imaginate", "Folder", "Image", "Shape", "Text"]);

export const LayerMetadata = z.object({
	expanded: z.boolean(),
	selected: z.boolean(),
});

export const LayerPanelEntry = z.object({
	name: z.string(),
	tooltip: emptyStringUndefined,
	visible: z.boolean(),
	layerType: LayerType,
	path: z
		.bigint()
		.array()
		.transform((arr) => new BigUint64Array(arr)),
	layerMetadata: LayerMetadata,
	thumbnail: z.string(),
});

export const UpdateDocumentLayerDetails = z.object({
	data: LayerPanelEntry,
});

export type LayerTypeData = {
	name: string;
	icon: IconName;
};

export function layerTypeData(layerType: z.infer<typeof LayerType>): LayerTypeData | undefined {
	const entries: Record<string, LayerTypeData> = {
		Imaginate: { name: "Imaginate", icon: "NodeImaginate" },
		Folder: { name: "Folder", icon: "NodeFolder" },
		Image: { name: "Image", icon: "NodeImage" },
		Shape: { name: "Shape", icon: "NodeShape" },
		Text: { name: "Text", icon: "NodeText" },
	};

	return entries[layerType];
}

export const DisplayDialogDismiss = z.object({});

export const Font = z.object({
	fontFamily: z.string(),
	fontStyle: z.string(),
});

export const TriggerFontLoad = z.object({
	font: Font,
	isDefault: z.boolean(),
});

export const TriggerVisitLink = z.object({
	url: z.string(),
});

export const TriggerTextCommit = z.object({});

export const TriggerTextCopy = z.object({
	copyText: z.string(),
});

export const TriggerAboutGraphiteLocalizedCommitDate = z.object({
	commitDate: z.string(),
});

export const TriggerViewportResize = z.object({});

const CheckboxInput = z.object({
	checked: z.boolean(),
	// type does not exist but will get runtime error. This is because union to tuple is not a valid conversion
	icon: z.enum(Object.keys(ICON_LIST) as [string]),
	tooltip: emptyStringUndefined,
	kind: z.literal("CheckboxInput"),
});

export const ColorInput = z.object({
	value: z.string().optional(),
	label: z.string().optional(),
	noTransparency: z.boolean(),
	disabled: z.boolean(),
	tooltip: emptyStringUndefined,
	kind: z.literal("ColorInput"),
});

const MenuEntryCommon = z.object({
	label: z.string(),
	icon: iconNameParser.optional(),
	shortcut: ActionKeys.optional(),
});

export type MenuBarEntry = z.infer<typeof MenuEntryCommon> & {
	action: z.infer<typeof Widget>;
	children: MenuBarEntry[][];
};

// An entry in the all-encompassing MenuList component which defines all types of menus ranging from `MenuBarInput` to `DropdownInput` widgets
export type MenuListEntry = {
	action?: () => void;
	children?: MenuListEntry[][];

	label: string;
	shortcutRequiresLock?: boolean;
	value?: string;
	disabled?: boolean;
	tooltip?: string;
	font?: URL;
	ref?: InstanceType<typeof MenuList>;
};

export const MenuListEntry: z.ZodType<MenuListEntry> = z.lazy(() =>
	z.object({
		action: z.optional(z.function().args().returns(z.void())),
		children: MenuListEntry.array().array(),
		shortcutRequiresLock: z.boolean().optional(),
		value: z.string().optional(),
		label: z.string(),
		disabled: z.boolean().optional(),
		tooltip: z.string().optional(),
		font: z.optional(z.any().transform((val) => val as URL)),
		ref: z.optional(z.any().transform((val) => val as InstanceType<typeof MenuList>)),
	})
);

export const DropdownInput = z.object({
	entries: MenuListEntry.array().array(),
	selectedIndex: z.number().optional(),
	drawIcon: z.boolean(),
	interactive: z.boolean(),
	disabled: z.boolean(),
	tooltip: emptyStringUndefined,
	kind: z.literal("DropdownInput"),
});

export const FontInput = z.object({
	fontFamily: z.string(),
	fontStyle: z.string(),
	isStyle: z.boolean(),
	disabled: z.boolean(),
	tooltip: emptyStringUndefined,
	kind: z.literal("FontInput"),
});

export const IconButton = z.object({
	icon: iconNameParser,
	// TODO: FIXME
	size: z.enum(iconSizes.map((n) => z.literal(n)) as any).optional(),
	active: z.boolean(),
	tooltip: emptyStringUndefined,
	kind: z.literal("IconButton"),
});

export const IconLabel = z.object({
	icon: iconNameParser,
	tooltip: emptyStringUndefined,
	kind: z.literal("IconLabel"),
});

export const IncrementBehavior = z.enum(["Add", "Multiply", "Callback", "None"]);

export const NumberInput = z.object({
	label: z.string().optional(),
	value: z.number().optional(),
	min: z.number().optional(),
	max: z.number().optional(),
	isInteger: z.boolean(),
	displayDecimalPlaces: z.number(),
	unit: z.string(),
	unitIsHiddenWhenEditing: z.boolean(),
	incrementBehavior: IncrementBehavior,
	incrementFactor: z.number(),
	disabled: z.boolean(),
	minWidth: z.number(),
	tooltip: emptyStringUndefined,
	kind: z.literal("NumberInput"),
});

export const OptionalInput = z.object({
	checked: z.boolean(),
	icon: iconNameParser,
	tooltip: emptyStringUndefined,
	kind: z.literal("OptionalInput"),
});

export const PopoverButton = z.object({
	icon: z.string().optional(),
	// Body
	header: z.string(),
	text: z.string(),
	tooltip: emptyStringUndefined,
	kind: z.literal("PopoverButton"),
});

export const RadioEntryData = z.object({
	value: z.string().optional(),
	label: z.string().optional(),
	icon: iconNameParser,
	tooltip: z.string(),
	// Callbacks
	action: z.function().args().returns(z.void()),
});
export const RadioEntries = RadioEntryData.array();

export const RadioInput = z.object({
	entries: RadioEntries,
	selectedIndex: z.number(),
	kind: z.literal("RadioInput"),
});

export const SeparatorDirection = z.enum(["Horizontal", "Vertical"]);
export const SeparatorType = z.enum(["Related", "Unrelated", "Section", "List"]);

export const Separator = z.object({
	direction: SeparatorDirection,
	type: SeparatorType,
	kind: z.literal("Separator"),
});

export const SwatchPairInput = z.object({
	primary: Color,
	secondary: Color,
	kind: z.literal("SwatchPairInput"),
});

export const TextAreaInput = z.object({
	value: z.string(),
	label: z.string().optional(),
	disabled: z.boolean(),
	tooltip: emptyStringUndefined,
	kind: z.literal("TextAreaInput"),
});

export const TextButton = z.object({
	label: z.string(),
	icon: iconNameParser.optional(),
	emphasized: z.boolean(),
	minWidth: z.number(),
	disabled: z.boolean(),
	tooltip: emptyStringUndefined,
	kind: z.literal("TextButton"),
});

export type TextButtonWidget = {
	tooltip?: string;
	message?: string | object;
	callback?: () => void;
	props: {
		kind: "TextButton";
		label: string;
		icon?: string;
		emphasized?: boolean;
		minWidth?: number;
		disabled?: boolean;
		tooltip?: string;

		// Callbacks
		// `action` is used via `IconButtonWidget.callback`
	};
};

export const TextInput = z.object({
	value: z.string(),
	label: z.string().optional(),
	disabled: z.boolean(),
	minWidth: z.number(),
	tooltip: emptyStringUndefined,
	kind: z.literal("TextInput"),
});

const TextLabel = z.object({
	value: z.string(),
	bold: z.boolean(),
	italic: z.boolean(),
	minWidth: z.number(),
	multiline: z.boolean(),
	tableAlign: z.boolean(),
	tooltip: emptyStringUndefined,
	kind: z.literal("TextLabel"),
});

const InvisibleStandinInput = z.object({
	kind: z.literal("InvisibleStandinInput"),
});

export const PivotPosition = z.enum(["None", "TopLeft", "TopCenter", "TopRight", "CenterLeft", "Center", "CenterRight", "BottomLeft", "BottomCenter", "BottomRight"]);

export const PivotAssist = z.object({
	position: PivotPosition,
	kind: z.literal("PivotAssist"),
});

export const Widget = z.object({
	props: z.preprocess((val) => {
		console.log(val);
		return val;
	}, z.discriminatedUnion("kind", [CheckboxInput, ColorInput, FontInput, IconButton, IconLabel, NumberInput, OptionalInput, PopoverButton, RadioInput, Separator, SwatchPairInput, TextAreaInput, TextButton, TextInput, TextLabel, PivotAssist, DropdownInput, InvisibleStandinInput])),

	widgetId: z.bigint(),
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function hoistWidgetHolders(widgetHolders: any[]): z.infer<typeof Widget>[] {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	return widgetHolders.map((widgetHolder: any) => {
		const kind = Object.keys(widgetHolder.widget)[0];
		const props = widgetHolder.widget[kind];
		props.kind = kind;

		const { widgetId } = widgetHolder;

		return Widget.parse({ props, widgetId });
	});
}

// WIDGET LAYOUT

type WidgetLayout = z.infer<typeof WidgetLayout>;
export const WidgetLayout = z.object({
	layoutTarget: z.unknown(),
	layout: z.any().transform((value) => createWidgetLayout(value)),
});

export function defaultWidgetLayout(): WidgetLayout {
	return {
		layoutTarget: undefined,
		layout: [],
	};
}

export type LayoutGroup = WidgetRow | WidgetColumn | WidgetSection;

export type WidgetColumn = { columnWidgets: z.infer<typeof Widget>[] };
export function isWidgetColumn(layoutColumn: LayoutGroup): layoutColumn is WidgetColumn {
	return Boolean((layoutColumn as WidgetColumn).columnWidgets);
}

export type WidgetRow = { rowWidgets: z.infer<typeof Widget>[] };
export function isWidgetRow(layoutRow: LayoutGroup): layoutRow is WidgetRow {
	return Boolean((layoutRow as WidgetRow).rowWidgets);
}

export type WidgetSection = { name: string; layout: LayoutGroup[] };
export function isWidgetSection(layoutRow: LayoutGroup): layoutRow is WidgetSection {
	return Boolean((layoutRow as WidgetSection).layout);
}

// Unpacking rust types to more usable type in the frontend
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function createWidgetLayout(widgetLayout: any[]): LayoutGroup[] {
	return widgetLayout.map((layoutType): LayoutGroup => {
		if (layoutType.column) {
			const columnWidgets = hoistWidgetHolders(layoutType.column.columnWidgets);

			const result: WidgetColumn = { columnWidgets };
			return result;
		}

		if (layoutType.row) {
			const rowWidgets = hoistWidgetHolders(layoutType.row.rowWidgets);

			const result: WidgetRow = { rowWidgets };
			return result;
		}

		if (layoutType.section) {
			const { name } = layoutType.section;
			const layout = createWidgetLayout(layoutType.section.layout);

			const result: WidgetSection = { name, layout };
			return result;
		}

		throw new Error("Layout row type does not exist");
	});
}

export const UpdateMenuBarLayout = z.object({
	layoutTarget: z.unknown(),
	layout: z.any().transform((value) => createMenuLayout(value)),
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function createMenuLayout(menuBarEntry: any[]): MenuBarEntry[] {
	return menuBarEntry.map((entry) => ({
		...entry,
		children: createMenuLayoutRecursive(entry.children),
	}));
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function createMenuLayoutRecursive(children: any[][]): MenuBarEntry[][] {
	return children.map((groups) =>
		groups.map((entry) => ({
			...entry,
			action: hoistWidgetHolders([entry.action])[0],
			children: entry.children ? createMenuLayoutRecursive(entry.children) : undefined,
		}))
	);
}

export const messageMakers = {
	DisplayDialog,
	DisplayDialogDismiss,
	DisplayDialogPanic,
	DisplayEditableTextbox,
	DisplayRemoveEditableTextbox,
	TriggerAboutGraphiteLocalizedCommitDate,
	TriggerImaginateCheckServerStatus,
	TriggerImaginateGenerate,
	TriggerImaginateTerminate,
	TriggerFileDownload,
	TriggerFontLoad,
	TriggerImport,
	TriggerIndexedDbRemoveDocument,
	TriggerIndexedDbWriteDocument,
	TriggerLoadAutoSaveDocuments,
	TriggerLoadPreferences,
	TriggerOpenDocument,
	TriggerPaste,
	TriggerRasterDownload,
	TriggerRefreshBoundsOfViewports,
	TriggerRevokeBlobUrl,
	TriggerSavePreferences,
	TriggerTextCommit,
	TriggerTextCopy,
	TriggerViewportResize,
	TriggerVisitLink,
	UpdateActiveDocument,
	UpdateDialogDetails: WidgetLayout,
	UpdateDocumentArtboards,
	UpdateDocumentArtwork,
	UpdateDocumentBarLayout: WidgetLayout,
	UpdateDocumentLayerDetails,
	UpdateDocumentLayerTreeStructure,
	UpdateDocumentModeLayout: WidgetLayout,
	UpdateDocumentOverlays,
	UpdateDocumentRulers,
	UpdateEyedropperSamplingState,
	UpdateDocumentScrollbars,
	UpdateImageData,
	UpdateInputHints,
	UpdateLayerTreeOptionsLayout: WidgetLayout,
	UpdateMenuBarLayout,
	UpdateMouseCursor,
	UpdateNodeGraphVisibility,
	UpdateOpenDocumentsList,
	UpdatePropertyPanelOptionsLayout: WidgetLayout,
	UpdatePropertyPanelSectionsLayout: WidgetLayout,
	UpdateToolOptionsLayout: WidgetLayout,
	UpdateToolShelfLayout: WidgetLayout,
	UpdateWorkingColorsLayout: WidgetLayout,
} as const;
export type JsMessageType = keyof typeof messageMakers;
