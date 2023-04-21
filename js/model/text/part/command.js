import*as Utils from"../../../utils.js";import*as Unicode from"../../../unicode.js";import*as Part from"./instance.js";import{Type}from"./type.js";import{Status}from"./status.js";import{Style}from"./style.js";export var Brace;!function(e){e.OPEN="⸨",e.CLOSE="⸩"}(Brace||(Brace={}));export var Known_Value;!function(e){e.CENTER="⸨cen⸩",e.INDENT="⸨in⸩",e.OPEN_ITALIC="⸨i⸩",e.CLOSE_ITALIC="⸨/i⸩",e.OPEN_BOLD="⸨b⸩",e.CLOSE_BOLD="⸨/b⸩",e.OPEN_UNDERLINE="⸨u⸩",e.CLOSE_UNDERLINE="⸨/u⸩",e.OPEN_SMALL_CAPS="⸨sc⸩",e.CLOSE_SMALL_CAPS="⸨/sc⸩",e.OPEN_ERROR="⸨err⸩",e.CLOSE_ERROR="⸨/err⸩"}(Known_Value||(Known_Value={}));export function Is_Valid_Value(e){const n=e.replace(/^⸨\/?/,"").replace(/⸩$/,"");return e.length>2&&"⸨"===e[0]&&"⸩"===e[e.length-1]&&n.length>0&&!/⸨/.test(n)&&!/\//.test(n)&&!/\s/.test(n)&&!/⸩/.test(n)}export function Is_Known_Value(e){return e===Known_Value.CENTER||e===Known_Value.INDENT||e===Known_Value.OPEN_ITALIC||e===Known_Value.CLOSE_ITALIC||e===Known_Value.OPEN_BOLD||e===Known_Value.CLOSE_BOLD||e===Known_Value.OPEN_UNDERLINE||e===Known_Value.CLOSE_UNDERLINE||e===Known_Value.OPEN_SMALL_CAPS||e===Known_Value.CLOSE_SMALL_CAPS||e===Known_Value.OPEN_ERROR||e===Known_Value.CLOSE_ERROR}export function Valid_Value_From(e){const n=e.match(/^⸨\/?[^⸨\/⸩]+⸩/);return null!=n?n[0]:null}export function Maybe_Valid_Value_From(e){const n=e.match(/^⸨[^⸩]*⸩/);return null!=n?n[0]:null}export function Last_Non_Value_Index(e){if(e.length>0){const n=e.match(/(⸨[^⸩]*⸩)*$/);if(null!=n&&n[0].length>0){const t=new Unicode.Iterator({text:e,index:e.length-n[0].length});return t.Is_At_Start()?null:t.Previous().Index()}return new Unicode.Iterator({text:e,index:e.length}).Previous().Index()}return null}export class Instance extends Part.Instance{constructor({index:e,value:n}){super({part_type:Type.COMMAND,index:e,value:n,status:Is_Known_Value(n)?Status.GOOD:Is_Valid_Value(n)?Status.UNKNOWN:Status.ERROR,style:Style._NONE_}),Utils.Assert(n.length>=2,"A command must have a length of at least 2.")}Is_Center(){return this.Value()===Known_Value.CENTER}Is_Indent(){return this.Value()===Known_Value.INDENT}Is_Opening(){return"/"!==this.Value()[1]}Is_Closing(){return"/"===this.Value()[1]}Is_Open_Italic(){return this.Value()===Known_Value.OPEN_ITALIC}Is_Close_Italic(){return this.Value()===Known_Value.CLOSE_ITALIC}Is_Open_Bold(){return this.Value()===Known_Value.OPEN_BOLD}Is_Close_Bold(){return this.Value()===Known_Value.CLOSE_BOLD}Is_Open_Underline(){return this.Value()===Known_Value.OPEN_UNDERLINE}Is_Close_Underline(){return this.Value()===Known_Value.CLOSE_UNDERLINE}Is_Open_Small_Caps(){return this.Value()===Known_Value.OPEN_SMALL_CAPS}Is_Close_Small_Caps(){return this.Value()===Known_Value.CLOSE_SMALL_CAPS}Is_Open_Error(){return this.Value()===Known_Value.OPEN_ERROR}Is_Close_Error(){return this.Value()===Known_Value.CLOSE_ERROR}}