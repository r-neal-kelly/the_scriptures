import*as Utils from"../../../utils.js";import*as Name_Sorter from"../../name_sorter.js";import{FILE_COUNT,LINES,MAX_LINE_COUNT,AVG_LINE_COUNT,COLUMNS,MAX_COLUMN_COUNT,AVG_COLUMN_COUNT,MACRO_ROWS,MICRO_ROWS,MAX_ROW_COUNT,AVG_ROW_COUNT,SEGMENTS,MAX_SEGMENT_COUNT,AVG_SEGMENT_COUNT,MAX_ITEM_COUNT,AVG_ITEM_COUNT}from"../buffer_counts.js";export class Info{constructor({json:t=null}){if(t){const _=JSON.parse(t);this.unique_language_names=_.unique_language_names,this.total_unit_count=_.total_unit_count,this.total_point_count=_.total_point_count,this.total_letter_count=_.total_letter_count,this.total_marker_count=_.total_marker_count,this.total_meta_letter_count=_.total_meta_letter_count,this.total_word_count=_.total_word_count,this.total_break_count=_.total_break_count,this.total_meta_word_count=_.total_meta_word_count,this.total_part_count=_.total_part_count,this.total_line_count=_.total_line_count,this.total_file_count=_.total_file_count,this.language_unit_counts=_.language_unit_counts,this.language_point_counts=_.language_point_counts,this.language_letter_counts=_.language_letter_counts,this.language_marker_counts=_.language_marker_counts,this.language_meta_letter_counts=_.language_meta_letter_counts,this.language_word_counts=_.language_word_counts,this.language_break_counts=_.language_break_counts,this.language_meta_word_counts=_.language_meta_word_counts,this.language_part_counts=_.language_part_counts,this.language_line_counts=_.language_line_counts,this.language_file_counts=_.language_file_counts,this.buffer_counts=_.buffer_counts,this.Freeze()}else this.unique_language_names=[],this.total_unit_count=0,this.total_point_count=0,this.total_letter_count=0,this.total_marker_count=0,this.total_meta_letter_count=0,this.total_word_count=0,this.total_break_count=0,this.total_meta_word_count=0,this.total_part_count=0,this.total_line_count=0,this.total_file_count=0,this.language_unit_counts={},this.language_point_counts={},this.language_letter_counts={},this.language_marker_counts={},this.language_meta_letter_counts={},this.language_word_counts={},this.language_break_counts={},this.language_meta_word_counts={},this.language_part_counts={},this.language_line_counts={},this.language_file_counts={},this.buffer_counts={[MAX_LINE_COUNT]:0,[AVG_LINE_COUNT]:0,[FILE_COUNT]:0,[LINES]:[]}}Is_Finalized(){return this.Is_Frozen()}Finalize(){0,this.Freeze()}Is_Frozen(){return Object.isFrozen(this)}Freeze(){0;const t=Name_Sorter.Singleton();this.unique_language_names=t.With_Array(Name_Sorter.Type.LANGUAGES,this.unique_language_names),Object.freeze(this.unique_language_names),Object.freeze(this.language_unit_counts),Object.freeze(this.language_point_counts),Object.freeze(this.language_letter_counts),Object.freeze(this.language_marker_counts),Object.freeze(this.language_meta_letter_counts),Object.freeze(this.language_word_counts),Object.freeze(this.language_break_counts),Object.freeze(this.language_meta_word_counts),Object.freeze(this.language_part_counts),Object.freeze(this.language_line_counts),Object.freeze(this.language_file_counts),Object.freeze(this.buffer_counts);for(let t=0,_=this.buffer_counts[LINES].length;t<_;t+=1){const _=this.buffer_counts[LINES][t];Object.freeze(_);for(let t=0,e=_[COLUMNS].length;t<e;t+=1){const e=_[COLUMNS][t];Object.freeze(e);for(let t=0,_=e[MACRO_ROWS].length;t<_;t+=1){const _=e[MACRO_ROWS][t];Object.freeze(_);for(let t=0,e=_[SEGMENTS].length;t<e;t+=1){const e=_[SEGMENTS][t];Object.freeze(e)}}for(let t=0,_=e[MICRO_ROWS].length;t<_;t+=1){const _=e[MICRO_ROWS][t];Object.freeze(_);for(let t=0,e=_[SEGMENTS].length;t<e;t+=1){const e=_[SEGMENTS][t];Object.freeze(e)}}}}Object.freeze(this),0,0}JSON_String(){return 0,JSON.stringify(this)}Unique_Language_Names(){return Array.from(this.unique_language_names)}Unique_Language_Name_Count(){return this.unique_language_names.length}Unique_Language_Name_Count_String(){return Utils.Add_Commas_To_Number(this.Unique_Language_Name_Count())}Has_Unique_Language_Name(t){return null!=this.language_unit_counts[t]}Add_Unique_Language_Name(t){0,this.Has_Unique_Language_Name(t)||(this.unique_language_names.push(t),this.language_unit_counts[t]=0,this.language_point_counts[t]=0,this.language_letter_counts[t]=0,this.language_marker_counts[t]=0,this.language_meta_letter_counts[t]=0,this.language_word_counts[t]=0,this.language_break_counts[t]=0,this.language_meta_word_counts[t]=0,this.language_part_counts[t]=0,this.language_line_counts[t]=0,this.language_file_counts[t]=0)}Total_Unit_Count(){return this.total_unit_count}Total_Unit_Count_String(){return Utils.Add_Commas_To_Number(this.Total_Unit_Count())}Language_Unit_Count(t){return 0,this.language_unit_counts[t]}Language_Unit_Percent(t){return Math.round(100*this.Language_Unit_Count(t)/this.Total_Unit_Count())}Language_Unit_Counts(){const t=[];for(const _ of this.unique_language_names)t.push([_,this.Language_Unit_Count(_)]);return t}Language_Unit_Counts_And_Percents(){const t=[];for(const _ of this.unique_language_names)t.push([_,this.Language_Unit_Count(_),this.Language_Unit_Percent(_)]);return t}Increment_Unit_Count(t,_){this.Has_Unique_Language_Name(t)||this.Add_Unique_Language_Name(t),0,0,this.total_unit_count+=_,this.language_unit_counts[t]+=_}Increment_Unit_Counts(t){for(const[_,e]of t)this.Increment_Unit_Count(_,e)}Total_Point_Count(){return this.total_point_count}Total_Point_Count_String(){return Utils.Add_Commas_To_Number(this.Total_Point_Count())}Language_Point_Count(t){return 0,this.language_point_counts[t]}Language_Point_Percent(t){return Math.round(100*this.Language_Point_Count(t)/this.Total_Point_Count())}Language_Point_Counts(){const t=[];for(const _ of this.unique_language_names)t.push([_,this.Language_Point_Count(_)]);return t}Language_Point_Counts_And_Percents(){const t=[];for(const _ of this.unique_language_names)t.push([_,this.Language_Point_Count(_),this.Language_Point_Percent(_)]);return t}Increment_Point_Count(t,_){this.Has_Unique_Language_Name(t)||this.Add_Unique_Language_Name(t),0,0,this.total_point_count+=_,this.language_point_counts[t]+=_}Increment_Point_Counts(t){for(const[_,e]of t)this.Increment_Point_Count(_,e)}Total_Letter_Count(){return this.total_letter_count}Total_Letter_Count_String(){return Utils.Add_Commas_To_Number(this.Total_Letter_Count())}Total_Letter_Percent(){return Math.round(100*this.Total_Letter_Count()/this.Total_Point_Count())}Language_Letter_Count(t){return 0,this.language_letter_counts[t]}Language_Letter_Percent(t){return Math.round(100*this.Language_Letter_Count(t)/this.Total_Letter_Count())}Language_Letter_Counts(){const t=[];for(const _ of this.unique_language_names)t.push([_,this.Language_Letter_Count(_)]);return t}Language_Letter_Counts_And_Percents(){const t=[];for(const _ of this.unique_language_names)t.push([_,this.Language_Letter_Count(_),this.Language_Letter_Percent(_)]);return t}Increment_Letter_Count(t,_){this.Has_Unique_Language_Name(t)||this.Add_Unique_Language_Name(t),0,0,this.total_letter_count+=_,this.language_letter_counts[t]+=_}Increment_Letter_Counts(t){for(const[_,e]of t)this.Increment_Letter_Count(_,e)}Total_Marker_Count(){return this.total_marker_count}Total_Marker_Count_String(){return Utils.Add_Commas_To_Number(this.Total_Marker_Count())}Total_Marker_Percent(){return Math.round(100*this.Total_Marker_Count()/this.Total_Point_Count())}Language_Marker_Count(t){return 0,this.language_marker_counts[t]}Language_Marker_Percent(t){return Math.round(100*this.Language_Marker_Count(t)/this.Total_Marker_Count())}Language_Marker_Counts(){const t=[];for(const _ of this.unique_language_names)t.push([_,this.Language_Marker_Count(_)]);return t}Language_Marker_Counts_And_Percents(){const t=[];for(const _ of this.unique_language_names)t.push([_,this.Language_Marker_Count(_),this.Language_Marker_Percent(_)]);return t}Increment_Marker_Count(t,_){this.Has_Unique_Language_Name(t)||this.Add_Unique_Language_Name(t),0,0,this.total_marker_count+=_,this.language_marker_counts[t]+=_}Increment_Marker_Counts(t){for(const[_,e]of t)this.Increment_Marker_Count(_,e)}Total_Meta_Letter_Count(){return this.total_meta_letter_count}Total_Meta_Letter_Count_String(){return Utils.Add_Commas_To_Number(this.Total_Meta_Letter_Count())}Total_Meta_Letter_Percent(){return Math.round(100*this.Total_Meta_Letter_Count()/this.Total_Point_Count())}Language_Meta_Letter_Count(t){return 0,this.language_meta_letter_counts[t]}Language_Meta_Letter_Percent(t){return Math.round(100*this.Language_Meta_Letter_Count(t)/this.Total_Meta_Letter_Count())}Language_Meta_Letter_Counts(){const t=[];for(const _ of this.unique_language_names)t.push([_,this.Language_Meta_Letter_Count(_)]);return t}Language_Meta_Letter_Counts_And_Percents(){const t=[];for(const _ of this.unique_language_names)t.push([_,this.Language_Meta_Letter_Count(_),this.Language_Meta_Letter_Percent(_)]);return t}Increment_Meta_Letter_Count(t,_){this.Has_Unique_Language_Name(t)||this.Add_Unique_Language_Name(t),0,0,this.total_meta_letter_count+=_,this.language_meta_letter_counts[t]+=_}Increment_Meta_Letter_Counts(t){for(const[_,e]of t)this.Increment_Meta_Letter_Count(_,e)}Total_Word_Count(){return this.total_word_count}Total_Word_Count_String(){return Utils.Add_Commas_To_Number(this.Total_Word_Count())}Total_Word_Percent(){return Math.round(100*this.Total_Word_Count()/this.Total_Part_Count())}Language_Word_Count(t){return 0,this.language_word_counts[t]}Language_Word_Percent(t){return Math.round(100*this.Language_Word_Count(t)/this.Total_Word_Count())}Language_Word_Counts(){const t=[];for(const _ of this.unique_language_names)t.push([_,this.Language_Word_Count(_)]);return t}Language_Word_Counts_And_Percents(){const t=[];for(const _ of this.unique_language_names)t.push([_,this.Language_Word_Count(_),this.Language_Word_Percent(_)]);return t}Increment_Word_Count(t,_){this.Has_Unique_Language_Name(t)||this.Add_Unique_Language_Name(t),0,0,this.total_word_count+=_,this.language_word_counts[t]+=_}Increment_Word_Counts(t){for(const[_,e]of t)this.Increment_Word_Count(_,e)}Total_Break_Count(){return this.total_break_count}Total_Break_Count_String(){return Utils.Add_Commas_To_Number(this.Total_Break_Count())}Total_Break_Percent(){return Math.round(100*this.Total_Break_Count()/this.Total_Part_Count())}Language_Break_Count(t){return 0,this.language_break_counts[t]}Language_Break_Percent(t){return Math.round(100*this.Language_Break_Count(t)/this.Total_Break_Count())}Language_Break_Counts(){const t=[];for(const _ of this.unique_language_names)t.push([_,this.Language_Break_Count(_)]);return t}Language_Break_Counts_And_Percents(){const t=[];for(const _ of this.unique_language_names)t.push([_,this.Language_Break_Count(_),this.Language_Break_Percent(_)]);return t}Increment_Break_Count(t,_){this.Has_Unique_Language_Name(t)||this.Add_Unique_Language_Name(t),0,0,this.total_break_count+=_,this.language_break_counts[t]+=_}Increment_Break_Counts(t){for(const[_,e]of t)this.Increment_Break_Count(_,e)}Total_Meta_Word_Count(){return this.total_meta_word_count}Total_Meta_Word_Count_String(){return Utils.Add_Commas_To_Number(this.Total_Meta_Word_Count())}Total_Meta_Word_Percent(){return Math.round(100*this.Total_Meta_Word_Count()/this.Total_Part_Count())}Language_Meta_Word_Count(t){return 0,this.language_meta_word_counts[t]}Language_Meta_Word_Percent(t){return Math.round(100*this.Language_Meta_Word_Count(t)/this.Total_Meta_Word_Count())}Language_Meta_Word_Counts(){const t=[];for(const _ of this.unique_language_names)t.push([_,this.Language_Meta_Word_Count(_)]);return t}Language_Meta_Word_Counts_And_Percents(){const t=[];for(const _ of this.unique_language_names)t.push([_,this.Language_Meta_Word_Count(_),this.Language_Meta_Word_Percent(_)]);return t}Increment_Meta_Word_Count(t,_){this.Has_Unique_Language_Name(t)||this.Add_Unique_Language_Name(t),0,0,this.total_meta_word_count+=_,this.language_meta_word_counts[t]+=_}Increment_Meta_Word_Counts(t){for(const[_,e]of t)this.Increment_Meta_Word_Count(_,e)}Total_Part_Count(){return this.total_part_count}Total_Part_Count_String(){return Utils.Add_Commas_To_Number(this.Total_Part_Count())}Language_Part_Count(t){return 0,this.language_part_counts[t]}Language_Part_Percent(t){return Math.round(100*this.Language_Part_Count(t)/this.Total_Part_Count())}Language_Part_Counts(){const t=[];for(const _ of this.unique_language_names)t.push([_,this.Language_Part_Count(_)]);return t}Language_Part_Counts_And_Percents(){const t=[];for(const _ of this.unique_language_names)t.push([_,this.Language_Part_Count(_),this.Language_Part_Percent(_)]);return t}Increment_Part_Count(t,_){this.Has_Unique_Language_Name(t)||this.Add_Unique_Language_Name(t),0,0,this.total_part_count+=_,this.language_part_counts[t]+=_}Increment_Part_Counts(t){for(const[_,e]of t)this.Increment_Part_Count(_,e)}Total_Line_Count(){return this.total_line_count}Total_Line_Count_String(){return Utils.Add_Commas_To_Number(this.Total_Line_Count())}Language_Line_Count(t){return 0,this.language_line_counts[t]}Language_Line_Percent(t){return Math.round(100*this.Language_Line_Count(t)/this.Total_Line_Count())}Language_Line_Counts(){const t=[];for(const _ of this.unique_language_names)t.push([_,this.Language_Line_Count(_)]);return t}Language_Line_Counts_And_Percents(){const t=[];for(const _ of this.unique_language_names)t.push([_,this.Language_Line_Count(_),this.Language_Line_Percent(_)]);return t}Increment_Line_Count(t,_){this.Has_Unique_Language_Name(t)||this.Add_Unique_Language_Name(t),0,0,this.total_line_count+=_,this.language_line_counts[t]+=_}Increment_Line_Counts(t){for(const[_,e]of t)this.Increment_Line_Count(_,e)}Total_File_Count(){return this.total_file_count}Total_File_Count_String(){return Utils.Add_Commas_To_Number(this.Total_File_Count())}Language_File_Count(t){return 0,this.language_file_counts[t]}Language_File_Percent(t){return Math.round(100*this.Language_File_Count(t)/this.Total_File_Count())}Language_File_Counts(){const t=[];for(const _ of this.unique_language_names)t.push([_,this.Language_File_Count(_)]);return t}Language_File_Counts_And_Percents(){const t=[];for(const _ of this.unique_language_names)t.push([_,this.Language_File_Count(_),this.Language_File_Percent(_)]);return t}Increment_File_Count(t,_){this.Has_Unique_Language_Name(t)||this.Add_Unique_Language_Name(t),0,0,this.total_file_count+=_,this.language_file_counts[t]+=_}Increment_File_Counts(t){for(const[_,e]of t)this.Increment_File_Count(_,e)}Buffer_Counts(){return 0,this.buffer_counts}Update_Buffer_Counts(t){const _=t,e=this.buffer_counts,n=_.Line_Count();for(e[MAX_LINE_COUNT]<n&&(e[MAX_LINE_COUNT]=n),0,e[AVG_LINE_COUNT]+=n,e[FILE_COUNT]+=1;e[LINES].length<n;)e[LINES].push({[MAX_COLUMN_COUNT]:0,[AVG_COLUMN_COUNT]:0,[FILE_COUNT]:0,[COLUMNS]:[]});for(let t=0,a=n;t<a;t+=1){const n=_.Line(t),a=e[LINES][t],u=n.Column_Count();for(0,a[MAX_COLUMN_COUNT]<u&&(a[MAX_COLUMN_COUNT]=u),0,a[AVG_COLUMN_COUNT]+=u,a[FILE_COUNT]+=1;a[COLUMNS].length<u;)a[COLUMNS].push({[MAX_ROW_COUNT]:0,[AVG_ROW_COUNT]:0,[FILE_COUNT]:0,[MACRO_ROWS]:[],[MICRO_ROWS]:[]});for(let t=0,_=u;t<_;t+=1){const _=n.Column(t),e=a[COLUMNS][t],u=_.Row_Count();for(0,e[MAX_ROW_COUNT]<u&&(e[MAX_ROW_COUNT]=u),0,e[AVG_ROW_COUNT]+=u,e[FILE_COUNT]+=1;e[MACRO_ROWS].length<u;)e[MACRO_ROWS].push({[MAX_SEGMENT_COUNT]:0,[AVG_SEGMENT_COUNT]:0,[FILE_COUNT]:0,[SEGMENTS]:[]});for(;e[MICRO_ROWS].length<u;)e[MICRO_ROWS].push({[MAX_SEGMENT_COUNT]:0,[AVG_SEGMENT_COUNT]:0,[FILE_COUNT]:0,[SEGMENTS]:[]});for(let t=0,n=u;t<n;t+=1){const n=_.Row(t),a=e[MACRO_ROWS][t],u=n.Macro_Segment_Count();for(0,a[MAX_SEGMENT_COUNT]<u&&(a[MAX_SEGMENT_COUNT]=u),0,a[AVG_SEGMENT_COUNT]+=u,a[FILE_COUNT]+=1;a[SEGMENTS].length<u;)a[SEGMENTS].push({[MAX_ITEM_COUNT]:0,[AVG_ITEM_COUNT]:0,[FILE_COUNT]:0});for(let t=0,_=u;t<_;t+=1){const _=n.Macro_Segment(t),e=a[SEGMENTS][t],u=_.Item_Count();0,e[MAX_ITEM_COUNT]<u&&(e[MAX_ITEM_COUNT]=u),0,e[AVG_ITEM_COUNT]+=u,e[FILE_COUNT]+=1}const o=e[MICRO_ROWS][t],s=n.Micro_Segment_Count();for(0,o[MAX_SEGMENT_COUNT]<s&&(o[MAX_SEGMENT_COUNT]=s),0,o[AVG_SEGMENT_COUNT]+=s,o[FILE_COUNT]+=1;o[SEGMENTS].length<s;)o[SEGMENTS].push({[MAX_ITEM_COUNT]:0,[AVG_ITEM_COUNT]:0,[FILE_COUNT]:0});for(let t=0,_=s;t<_;t+=1){const _=n.Micro_Segment(t),e=o[SEGMENTS][t],a=_.Item_Count();0,e[MAX_ITEM_COUNT]<a&&(e[MAX_ITEM_COUNT]=a),0,e[AVG_ITEM_COUNT]+=a,e[FILE_COUNT]+=1}}}}}}