
export type ImageFileType = `${string}.png` | `${string}.png` | `${string}.gif` | `${string}.jpg` | `${string}.jpeg`;

export type HtmlFileType = `${string}.html`;

export type JsFileType = `${string}.js`;

export interface Config extends chrome.runtime.ManifestV3 {
	dir: string;
	name: string;
	action: chrome.runtime.ManifestV3["action"] & {
		dir: string;
		entrypoint: JsFileType;
		default_icons?: {
			"16"?: ImageFileType;
			"32"?: ImageFileType;
			"64"?: ImageFileType;
			"48"?: ImageFileType;
			"128"?: ImageFileType;
		},
		default_title: string;
		default_popup: HtmlFileType;
	},
	background: {
		service_worker: JsFileType;
	},
	icons?: chrome.runtime.ManifestV3["icons"] & {
		"16"?: ImageFileType;
		"32"?: ImageFileType;
		"64"?: ImageFileType;
		"48"?: ImageFileType;
		"128"?: ImageFileType;
	},
}



