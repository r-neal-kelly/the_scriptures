import*as Utils from"../../utils.js";import*as Font from"../font.js";import*as Fonts from"../fonts.js";import{Script_Position}from"../script_position.js";export class Instance{constructor({font_name:t,short_font_name:s,fallback_font_names:e,font_size_multiplier:i,line_height_multiplier:n,styles:l,treater:o=Instance.DEFAULT_TREATER}){0,0,0,0,0;const r=Fonts.Singleton();this.font=r.Font(t),this.short_font_name=s,this.fallback_fonts=e.map((t=>r.Font(t))),this.font_size_multiplier=i,this.line_height_multiplier=n,this.styles=Object.assign(Object.create(null),l),this.treater=o;const a=this.fallback_fonts.map((t=>`"${t.Family()}"`)).join(", ");this.styles["font-family"]=""!==a?`"${this.font.Family()}", ${a}, sans-serif`:`"${this.font.Family()}", sans-serif`,this.styles["font-size"]=`${this.font_size_multiplier}em`,this.styles["line-height"]=`${this.line_height_multiplier}em`,null==this.styles["vertical-align"]&&(this.styles["vertical-align"]="baseline"),null==this.styles["letter-spacing"]&&(this.styles["letter-spacing"]="normal"),null==this.styles["word-spacing"]&&(this.styles["word-spacing"]="normal"),Object.freeze(this.fallback_fonts),Object.freeze(this.styles)}Font(){return this.font}Short_Font_Name(){return this.short_font_name}Fallback_Fonts(){return Array.from(this.fallback_fonts)}Styles(t){const s=Object.assign(Object.create(null),this.styles);return t===Script_Position.SUPER?(s["font-size"]=this.font_size_multiplier*Font.Consts.SUPERSCRIPT_FONT_SIZE_MULTIPLIER+"em",s["line-height"]=this.line_height_multiplier*Font.Consts.SUPERSCRIPT_LINE_HEIGHT_MULTIPLIER+"em",s["vertical-align"]="super"):t===Script_Position.SUB&&(s["font-size"]=this.font_size_multiplier*Font.Consts.SUBSCRIPT_FONT_SIZE_MULTIPLIER+"em",s["line-height"]=this.line_height_multiplier*Font.Consts.SUBSCRIPT_LINE_HEIGHT_MULTIPLIER+"em",s["vertical-align"]="sub"),s}Treat_Text(t){return this.treater(t)}}Instance.DEFAULT_TREATER=function(t){return t};