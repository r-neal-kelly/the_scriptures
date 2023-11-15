import*as Utils from"../../../utils.js";import*as Item from"../item.js";import{Type}from"./type.js";import{Status}from"./status.js";import{Style}from"./style.js";export class Instance{constructor({part_type:t,index:e,value:s,status:r,style:a,language:n}){if(  this.part_type=t,this.index=e,this.value=s,this.status=r,a instanceof Array){this.style=Style._NONE_;for(const t of a)this.style|=t}else this.style=a;this.language=n}Item_Type(){return Item.Type.PART}Is_Part(){return!0}Is_Split(){return!1}Part_Type(){return this.part_type}Is_Point(){return this.part_type===Type.POINT}Is_Letter(){return this.part_type===Type.LETTER}Is_Marker(){return this.part_type===Type.MARKER}Is_Word(){return this.part_type===Type.WORD}Is_Break(){return this.part_type===Type.BREAK}Is_Command(){return this.part_type===Type.COMMAND}Is_Argument(){return this.Has_Argument_Style()}Is_Command_Or_Argument(){return this.Is_Command()||this.Is_Argument()}Index(){return this.index}Part_Index(){return this.index}Has_Meta_Value(){return this.Is_Command_Or_Argument()}Value(){return this.value}Has_Image_Value(){return!1}Is_Image_Value_Inline(){return!1}Image_Value(){return  ""}Status(){return this.status}Set_Status(t){this.status=t}Is_Good(){return this.status===Status.GOOD}Is_Unknown(){return this.status===Status.UNKNOWN}Is_Error(){return this.status===Status.ERROR}Style(){return this.style}Has_Italic_Style(){return 0!=(this.style&Style.ITALIC)}Has_Bold_Style(){return 0!=(this.style&Style.BOLD)}Has_Underline_Style(){return 0!=(this.style&Style.UNDERLINE)}Has_Small_Caps_Style(){return 0!=(this.style&Style.SMALL_CAPS)}Has_Error_Style(){return 0!=(this.style&Style.ERROR)}Has_Argument_Style(){return 0!=(this.style&Style.ARGUMENT)}Language(){return this.language}}