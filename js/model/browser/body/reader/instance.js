var __awaiter=this&&this.__awaiter||function(e,t,n,a){return new(n||(n=Promise))((function(r,i){function _(e){try{o(a.next(e))}catch(e){i(e)}}function s(e){try{o(a.throw(e))}catch(e){i(e)}}function o(e){var t;e.done?r(e.value):(t=e.value,t instanceof n?t:new n((function(e){e(t)}))).then(_,s)}o((a=a.apply(e,t||[])).next())}))};import*as Async from"../../../../async.js";import*as Language from"../../../language.js";import*as Languages from"../../../languages.js";import*as Data from"../../../data.js";import*as Text from"../../../text.js";import*as Buffer from"../../../buffer.js";export class Instance extends Async.Instance{static Blank_File(){return this.blank_file}constructor({body:e}){super(),this.body=e,this.current_data=null,this.current_file=Instance.Blank_File(),this.Add_Dependencies([this.current_file])}Body(){return this.body}Maybe_Current_Data(){return this.current_data}File(){return this.current_file}Refresh_File(e=!1){return __awaiter(this,void 0,void 0,(function*(){const t=this.Body().Selector().Maybe_File();if(null!=t){const n=t.Default_Language_Name(),a=this.Body().Font_Selector().Some_Selected_Font_Name(n),r=this.Body().Browser().Commander().Allow_Errors().Is_Activated(),i=this.Body().Options().Underlying_Font_Size_PX();(e||this.Maybe_Current_Data()!==t||this.current_file.Default_Font_Name()!==a||this.current_file.Allows_Errors()!==r||this.current_file.Underlying_Font_Size_PX()!==i)&&(this.current_data=t,this.current_file=new Buffer.Text.Instance({default_language_name:n,default_font_name:a,override_font_name:function(e){return this.Body().Font_Selector().Some_Selected_Font_Name(e)}.bind(this),underlying_font_size_px:i,text:yield t.Text(),allow_errors:r}),yield this.current_file.Ready())}else(e||null!=this.Maybe_Current_Data())&&(this.current_data=t,this.current_file=Instance.Blank_File(),yield this.current_file.Ready())}))}}Instance.blank_file=new Buffer.Text.Instance({default_language_name:Language.Name.ENGLISH,default_font_name:Languages.Singleton().Default_Global_Font_Name(Language.Name.ENGLISH),override_font_name:function(e){return Languages.Singleton().Default_Global_Font_Name(e)},underlying_font_size_px:Data.Consts.DEFAULT_UNDERLYING_FONT_SIZE_PX,text:new Text.Instance,allow_errors:!1});