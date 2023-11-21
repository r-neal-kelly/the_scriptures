import*as Utils from"../../../utils.js";import*as Unicode from"../../../unicode.js";import*as Language from"../../language.js";import*as Part from"./instance.js";import{Type}from"./type.js";import{Status}from"./status.js";import{Style}from"./style.js";export var Symbol;!function(e){e.FIRST="⸨",e.LAST="⸩",e.CLOSE="/",e.DIVIDER=":"}(Symbol||(Symbol={}));export function Is_Symbol(e){return e===Symbol.FIRST||e===Symbol.LAST||e===Symbol.CLOSE||e===Symbol.DIVIDER}export var Parameter;!function(e){e.ERROR="err",e.LANGUAGE="lang",e.IMAGE="img",e.INLINE_IMAGE="inl-img"}(Parameter||(Parameter={}));export function Is_Known_Parameter(e){return e===Parameter.ERROR||e===Parameter.LANGUAGE||e===Parameter.IMAGE||e===Parameter.INLINE_IMAGE}export function Is_Known_Open_Parameter(e){return e.length>2&&e[0]===Symbol.FIRST&&e[e.length-1]===Symbol.DIVIDER&&Is_Known_Parameter(e.slice(1,e.length-1))}export function Is_Known_Close_Parameter(e){return e===Symbol.LAST}export var Known_Value;!function(e){e.COLUMN="⸨col⸩",e.ROW="⸨row⸩",e.MARGIN="⸨marg⸩",e.INTERLINEAR="⸨intl⸩",e.REVERSE_INTERLINEAR="⸨rev-intl⸩",e.CENTER="⸨cen⸩",e.INDENT="⸨in⸩",e.PAD="⸨pad⸩",e.OPEN_ITALIC="⸨i⸩",e.CLOSE_ITALIC="⸨/i⸩",e.OPEN_BOLD="⸨b⸩",e.CLOSE_BOLD="⸨/b⸩",e.OPEN_UNDERLINE="⸨u⸩",e.CLOSE_UNDERLINE="⸨/u⸩",e.OPEN_SMALL_CAPS="⸨sc⸩",e.CLOSE_SMALL_CAPS="⸨/sc⸩",e.OPEN_GOOD="⸨good⸩",e.CLOSE_GOOD="⸨/good⸩",e.OPEN_ADDITION="⸨add⸩",e.CLOSE_ADDITION="⸨/add⸩",e.OPEN_ERROR="⸨err⸩",e.CLOSE_ERROR="⸨/err⸩",e.OPEN_LEFT_TO_RIGHT="⸨ltr⸩",e.CLOSE_LEFT_TO_RIGHT="⸨/ltr⸩",e.OPEN_RIGHT_TO_LEFT="⸨rtl⸩",e.CLOSE_RIGHT_TO_LEFT="⸨/rtl⸩",e.CLOSE_LANGUAGE="⸨/lang⸩"}(Known_Value||(Known_Value={}));export function Is_Valid_Value(e){return e.length>2&&"⸨"===e[0]&&"⸩"===e[e.length-1]}function Interior_Value(e){return e.replace(/^⸨\/?/,"").replace(/⸩$/,"")}function Interior_Parameter_And_Argument(e){const n=Interior_Value(e),t=n.indexOf(Symbol.DIVIDER);if(t>-1){const e=n.slice(0,t);if(e.length>0){return{parameter:e,argument:n.slice(t+Symbol.DIVIDER.length)}}return null}return null}export function Is_Known_Value(e){if(e===Known_Value.COLUMN||e===Known_Value.ROW||e===Known_Value.MARGIN||e===Known_Value.INTERLINEAR||e===Known_Value.REVERSE_INTERLINEAR||e===Known_Value.CENTER||e===Known_Value.INDENT||e===Known_Value.PAD||e===Known_Value.OPEN_ITALIC||e===Known_Value.CLOSE_ITALIC||e===Known_Value.OPEN_BOLD||e===Known_Value.CLOSE_BOLD||e===Known_Value.OPEN_UNDERLINE||e===Known_Value.CLOSE_UNDERLINE||e===Known_Value.OPEN_SMALL_CAPS||e===Known_Value.CLOSE_SMALL_CAPS||e===Known_Value.OPEN_GOOD||e===Known_Value.CLOSE_GOOD||e===Known_Value.OPEN_ADDITION||e===Known_Value.CLOSE_ADDITION||e===Known_Value.OPEN_ERROR||e===Known_Value.CLOSE_ERROR||e===Known_Value.OPEN_LEFT_TO_RIGHT||e===Known_Value.CLOSE_LEFT_TO_RIGHT||e===Known_Value.OPEN_RIGHT_TO_LEFT||e===Known_Value.CLOSE_RIGHT_TO_LEFT||e===Known_Value.CLOSE_LANGUAGE)return!0;if(Is_Known_Open_Parameter(e)||Is_Known_Close_Parameter(e))return!0;{const n=Interior_Parameter_And_Argument(e);return null!=n&&(n.parameter===Parameter.LANGUAGE?n.argument===Language.Name.HEBREW||n.argument===Language.Name.GREEK||n.argument===Language.Name.LATIN||n.argument===Language.Name.ARAMAIC||n.argument===Language.Name.ARABIC||n.argument===Language.Name.GERMAN||n.argument===Language.Name.FRENCH||n.argument===Language.Name.ITALIAN||n.argument===Language.Name.DUTCH||n.argument===Language.Name.ENGLISH:n.parameter===Parameter.ERROR||(n.parameter===Parameter.IMAGE||n.parameter===Parameter.INLINE_IMAGE)&&null!=n.argument)}}export function Maybe_Valid_Value_From(e){let n=new Unicode.Iterator({text:e});if(n.Is_At_End()||n.Point()!==Symbol.FIRST)return null;{let t=1;for(n=n.Next();!n.Is_At_End()&&t>0;n=n.Next()){const e=n.Point();e===Symbol.FIRST?t+=1:e===Symbol.LAST&&(t-=1)}return t<1?e.slice(0,n.Index()):null}}function Test_Maybe_Valid_Value_From(){0,0,0,0,0,0,0,0,0,0,0,0}export function First_Non_Command_Index(e){let n=new Unicode.Iterator({text:e,index:0});if(n.Is_At_End())return null;for(;!n.Is_At_End()&&n.Point()===Symbol.FIRST;){let e=n,t=1;for(n=n.Next();!n.Is_At_End()&&t>0;n=n.Next()){const e=n.Point();e===Symbol.FIRST?t+=1:e===Symbol.LAST&&(t-=1)}if(t>0)return e.Index();if(n.Is_At_End())return null}return n.Index()}function Test_First_Non_Command_Index(){0,0,0,0,0,0,0,0,0,0,0,0,0}export function Last_Non_Command_Index(e){let n=new Unicode.Iterator({text:e,index:e.length});if(n.Is_At_Start())return null;for(n=n.Previous();!n.Is_At_Start()&&n.Point()===Symbol.LAST;){let e=n,t=1;do{n=n.Previous();const e=n.Point();e===Symbol.FIRST?t-=1:e===Symbol.LAST&&(t+=1)}while(!n.Is_At_Start()&&t>0);if(t>0)return e.Index();if(n.Is_At_Start())return null;n=n.Previous()}return n.Index()}function Test_Last_Non_Command_Index(){0,0,0,0,0,0,0,0,0,0,0,0}export function Closing_Command_Index_From_Opening_Command(e){let n=new Unicode.Iterator({text:e}),t=Maybe_Valid_Value_From(e);if(null!=t){if(t.length>1&&t[1]!=Symbol.CLOSE){n=new Unicode.Iterator({text:e,index:n.Index()+t.length});let r=1,a=null;for(;!n.Is_At_End()&&r>0;)t=Maybe_Valid_Value_From(n.Points()),null!=t?(t.length>1&&t[1]!=Symbol.CLOSE?r+=1:r-=1,r<1?a=n.Index():n=new Unicode.Iterator({text:e,index:n.Index()+t.length})):n=n.Next();return null!=a?a:null}return null}return null}function Test_Closing_Command_Index_From_Opening_Command(){0,0,0,0,0,0}export function Partition_Into_Row_Values(e){const n=[];let t=new Unicode.Iterator({text:e}),r=!1,a=!1,_=!1;for(let s=t;!s.Is_At_End();){const l=Maybe_Valid_Value_From(s.Points());if(null!=l){const o=new Instance({index:0,value:l,language:null});o.Is_Column()||o.Is_Margin()||o.Is_Interlinear()?((r||a||_)&&(n.push(e.slice(t.Index(),s.Index())),t=s,r=!1,a=!1,_=!1),r=!0):o.Is_Row()?((a||_)&&(n.push(e.slice(t.Index(),s.Index())),t=s,r=!1,a=!1,_=!1),a=!0):_=!0,s=new Unicode.Iterator({text:s.Text(),index:s.Index()+o.Value().length})}else _=!0,s=s.Next()}return t.Is_At_End()||n.push(e.slice(t.Index(),e.length)),n}export function Resolve_Errors(e,n){function t(e){const n=Maybe_Valid_Value_From(a.Points());0;const t=Closing_Command_Index_From_Opening_Command(e);if(null!=t){const r=Maybe_Valid_Value_From(e.slice(t));return 0,{full:e.slice(0,t+r.length),interior:e.slice(n.length,t)}}return{full:e,interior:e.slice(n.length)}}let r="",a=new Unicode.Iterator({text:e});for(;!a.Is_At_End();){const e=Maybe_Valid_Value_From(a.Points());if(e){const _=new Instance({index:0,value:e,language:null});if(_.Is_Open_Error())if(_.Has_Argument()){const{full:e}=t(a.Points());r+=Resolve_Errors(_.Some_Argument(),n),a=new Unicode.Iterator({text:a.Text(),index:a.Index()+e.length})}else if(n){const{full:e,interior:_}=t(a.Points());r+=Resolve_Errors(_,n),a=new Unicode.Iterator({text:a.Text(),index:a.Index()+e.length})}else r+=_.Value(),a=new Unicode.Iterator({text:a.Text(),index:a.Index()+_.Value().length});else _.Is_Close_Error()&&n||(r+=_.Value()),a=new Unicode.Iterator({text:a.Text(),index:a.Index()+_.Value().length})}else r+=a.Point(),a=a.Next()}return r}export function Is_Centered(e){return e.slice(0,Known_Value.CENTER.length)===Known_Value.CENTER}export function Padding_Count(e){let n=0;for(;e.slice(0,Known_Value.PAD.length)===Known_Value.PAD;)n+=1,e=e.slice(Known_Value.PAD.length);return n}export class Instance extends Part.Instance{constructor({index:e,value:n,language:t}){super({part_type:Type.COMMAND,index:e,value:n,status:Is_Known_Value(n)?Status.GOOD:Is_Valid_Value(n)?Status.UNKNOWN:Status.ERROR,style:Style._NONE_,language:t});const r=Interior_Parameter_And_Argument(n);null!=r?(this.parameter=r.parameter,this.argument=r.argument):(this.parameter=null,this.argument=null)}Has_Image_Value(){return(this.Is_Image()||this.Is_Inline_Image())&&this.Has_Argument()}Is_Image_Value_Inline(){return this.Is_Inline_Image()&&this.Has_Argument()}Image_Value(){return 0,Utils.Resolve_Path(this.Some_Argument())}Has_Parameter(){return null!=this.parameter}Parameter(){return this.parameter}Some_Parameter(){return 0,this.parameter}Has_Argument(){return null!=this.argument}Argument(){return this.argument}Some_Argument(){return 0,this.argument}Is_Column(){return this.Value()===Known_Value.COLUMN}Is_Row(){return this.Value()===Known_Value.ROW}Is_Margin(){return this.Value()===Known_Value.MARGIN}Is_Interlinear(){return this.Is_Forward_Interlinear()||this.Is_Reverse_Interlinear()}Is_Forward_Interlinear(){return this.Value()===Known_Value.INTERLINEAR}Is_Reverse_Interlinear(){return this.Value()===Known_Value.REVERSE_INTERLINEAR}Is_Center(){return this.Value()===Known_Value.CENTER}Is_Indent(){return this.Value()===Known_Value.INDENT}Is_Pad(){return this.Value()===Known_Value.PAD}Is_Image(){return this.Parameter()===Parameter.IMAGE}Is_Inline_Image(){return this.Parameter()===Parameter.INLINE_IMAGE}Is_Opening(){return this.Value().length>1&&"/"!==this.Value()[1]}Is_Closing(){return this.Value().length>1&&"/"===this.Value()[1]}Is_Open_Italic(){return this.Value()===Known_Value.OPEN_ITALIC}Is_Close_Italic(){return this.Value()===Known_Value.CLOSE_ITALIC}Is_Open_Bold(){return this.Value()===Known_Value.OPEN_BOLD}Is_Close_Bold(){return this.Value()===Known_Value.CLOSE_BOLD}Is_Open_Underline(){return this.Value()===Known_Value.OPEN_UNDERLINE}Is_Close_Underline(){return this.Value()===Known_Value.CLOSE_UNDERLINE}Is_Open_Small_Caps(){return this.Value()===Known_Value.OPEN_SMALL_CAPS}Is_Close_Small_Caps(){return this.Value()===Known_Value.CLOSE_SMALL_CAPS}Is_Open_Good(){return this.Value()===Known_Value.OPEN_GOOD}Is_Close_Good(){return this.Value()===Known_Value.CLOSE_GOOD}Is_Open_Addition(){return this.Value()===Known_Value.OPEN_ADDITION}Is_Close_Addition(){return this.Value()===Known_Value.CLOSE_ADDITION}Is_Open_Error(){return this.Value()===Known_Value.OPEN_ERROR||this.Parameter()===Parameter.ERROR}Is_Close_Error(){return this.Value()===Known_Value.CLOSE_ERROR}Is_Open_Left_To_Right(){return this.Value()===Known_Value.OPEN_LEFT_TO_RIGHT}Is_Close_Left_To_Right(){return this.Value()===Known_Value.CLOSE_LEFT_TO_RIGHT}Is_Open_Right_To_Left(){return this.Value()===Known_Value.OPEN_RIGHT_TO_LEFT}Is_Close_Right_To_Left(){return this.Value()===Known_Value.CLOSE_RIGHT_TO_LEFT}Is_Open_Language(){return this.Parameter()===Parameter.LANGUAGE}Is_Open_Hebrew(){return this.Parameter()===Parameter.LANGUAGE&&this.Argument()===Language.Name.HEBREW}Is_Open_Greek(){return this.Parameter()===Parameter.LANGUAGE&&this.Argument()===Language.Name.GREEK}Is_Open_Latin(){return this.Parameter()===Parameter.LANGUAGE&&this.Argument()===Language.Name.LATIN}Is_Open_Aramaic(){return this.Parameter()===Parameter.LANGUAGE&&this.Argument()===Language.Name.ARAMAIC}Is_Open_Arabic(){return this.Parameter()===Parameter.LANGUAGE&&this.Argument()===Language.Name.ARABIC}Is_Open_German(){return this.Parameter()===Parameter.LANGUAGE&&this.Argument()===Language.Name.GERMAN}Is_Open_French(){return this.Parameter()===Parameter.LANGUAGE&&this.Argument()===Language.Name.FRENCH}Is_Open_Italian(){return this.Parameter()===Parameter.LANGUAGE&&this.Argument()===Language.Name.ITALIAN}Is_Open_Dutch(){return this.Parameter()===Parameter.LANGUAGE&&this.Argument()===Language.Name.DUTCH}Is_Open_English(){return this.Parameter()===Parameter.LANGUAGE&&this.Argument()===Language.Name.ENGLISH}Is_Close_Language(){return this.Value()===Known_Value.CLOSE_LANGUAGE}Is_First_Of_Split(){return this.Value()[this.Value().length-1]===Symbol.DIVIDER}Is_Last_Of_Split(){return this.Value()[0]===Symbol.LAST}Symbol_Point_Count(){let e=0,n=new Unicode.Iterator({text:this.Value()});for(;!n.Is_At_End();n=n.Next())Is_Symbol(n.Point())&&(e+=1);return e}Non_Symbol_Point_Count(){let e=0,n=new Unicode.Iterator({text:this.Value()});for(;!n.Is_At_End();n=n.Next())Is_Symbol(n.Point())||(e+=1);return e}}