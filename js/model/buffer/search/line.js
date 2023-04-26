import*as Utils from"../../../utils.js";import*as Entity from"../../entity.js";import*as Text from"../../text.js";import*as Segment from"./segment.js";export class Instance extends Entity.Instance{static Min_Segment_Count(){return Instance.min_segment_count}static Set_Min_Segment_Count(t){Utils.Assert(t>=0,"min_segment_count must be greater than or equal to 0."),Instance.min_segment_count=t}constructor({buffer:t,index:e,result:n}){if(super(),this.buffer=t,this.index=e,this.result=n,this.segments=[],null==n)Utils.Assert(null==t,"buffer must be null."),Utils.Assert(null==e,"index must be null.");else if(Utils.Assert(null!=t,"buffer must not be null."),Utils.Assert(null!=e&&e>-1,"index must not be null, and must be greater than -1."),""===n.Line().Value()){const t=new Text.Segment.Instance({segment_type:Text.Segment.Type.MICRO,index:0});t.Add_Item(new Text.Part.Instance({part_type:Text.Part.Type.POINT,index:0,value:" ",status:Text.Part.Status.GOOD,style:Text.Part.Style._NONE_})),this.segments.push(new Segment.Instance({line:this,index:0,text:t}))}else{for(let t=0,e=n.Line().Macro_Segment_Count();t<e;t+=1)this.segments.push(new Segment.Instance({line:this,index:t,text:n.Line().Macro_Segment(t)}));for(let t=0,e=n.Match_Count();t<e;t+=1){const e=n.Match(t),i=e.First_Part_Index(),s=e.First_Part_First_Unit_Index(),_=e.Last_Part_End_Unit_Index(),l=e.Last_Part_Index();for(let t=i,r=e.End_Part_Index();t<r;t+=1){const e=n.Line().Macro_Part_Segment_Item_Indices(t);if(t===i&&t===l){let t=!1;for(let i=0,l=e.length;i<l;i+=1){const{segment_index:r,item_index:u}=e[i],m=n.Line().Macro_Segment(r).Item(u);if(m.Is_Part())Utils.Assert(1===l,"A part item in segment was found split between segments!"),this.Segment_At(r).Item_At(u).Highlight({first_unit_index:s,end_unit_index:_});else{const e=m,n=e.End_Unit_Index();if(t){if(_<=n){this.Segment_At(r).Item_At(u).Highlight({first_unit_index:0,end_unit_index:_-e.First_Unit_Index()});break}this.Segment_At(r).Item_At(u).Highlight({first_unit_index:0,end_unit_index:e.Value().length})}else if(s<n){if(t=!0,_<=n){this.Segment_At(r).Item_At(u).Highlight({first_unit_index:s-e.First_Unit_Index(),end_unit_index:_-e.First_Unit_Index()});break}this.Segment_At(r).Item_At(u).Highlight({first_unit_index:s-e.First_Unit_Index(),end_unit_index:e.Value().length})}}}}else if(t===i){let t=!1;for(let i=0,_=e.length;i<_;i+=1){const{segment_index:l,item_index:r}=e[i],u=n.Line().Macro_Segment(l).Item(r);if(u.Is_Part())Utils.Assert(1===_,"A part item in segment was found split between segments!"),this.Segment_At(l).Item_At(r).Highlight({first_unit_index:s,end_unit_index:u.Value().length});else{const e=u,n=e.End_Unit_Index();t?this.Segment_At(l).Item_At(r).Highlight({first_unit_index:0,end_unit_index:e.Value().length}):s<n&&(t=!0,this.Segment_At(l).Item_At(r).Highlight({first_unit_index:s-e.First_Unit_Index(),end_unit_index:e.Value().length}))}}}else if(t===l)for(let t=0,i=e.length;t<i;t+=1){const{segment_index:s,item_index:l}=e[t],r=n.Line().Macro_Segment(s).Item(l);if(r.Is_Part())Utils.Assert(1===i,"A part item in segment was found split between segments!"),this.Segment_At(s).Item_At(l).Highlight({first_unit_index:0,end_unit_index:_});else{const t=r;if(_<=t.End_Unit_Index()){this.Segment_At(s).Item_At(l).Highlight({first_unit_index:0,end_unit_index:_-t.First_Unit_Index()});break}this.Segment_At(s).Item_At(l).Highlight({first_unit_index:0,end_unit_index:t.Value().length})}}else for(let t=0,i=e.length;t<i;t+=1){const{segment_index:i,item_index:s}=e[t],_=n.Line().Macro_Segment(i).Item(s);this.Segment_At(i).Item_At(s).Highlight({first_unit_index:0,end_unit_index:_.Value().length})}}}}this.Add_Dependencies(this.segments)}Buffer(){return Utils.Assert(null!=this.buffer,"Doesn't have buffer."),this.buffer}Index(){return Utils.Assert(null!=this.index,"Doesn't have an index."),this.index}Result(){return Utils.Assert(null!=this.result,"Doesn't have result."),this.result}Segment_Count(){return this.segments.length}Segment_At(t){return Utils.Assert(t>-1,`segment_index (${t}) must be greater than -1.`),t<this.Segment_Count()?this.segments[t]:Instance.blank_segment}Is_Blank(){return null==this.result}Is_New_Line(){return""===this.Result().Line().Value()}}Instance.min_segment_count=70,Instance.blank_segment=new Segment.Instance({line:null,index:null,text:null});