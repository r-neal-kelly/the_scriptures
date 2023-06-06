import*as Utils from"../../utils.js";export class Instance{constructor({name:t,direction:n,default_font_name:o,current_font_name:_=o,font_adaptors:e}){this.name=t,this.direction=n,this.font_names=[],this.short_font_names=[],this.font_name_to_short_font_names={},this.short_font_name_to_font_names={},this.default_font_name=o,this.current_font_name=_,this.font_adaptors={};for(const t of e){const n=t.Font().Name(),o=t.Short_Font_Name();this.font_names.push(n),this.short_font_names.push(o),Utils.Assert(!this.font_name_to_short_font_names.hasOwnProperty(n),"cannot have the same font_name for multiple fonts"),this.font_name_to_short_font_names[n]=o,Utils.Assert(!this.short_font_name_to_font_names.hasOwnProperty(o),"cannot have the same short_font_name for multiple fonts"),this.short_font_name_to_font_names[o]=n,Utils.Assert(!this.font_adaptors.hasOwnProperty(n),"can only have one adaptor per font_name"),this.font_adaptors[n]=t}this.font_names.sort(),this.short_font_names.sort(),Object.freeze(this.font_names),Object.freeze(this.short_font_names),Object.freeze(this.short_font_name_to_font_names),Object.freeze(this.font_adaptors),Utils.Assert(this.Has_Font_Adaptor(this.Default_Font_Name()),`missing font_adaptor for default_font_name: ${o}`),Utils.Assert(this.Has_Font_Adaptor(this.Current_Font_Name()),`missing font_adaptor for current_font_name: ${_}`)}Name(){return this.name}Direction(){return this.direction}Font_Names(){return Array.from(this.font_names)}Short_Font_Names(){return Array.from(this.short_font_names)}Font_Name_To_Short_Font_Name(t){return Utils.Assert(this.font_name_to_short_font_names.hasOwnProperty(t),`does not have font_name: ${t}`),this.font_name_to_short_font_names[t]}Short_Font_Name_To_Font_Name(t){return Utils.Assert(this.short_font_name_to_font_names.hasOwnProperty(t),`does not have short_font_name: ${t}`),this.short_font_name_to_font_names[t]}Font_Styles(t){return this.Some_Font_Adaptor(t).Styles()}Default_Font_Name(){return this.default_font_name}Default_Short_Font_Name(){return this.Font_Name_To_Short_Font_Name(this.Default_Font_Name())}Default_Font_Styles(){return this.Some_Font_Adaptor(this.Default_Font_Name()).Styles()}Current_Font_Name(){return this.current_font_name}Set_Current_Font_Name(t){Utils.Assert(this.Has_Font_Adaptor(t),`missing font_adaptor for font_name: ${t}`),this.current_font_name=t}Current_Short_Font_Name(){return this.Font_Name_To_Short_Font_Name(this.Current_Font_Name())}Current_Font_Styles(){return this.Some_Font_Adaptor(this.Current_Font_Name()).Styles()}Has_Font_Adaptor(t){return this.font_adaptors.hasOwnProperty(t)}Some_Font_Adaptor(t){return Utils.Assert(this.Has_Font_Adaptor(t),`missing font_adaptor for font_name: ${t}`),this.font_adaptors[t]}Adapt_Text_To_Font({text:t,font_name:n=this.Current_Font_Name()}){return this.Some_Font_Adaptor(n).Treat_Text(t)}Adapt_Text_To_Default_Font(t){return this.Adapt_Text_To_Font({text:t,font_name:this.Default_Font_Name()})}Adapt_Text_To_Current_Font(t){return this.Adapt_Text_To_Font({text:t,font_name:this.Current_Font_Name()})}}