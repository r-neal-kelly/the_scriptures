import*as Utils from"../../utils.js";import*as Fonts from"../fonts.js";export class Instance{constructor({font_name:t,short_font_name:s,styles:e,treater:n=Instance.DEFAULT_TREATER}){Utils.Assert(!Object.isFrozen(e),"can't add font-family to styles when its frozen"),this.font=Fonts.Singleton().Font(t),this.short_font_name=s,this.styles=e,this.treater=n,this.styles["font-family"]=`"${this.font.Family()}"`,Object.freeze(this.styles)}Font(){return this.font}Short_Font_Name(){return this.short_font_name}Styles(){return this.styles}Treat_Text(t){return this.treater(t)}}Instance.DEFAULT_TREATER=function(t){return t};