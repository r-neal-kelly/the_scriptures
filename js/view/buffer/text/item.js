import*as Utils from"../../../utils.js";import*as Text_Base from"../text_base.js";export class Instance extends Text_Base.Item.Instance{constructor({segment:e,model:t}){super({segment:e,model:t}),this.Live()}On_Refresh(){const e=this.Model();if(!e.Is_Blank()){const t=this.Element();t instanceof HTMLDivElement?e.Has_Image_Value()?(this.Replace_Element("img"),this.Element().setAttribute("src",e.Value())):this.Element().textContent=e.Value():t instanceof HTMLImageElement?e.Has_Image_Value()?this.Element().setAttribute("src",e.Value()):(this.Replace_Element("div"),this.Element().textContent=e.Value()):0}}On_Restyle(){const e=this.Model();return e.Is_Blank()?"":e.Has_Image_Value()?this.Has_Inline_Image_Styles()?this.Inline_Image_Styles():"":this.Has_Override_Font_Styles()?this.Override_Font_Styles():""}}