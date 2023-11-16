import*as Utils from"../../../utils.js";import*as Entity from"../../entity.js";import*as Language from"../../language.js";import*as Text from"../../text.js";import*as Segment from"./segment.js";const LINE_PATH_TYPE=Text.Path.Type.DEFAULT;export class Instance extends Entity.Instance{static Min_Segment_Count(){return Instance.min_segment_count}static Set_Min_Segment_Count(t){ Instance.min_segment_count=t}constructor({buffer:t,index:e,result:n}){if(super(),this.buffer=t,this.index=e,this.result=n,this.segments=[],null==n) ;else if(  ""===n.Line().Value(LINE_PATH_TYPE)){const t=new Text.Segment.Instance({segment_type:Text.Segment.Type.MICRO,index:0});t.Add_Item(new Text.Part.Instance({part_type:Text.Part.Type.POINT,index:0,value:" ",status:Text.Part.Status.GOOD,style:Text.Part.Style._NONE_,language:null})),this.segments.push(new Segment.Instance({line:this,index:0,text:t}))}else{for(let t=0,e=n.Line().Macro_Segment_Count(LINE_PATH_TYPE);t<e;t+=1)this.segments.push(new Segment.Instance({line:this,index:t,text:n.Line().Macro_Segment(t,LINE_PATH_TYPE)}));for(let t=0,e=n.Match_Count();t<e;t+=1){const e=n.Match(t),i=e.First_Part_Index(),s=e.First_Part_First_Unit_Index(),_=e.Last_Part_End_Unit_Index(),r=e.Last_Part_Index();for(let t=i,l=e.End_Part_Index();t<l;t+=1){const e=n.Line().Macro_Part_Segment_Item_Indices(t,LINE_PATH_TYPE);if(t===i&&t===r){let t=!1;for(let i=0,r=e.length;i<r;i+=1){const{segment_index:l,item_index:u}=e[i],d=n.Line().Macro_Segment(l,LINE_PATH_TYPE).Item(u);if(d.Is_Part()) this.Segment_At(l).Item_At(u).Highlight({first_unit_index:s,end_unit_index:_});else{const e=d,n=e.End_Unit_Index();if(t){if(_<=n){this.Segment_At(l).Item_At(u).Highlight({first_unit_index:0,end_unit_index:_-e.First_Unit_Index()});break}this.Segment_At(l).Item_At(u).Highlight({first_unit_index:0,end_unit_index:e.Value().length})}else if(s<n){if(t=!0,_<=n){this.Segment_At(l).Item_At(u).Highlight({first_unit_index:s-e.First_Unit_Index(),end_unit_index:_-e.First_Unit_Index()});break}this.Segment_At(l).Item_At(u).Highlight({first_unit_index:s-e.First_Unit_Index(),end_unit_index:e.Value().length})}}}}else if(t===i){let t=!1;for(let i=0,_=e.length;i<_;i+=1){const{segment_index:r,item_index:l}=e[i],u=n.Line().Macro_Segment(r,LINE_PATH_TYPE).Item(l);if(u.Is_Part()) this.Segment_At(r).Item_At(l).Highlight({first_unit_index:s,end_unit_index:u.Value().length});else{const e=u,n=e.End_Unit_Index();t?this.Segment_At(r).Item_At(l).Highlight({first_unit_index:0,end_unit_index:e.Value().length}):s<n&&(t=!0,this.Segment_At(r).Item_At(l).Highlight({first_unit_index:s-e.First_Unit_Index(),end_unit_index:e.Value().length}))}}}else if(t===r)for(let t=0,i=e.length;t<i;t+=1){const{segment_index:s,item_index:r}=e[t],l=n.Line().Macro_Segment(s,LINE_PATH_TYPE).Item(r);if(l.Is_Part()) this.Segment_At(s).Item_At(r).Highlight({first_unit_index:0,end_unit_index:_});else{const t=l;if(_<=t.End_Unit_Index()){this.Segment_At(s).Item_At(r).Highlight({first_unit_index:0,end_unit_index:_-t.First_Unit_Index()});break}this.Segment_At(s).Item_At(r).Highlight({first_unit_index:0,end_unit_index:t.Value().length})}}else for(let t=0,i=e.length;t<i;t+=1){const{segment_index:i,item_index:s}=e[t],_=n.Line().Macro_Segment(i,LINE_PATH_TYPE).Item(s);this.Segment_At(i).Item_At(s).Highlight({first_unit_index:0,end_unit_index:_.Value().length})}}}}this.Add_Dependencies(this.segments)}Buffer(){return  this.buffer}Index(){return  this.index}Has_Result(){return null!=this.result}Result(){return  this.result}Value(){return this.Result().Line().Value(LINE_PATH_TYPE)}Segment_Count(){return this.segments.length}Segment_At(t){return  t<this.Segment_Count()?this.segments[t]:Instance.blank_segment}Is_Blank(){return null==this.result}Is_New_Line(){return""===this.Result().Line().Value(LINE_PATH_TYPE)}Is_Centered(){return this.Result().Line().Is_Centered(LINE_PATH_TYPE)}Is_Padded(){return this.Result().Line().Is_Padded(LINE_PATH_TYPE)}Padding_Count(){return this.Has_Result()?this.Result().Line().Padding_Count(LINE_PATH_TYPE):0}Padding_Direction(){return this.Buffer().Default_Text_Direction()}Has_Styles(){return this.Padding_Count()>0}Styles(){if(this.Has_Styles()){const t=`${this.Buffer().Pad_EM(this.Padding_Count())}em`,e=this.Padding_Direction()===Language.Direction.LEFT_TO_RIGHT?"left":"right";return`\n                margin-${e}: ${t};\n                border-${e}-width: 1px;\n            `}return""}}Instance.min_segment_count=70,Instance.blank_segment=new Segment.Instance({line:null,index:null,text:null});