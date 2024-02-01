import*as Utils from"../../../utils.js";import*as Unicode from"../../../unicode.js";import*as Language from"../../language.js";import*as Dictionary from"../dictionary.js";import*as Part from"../part.js";import*as Path from"../path.js";var Parse_Type;!function(t){t[t.WORD=0]="WORD",t[t.BREAK=1]="BREAK",t[t.POINT=2]="POINT"}(Parse_Type||(Parse_Type={}));class Fix_Argument_Frame{constructor({parameter:t,argument:e,from_text:n,from_text_index:a}){this.first_non_command_index=Part.Command.First_Non_Command_Index(e),null!=this.first_non_command_index&&(this.first_non_command_index=a+Part.Command.Symbol.FIRST.length+t.length+Part.Command.Symbol.DIVIDER.length+this.first_non_command_index),this.last_non_command_index=Part.Command.Last_Non_Command_Index(e),null!=this.last_non_command_index&&(this.last_non_command_index=a+Part.Command.Symbol.FIRST.length+t.length+Part.Command.Symbol.DIVIDER.length+this.last_non_command_index),this.closing_command_index=Part.Command.Closing_Command_Index_From_Opening_Command(n)||-1,-1!==this.closing_command_index?this.closing_command_index=a+this.closing_command_index:this.closing_command_index=a+n.length}First_Non_Command_Index(){return this.first_non_command_index}Last_Non_Command_Index(){return this.last_non_command_index}Closing_Command_Index(){return this.closing_command_index}}export class Instance{constructor({text:t,index:e,value:n}){this.text=t,this.index=e,this.paths={},this.has_errorless_path=!1,this.Set_Value(n)}Text(){return this.text}Index(){return this.index}Path(){let t=this.Text().Path_Type();return this.paths.hasOwnProperty(t)||(t=Path.Type.DEFAULT),0,this.paths[t]}Value(){return this.Path().Value()}Set_Value(t){0,this.paths={},this.has_errorless_path=!1,this.Set_Path(Path.Type.DEFAULT,t),this.has_errorless_path&&this.Set_Path(Path.Type.ERRORLESS,Part.Command.Resolve_Errors(t,!1))}Set_Path(t,e){const n=new Path.Instance({line:this,type:t,value:e});if(""===e)n.Update_Empty();else{const a=this.Text().Dictionary(),s=Part.Command.Partition_Into_Row_Values(e);for(const r of s){const _=Part.Command.First_Non_Command_Index(r),o=Part.Command.Last_Non_Command_Index(r),i=[],l=[];let m=Parse_Type.POINT,u=Part.Style._NONE_,d=!1,h=new Unicode.Iterator({text:r});function I(){return i.length>0?i[i.length-1]:null}function P(t,e){if(l.length>0){const n=l[l.length-1];return t.Index()===n.First_Non_Command_Index()&&(null==_||e.Index()<_)?Dictionary.Boundary.START:e.Index()===n.Last_Non_Command_Index()&&(null==o||n.Closing_Command_Index()>o)?Dictionary.Boundary.END:Dictionary.Boundary.MIDDLE}return t.Index()===_?Dictionary.Boundary.START:e.Index()===o?Dictionary.Boundary.END:Dictionary.Boundary.MIDDLE}for(let p=h;!p.Is_At_End();){const C=Part.Command.Maybe_Valid_Value_From(p.Points());if(null!=C){let g=C,x=I(),c=new Part.Command.Instance({index:0,value:g,language:null});c.Is_Open_Italic()?u|=Part.Style.ITALIC:c.Is_Close_Italic()?u&=~Part.Style.ITALIC:c.Is_Open_Bold()?u|=Part.Style.BOLD:c.Is_Close_Bold()?u&=~Part.Style.BOLD:c.Is_Open_Underline()?u|=Part.Style.UNDERLINE:c.Is_Close_Underline()?u&=~Part.Style.UNDERLINE:c.Is_Open_Small_Caps()?u|=Part.Style.SMALL_CAPS:c.Is_Close_Small_Caps()?u&=~Part.Style.SMALL_CAPS:c.Is_Open_Superscript()?u|=Part.Style.SUPERSCRIPT:c.Is_Close_Superscript()?u&=~Part.Style.SUPERSCRIPT:c.Is_Open_Subscript()?u|=Part.Style.SUBSCRIPT:c.Is_Close_Subscript()?u&=~Part.Style.SUBSCRIPT:c.Is_Open_Good()?d=!0:c.Is_Close_Good()?d=!1:c.Is_Open_Fix()?(this.has_errorless_path=!0,c.Has_Argument()?(g=Part.Command.Symbol.FIRST+c.Some_Parameter()+Part.Command.Symbol.DIVIDER,l.push(new Fix_Argument_Frame({parameter:c.Some_Parameter(),argument:c.Some_Argument(),from_text:p.Points(),from_text_index:p.Index()})),u|=Part.Style.ARGUMENT):u|=Part.Style.ERROR):c.Is_Close_Fix()?u&=~Part.Style.ERROR:c.Is_Open_Size()||c.Is_Close_Size()||(c.Is_Open_Hebrew()?i.push(Language.Name.HEBREW):c.Is_Open_Greek()?i.push(Language.Name.GREEK):c.Is_Open_Latin()?i.push(Language.Name.LATIN):c.Is_Open_Aramaic()?i.push(Language.Name.ARAMAIC):c.Is_Open_Geez()?i.push(Language.Name.GEEZ):c.Is_Open_Arabic()?i.push(Language.Name.ARABIC):c.Is_Open_German()?i.push(Language.Name.GERMAN):c.Is_Open_French()?i.push(Language.Name.FRENCH):c.Is_Open_Italian()?i.push(Language.Name.ITALIAN):c.Is_Open_Dutch()?i.push(Language.Name.DUTCH):c.Is_Open_English()?i.push(Language.Name.ENGLISH):c.Is_Close_Language()&&(i.length>0&&i.pop(),x=I())),n.Update_Command(r,{value:g,language:x}),p=new Unicode.Iterator({text:p.Text(),index:p.Index()+g.length}),h=p}else if(l.length>0&&p.Point()===Part.Command.Symbol.LAST)l.pop(),0===l.length&&(u&=~Part.Style.ARGUMENT),u|=Part.Style.ERROR,n.Update_Command(r,{value:Part.Command.Symbol.LAST,language:I()}),p=p.Next(),h=p;else{const S=I(),y=p.Point(),R=p.Look_Forward_Point(),T=Part.Command.Maybe_Valid_Value_From(p.Look_Forward_Points()||"");if(a.Has_Letter(y,S)?(n.Update_Letter(r,{value:y,style:u,language:S}),m=Parse_Type.WORD):a.Has_Marker(y,S)?(n.Update_Marker(r,{value:y,style:u,language:S}),m=Parse_Type.BREAK):(n.Update_Point(r,{value:y,style:u,language:S}),m=Parse_Type.POINT,h=p.Next()),m===Parse_Type.WORD){if(null==R||null!=T||!a.Has_Letter(R,S)){const O=p.Text().slice(h.Index(),p.Look_Forward_Index()),N=d||a.Has_Word(O,S)?Part.Status.GOOD:a.Has_Word_Error(O,S)?Part.Status.ERROR:Part.Status.UNKNOWN;n.Update_Word(r,{value:O,status:N,style:u,language:S}),h=p.Next()}}else if(m===Parse_Type.BREAK&&(null==R||null!=T||!a.Has_Marker(R,S))){const L=p.Text().slice(h.Index(),p.Look_Forward_Index()),E=P(h,p),A=d||a.Has_Break(L,E,S)?Part.Status.GOOD:a.Has_Break_Error(L,E,S)?Part.Status.ERROR:Part.Status.UNKNOWN;n.Update_Break(r,{value:L,status:A,style:u,language:S,boundary:E}),h=p.Next()}p=p.Next()}}}}n.Finalize(),this.paths[t]=n}Has_Column_Index(t){return 0,this.Path().Has_Column_Index(t)}Column_Count(){return this.Path().Column_Count()}Column(t){return 0,this.Path().Column(t)}Column_Percents(){return 0,this.Text().Line_Column_Percents(this.Index())}Tabular_Column_Count(){return this.Path().Tabular_Column_Count()}Marginal_Column_Count(){return this.Path().Marginal_Column_Count()}Interlinear_Column_Count(){return this.Path().Interlinear_Column_Count()}Has_Margin(){return this.Path().Has_Margin()}Has_Interlineation(){return this.Path().Has_Interlineation()}Has_Forward_Interlineation(){return this.Path().Has_Forward_Interlineation()}Has_Reverse_Interlineation(){return this.Path().Has_Reverse_Interlineation()}Is_Row_Of_Table(){return!this.Has_Margin()&&!this.Has_Interlineation()&&this.Column_Count()>1}Is_First_Row_Of_Table(){return this.Is_Row_Of_Table()&&(0===this.Index()||!this.Text().Line(this.Index()-1).Is_Row_Of_Table())}Is_Centered(){return this.Path().Is_Centered()}Is_Padded(){return this.Path().Is_Padded()}Padding_Count(){return this.Path().Padding_Count()}}