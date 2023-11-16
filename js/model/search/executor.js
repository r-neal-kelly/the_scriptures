import*as Utils from"../../utils.js";import*as Text from"../text.js";import{Sequence_Type}from"./sequence_type.js";import*as Parser from"./parser.js";import*as Compiler from"./compiler.js";import*as Node from"./node.js";import*as Result from"./result.js";const LINE_PATH_TYPE=Text.Path.Type.DEFAULT;export var Mode;!function(t){t[t.INITIAL=0]="INITIAL",t[t.NOT=1]="NOT",t[t.CASE=2]="CASE",t[t.ALIGN=4]="ALIGN",t[t.META=8]="META",t[t.COMPLEX_SEQUENCE=16]="COMPLEX_SEQUENCE"}(Mode||(Mode={}));export class Instance{constructor(){this.parser=new Parser.Instance,this.compiler=new Compiler.Instance}Execute(t,e){const n=this.parser.Parse(t,e.Dictionary());if(n instanceof Parser.Help)return n;{const t=this.compiler.Compile(n),_=[];for(let n=0,a=e.Line_Count();n<a;n+=1){const a=e.Line(n),r=this.Step(t,Mode.INITIAL,new Result.Instance(a));null!=r&&_.push(r)}return _}}Step(t,e,n){const _=t.Type();if(_===Node.Type.MAYBE_ONE||_===Node.Type.MAYBE_MANY||_===Node.Type.ONE_OR_MANY){const _=t,a=this.Step(_.Operand(),e,n.Copy());return null!=a?a:this.Step(_.Next(),e,n.Copy())}if(_===Node.Type.SEQUENCE){const _=t,a=_.Sequence_Type(),r=this.Step(_.Operand(),a===Sequence_Type.COMPLEX?e|Mode.COMPLEX_SEQUENCE:e,new Result.Instance(n.Line()));return null!=r?(r.Clear_Candidates(),a===Sequence_Type.COMPLEX?r.Match_Count()>0?this.Step(_.Next(),e,n.Combine(r)):null:this.Step(_.Next(),e,n.Combine(r))):null}if(_===Node.Type.NOT){const _=t,a=this.Step(_.Operand(),e^Mode.NOT,n);return null!=a?this.Step(_.Next(),e,a):null}if(_===Node.Type.CASE){const _=t,a=this.Step(_.Operand(),e^Mode.CASE,n);return null!=a?this.Step(_.Next(),e,a):null}if(_===Node.Type.ALIGN){const _=t,a=this.Step(_.Operand(),e^Mode.ALIGN,n);return null!=a?this.Step(_.Next(),e,a):null}if(_===Node.Type.META){const _=t,a=this.Step(_.Operand(),e^Mode.META,n);return null!=a?this.Step(_.Next(),e,a):null}if(_===Node.Type.XOR){if(e&Mode.NOT)return Mode.COMPLEX_SEQUENCE,0,null;{const _=t,a=this.Step(_.Left_Operand(),e,n.Copy()),r=this.Step(_.Right_Operand(),e,n.Copy());return null!=a?null!=r?null:a:null!=r?r:null}}if(_===Node.Type.OR){const _=t;if(e&Mode.NOT){if(e&Mode.COMPLEX_SEQUENCE){const t=this.Step(_.Left_Operand(),e,n.Copy()),a=this.Step(_.Right_Operand(),e,n.Copy());if(null!=t&&null!=a){const e=new Result.Instance(n.Line());for(let n=0,_=t.Candidate_Count();n<_;n+=1)a.Has_Candidate_Equal_To(t.Candidate(n))&&e.Try_Add_Candidate(t.Candidate(n));for(let n=0,_=t.Match_Count();n<_;n+=1)a.Has_Match_Equal_To(t.Match(n))&&e.Try_Add_Match(t.Match(n));return e}return null}return null!=this.Step(_.Left_Operand(),e,n)?this.Step(_.Right_Operand(),e,n):null}{const t=this.Step(_.Left_Operand(),e,n.Copy()),a=this.Step(_.Right_Operand(),e,n.Copy());return null!=t?null!=a?t.Combine(a):t:null!=a?a:null}}return _===Node.Type.CLASS?e&Mode.COMPLEX_SEQUENCE?this.Complex_Class(t,e,n):this.Class(t,e,n):_===Node.Type.TEXT?e&Mode.COMPLEX_SEQUENCE?this.Complex_Text(t,e,n):this.Text(t,e,n):_===Node.Type.END?n:(0,null)}Text(t,e,n){const _=[];for(;!(t instanceof Node.End);)_.push(t),t=t.Next();let a;if(1===_.length)a=this.Text_Any(_[0],e,n);else{a=this.Text_Start(_[0],e,n);for(let t=1,n=_.length-1;t<n&&null!=a;t+=1)a=this.Text_Middle(_[t],e,a);null!=a&&(a=this.Text_End(_[_.length-1],e,a))}return null!=a?this.Step(t,e,a):null}Text_Any(t,e,n){0;const _=n.Line(),a=t.Part(),r=e&Mode.CASE?a.Value():a.Value().toLowerCase(),i=new Result.Instance(n.Line());for(let t=0,n=_.Macro_Part_Count(LINE_PATH_TYPE);t<n;t+=1)if(e&Mode.META||!_.Macro_Part(t,LINE_PATH_TYPE).Is_Command_Or_Argument()){const n=_.Macro_Part(t,LINE_PATH_TYPE),a=e&Mode.CASE?n.Value():n.Value().toLowerCase();if(e&Mode.ALIGN)a===r&&i.Try_Add_Match(new Result.Match({first_part_index:t,end_part_index:t+1,first_part_first_unit_index:0,last_part_end_unit_index:a.length}));else for(let e=0,n=a.length-(r.length-1);e<n;e+=1)a.slice(e,e+r.length)===r&&i.Try_Add_Match(new Result.Match({first_part_index:t,end_part_index:t+1,first_part_first_unit_index:e,last_part_end_unit_index:e+r.length}))}return e&Mode.NOT?i.Match_Count()>0?null:i:i.Match_Count()>0?i:null}Text_Start(t,e,n){0;const _=n.Line(),a=t.Part(),r=e&Mode.CASE?a.Value():a.Value().toLowerCase(),i=new Result.Instance(n.Line());for(let t=0,n=_.Macro_Part_Count(LINE_PATH_TYPE);t<n;t+=1)if(e&Mode.META||!_.Macro_Part(t,LINE_PATH_TYPE).Is_Command_Or_Argument()){const n=_.Macro_Part(t,LINE_PATH_TYPE),a=e&Mode.CASE?n.Value():n.Value().toLowerCase();e&Mode.ALIGN?a===r&&i.Try_Add_Match(new Result.Match({first_part_index:t,end_part_index:t+1,first_part_first_unit_index:0,last_part_end_unit_index:a.length})):a.length>=r.length&&a.slice(a.length-r.length,a.length)===r&&i.Try_Add_Match(new Result.Match({first_part_index:t,end_part_index:t+1,first_part_first_unit_index:a.length-r.length,last_part_end_unit_index:a.length}))}return e&Mode.NOT||i.Match_Count()>0?i:null}Text_Middle(t,e,n){const _=n.Line(),a=t.Part(),r=e&Mode.CASE?a.Value():a.Value().toLowerCase(),i=new Result.Instance(n.Line());for(let t=0,a=n.Match_Count();t<a;t+=1){const a=n.Match(t);let s=a.End_Part_Index();const d=_.Macro_Part(s-1,LINE_PATH_TYPE),l=e&Mode.CASE?d.Value():d.Value().toLowerCase();if(a.Last_Part_End_Unit_Index()===l.length){const t=_.Macro_Part_Count(LINE_PATH_TYPE);let n=0;if(!(e&Mode.META))for(;s+n<t&&_.Macro_Part(s+n,LINE_PATH_TYPE).Is_Command_Or_Argument();)n+=1;if(s+n<t){const t=_.Macro_Part(s+n,LINE_PATH_TYPE),d=e&Mode.CASE?t.Value():t.Value().toLowerCase();d===r&&i.Try_Add_Match(new Result.Match({first_part_index:a.First_Part_Index(),end_part_index:s+n+1,first_part_first_unit_index:a.First_Part_First_Unit_Index(),last_part_end_unit_index:d.length}))}}}return e&Mode.NOT||i.Match_Count()>0?i:null}Text_End(t,e,n){const _=n.Line(),a=t.Part(),r=e&Mode.CASE?a.Value():a.Value().toLowerCase(),i=new Result.Instance(n.Line());for(let t=0,a=n.Match_Count();t<a;t+=1){const a=n.Match(t);let s=a.End_Part_Index();const d=_.Macro_Part(s-1,LINE_PATH_TYPE),l=e&Mode.CASE?d.Value():d.Value().toLowerCase();if(a.Last_Part_End_Unit_Index()===l.length){const t=_.Macro_Part_Count(LINE_PATH_TYPE);let n=0;if(!(e&Mode.META))for(;s+n<t&&_.Macro_Part(s+n,LINE_PATH_TYPE).Is_Command_Or_Argument();)n+=1;if(s+n<t){const t=_.Macro_Part(s+n,LINE_PATH_TYPE),d=e&Mode.CASE?t.Value():t.Value().toLowerCase();e&Mode.ALIGN?d===r&&i.Try_Add_Match(new Result.Match({first_part_index:a.First_Part_Index(),end_part_index:s+n+1,first_part_first_unit_index:a.First_Part_First_Unit_Index(),last_part_end_unit_index:d.length})):d.length>=r.length&&d.slice(0,r.length)===r&&i.Try_Add_Match(new Result.Match({first_part_index:a.First_Part_Index(),end_part_index:s+n+1,first_part_first_unit_index:a.First_Part_First_Unit_Index(),last_part_end_unit_index:r.length}))}}}return e&Mode.NOT?i.Match_Count()>0?null:i:i.Match_Count()>0?i:null}Complex_Text(t,e,n){const _=t;if(0===n.Candidate_Count()&&0===n.Match_Count()){const t=this.Complex_Text_Any(_,e,n),a=this.Complex_Text_Start(_,e,n);return null!=t?null!=a?this.Step(_.Next(),e,t.Combine(a)):this.Step(_.Next(),e,t):null!=a?this.Step(_.Next(),e,a):null}{const t=this.Complex_Text_Middle(_,e,n),a=this.Complex_Text_End(_,e,n);return null!=t?null!=a?this.Step(_.Next(),e,t.Combine(a)):this.Step(_.Next(),e,t):null!=a?this.Step(_.Next(),e,a):null}}Complex_Text_Any(t,e,n){0,0;const _=n.Line(),a=t.Part(),r=e&Mode.CASE?a.Value():a.Value().toLowerCase(),i=new Result.Instance(n.Line());for(let t=0,n=_.Macro_Part_Count(LINE_PATH_TYPE);t<n;t+=1)if(e&Mode.META||!_.Macro_Part(t,LINE_PATH_TYPE).Is_Command_Or_Argument()){const n=_.Macro_Part(t,LINE_PATH_TYPE),a=e&Mode.CASE?n.Value():n.Value().toLowerCase();if(e&Mode.ALIGN)e&Mode.NOT?a!==r&&i.Try_Add_Match(new Result.Match({first_part_index:t,end_part_index:t+1,first_part_first_unit_index:0,last_part_end_unit_index:a.length})):a===r&&i.Try_Add_Match(new Result.Match({first_part_index:t,end_part_index:t+1,first_part_first_unit_index:0,last_part_end_unit_index:a.length}));else{const n=[];for(let t=0,e=a.length-(r.length-1);t<e;t+=1)a.slice(t,t+r.length)===r&&n.push(t);if(e&Mode.NOT)0===n.length&&i.Try_Add_Match(new Result.Match({first_part_index:t,end_part_index:t+1,first_part_first_unit_index:0,last_part_end_unit_index:a.length}));else for(const e of n)i.Try_Add_Match(new Result.Match({first_part_index:t,end_part_index:t+1,first_part_first_unit_index:e,last_part_end_unit_index:e+r.length}))}}return i.Match_Count()>0?i:null}Complex_Text_Start(t,e,n){0,0;const _=n.Line(),a=t.Part(),r=e&Mode.CASE?a.Value():a.Value().toLowerCase(),i=new Result.Instance(n.Line());for(let t=0,n=_.Macro_Part_Count(LINE_PATH_TYPE);t<n;t+=1)if(e&Mode.META||!_.Macro_Part(t,LINE_PATH_TYPE).Is_Command_Or_Argument()){const n=_.Macro_Part(t,LINE_PATH_TYPE),a=e&Mode.CASE?n.Value():n.Value().toLowerCase();e&Mode.ALIGN?e&Mode.NOT?a!==r&&i.Try_Add_Candidate(new Result.Match({first_part_index:t,end_part_index:t+1,first_part_first_unit_index:0,last_part_end_unit_index:a.length})):a===r&&i.Try_Add_Candidate(new Result.Match({first_part_index:t,end_part_index:t+1,first_part_first_unit_index:0,last_part_end_unit_index:a.length})):e&Mode.NOT?(a.length<r.length||a.slice(a.length-r.length,a.length)!==r)&&i.Try_Add_Candidate(new Result.Match({first_part_index:t,end_part_index:t+1,first_part_first_unit_index:0,last_part_end_unit_index:a.length})):a.length>=r.length&&a.slice(a.length-r.length,a.length)===r&&i.Try_Add_Candidate(new Result.Match({first_part_index:t,end_part_index:t+1,first_part_first_unit_index:a.length-r.length,last_part_end_unit_index:a.length}))}return i.Candidate_Count()>0?i:null}Complex_Text_Middle(t,e,n){const _=n.Line(),a=t.Part(),r=e&Mode.CASE?a.Value():a.Value().toLowerCase(),i=new Result.Instance(n.Line());for(let t=0,a=n.Candidate_Count();t<a;t+=1){const a=n.Candidate(t);let s=a.End_Part_Index();const d=_.Macro_Part(s-1,LINE_PATH_TYPE),l=e&Mode.CASE?d.Value():d.Value().toLowerCase();if(a.Last_Part_End_Unit_Index()===l.length){const t=_.Macro_Part_Count(LINE_PATH_TYPE);let n=0;if(!(e&Mode.META))for(;s+n<t&&_.Macro_Part(s+n,LINE_PATH_TYPE).Is_Command_Or_Argument();)n+=1;if(s+n<t){const t=_.Macro_Part(s+n,LINE_PATH_TYPE),d=e&Mode.CASE?t.Value():t.Value().toLowerCase();e&Mode.NOT?d!==r&&i.Try_Add_Candidate(new Result.Match({first_part_index:a.First_Part_Index(),end_part_index:s+n+1,first_part_first_unit_index:a.First_Part_First_Unit_Index(),last_part_end_unit_index:d.length})):d===r&&i.Try_Add_Candidate(new Result.Match({first_part_index:a.First_Part_Index(),end_part_index:s+n+1,first_part_first_unit_index:a.First_Part_First_Unit_Index(),last_part_end_unit_index:d.length}))}}}return i.Candidate_Count()>0?i:null}Complex_Text_End(t,e,n){const _=n.Line(),a=t.Part(),r=e&Mode.CASE?a.Value():a.Value().toLowerCase(),i=new Result.Instance(n.Line());for(let t=0,a=n.Candidate_Count();t<a;t+=1){const a=n.Candidate(t);let s=a.End_Part_Index();const d=_.Macro_Part(s-1,LINE_PATH_TYPE),l=e&Mode.CASE?d.Value():d.Value().toLowerCase();if(a.Last_Part_End_Unit_Index()===l.length){const t=_.Macro_Part_Count(LINE_PATH_TYPE);let n=0;if(!(e&Mode.META))for(;s+n<t&&_.Macro_Part(s+n,LINE_PATH_TYPE).Is_Command_Or_Argument();)n+=1;if(s+n<t){const t=_.Macro_Part(s+n,LINE_PATH_TYPE),d=e&Mode.CASE?t.Value():t.Value().toLowerCase();e&Mode.ALIGN?e&Mode.NOT?d!==r&&i.Try_Add_Match(new Result.Match({first_part_index:a.First_Part_Index(),end_part_index:s+n+1,first_part_first_unit_index:a.First_Part_First_Unit_Index(),last_part_end_unit_index:d.length})):d===r&&i.Try_Add_Match(new Result.Match({first_part_index:a.First_Part_Index(),end_part_index:s+n+1,first_part_first_unit_index:a.First_Part_First_Unit_Index(),last_part_end_unit_index:d.length})):e&Mode.NOT?(d.length<r.length||d.slice(0,r.length)!==r)&&i.Try_Add_Match(new Result.Match({first_part_index:a.First_Part_Index(),end_part_index:s+n+1,first_part_first_unit_index:a.First_Part_First_Unit_Index(),last_part_end_unit_index:d.length})):d.length>=r.length&&d.slice(0,r.length)===r&&i.Try_Add_Match(new Result.Match({first_part_index:a.First_Part_Index(),end_part_index:s+n+1,first_part_first_unit_index:a.First_Part_First_Unit_Index(),last_part_end_unit_index:r.length}))}}}return i.Match_Count()>0?i:null}Class(t,e,n){const _=t;if(0===n.Match_Count()){const t=this.Class_Any_Or_Start(_,e,n);return null!=t?this.Step(_.Next(),e,t):null}{const t=this.Class_Middle_Or_End(_,e,n);return null!=t?this.Step(_.Next(),e,t):null}}Class_Any_Or_Start(t,e,n){0;const _=n.Line(),a=new Result.Instance(n.Line());for(let n=0,r=_.Macro_Part_Count(LINE_PATH_TYPE);n<r;n+=1)if(e&Mode.META||!_.Macro_Part(n,LINE_PATH_TYPE).Is_Command_Or_Argument()){const r=_.Macro_Part(n,LINE_PATH_TYPE),i=e&Mode.CASE?r.Value():r.Value().toLowerCase();t.Recognizes(r)&&a.Try_Add_Match(new Result.Match({first_part_index:n,end_part_index:n+1,first_part_first_unit_index:0,last_part_end_unit_index:i.length}))}return e&Mode.NOT?a.Match_Count()>0?null:a:a.Match_Count()>0?a:null}Class_Middle_Or_End(t,e,n){const _=n.Line(),a=new Result.Instance(n.Line());for(let r=0,i=n.Match_Count();r<i;r+=1){const i=n.Match(r);let s=i.End_Part_Index();const d=_.Macro_Part(s-1,LINE_PATH_TYPE),l=e&Mode.CASE?d.Value():d.Value().toLowerCase();if(i.Last_Part_End_Unit_Index()===l.length){const n=_.Macro_Part_Count(LINE_PATH_TYPE);let r=0;if(!(e&Mode.META))for(;s+r<n&&_.Macro_Part(s+r,LINE_PATH_TYPE).Is_Command_Or_Argument();)r+=1;if(s+r<n){const n=_.Macro_Part(s+r,LINE_PATH_TYPE),d=e&Mode.CASE?n.Value():n.Value().toLowerCase();t.Recognizes(n)&&a.Try_Add_Match(new Result.Match({first_part_index:i.First_Part_Index(),end_part_index:s+r+1,first_part_first_unit_index:i.First_Part_First_Unit_Index(),last_part_end_unit_index:d.length}))}}}return e&Mode.NOT?a.Match_Count()>0?null:a:a.Match_Count()>0?a:null}Complex_Class(t,e,n){const _=t;if(0===n.Candidate_Count()&&0===n.Match_Count()){const t=this.Complex_Class_Any(_,e,n),a=this.Complex_Class_Start(_,e,n);return null!=t?null!=a?this.Step(_.Next(),e,t.Combine(a)):this.Step(_.Next(),e,t):null!=a?this.Step(_.Next(),e,a):null}{const t=this.Complex_Class_Middle(_,e,n),a=this.Complex_Class_End(_,e,n);return null!=t?null!=a?this.Step(_.Next(),e,t.Combine(a)):this.Step(_.Next(),e,t):null!=a?this.Step(_.Next(),e,a):null}}Complex_Class_Any(t,e,n){0,0;const _=n.Line(),a=new Result.Instance(n.Line());for(let n=0,r=_.Macro_Part_Count(LINE_PATH_TYPE);n<r;n+=1)if(e&Mode.META||!_.Macro_Part(n,LINE_PATH_TYPE).Is_Command_Or_Argument()){const r=_.Macro_Part(n,LINE_PATH_TYPE),i=e&Mode.CASE?r.Value():r.Value().toLowerCase();e&Mode.NOT?t.Recognizes(r)||a.Try_Add_Match(new Result.Match({first_part_index:n,end_part_index:n+1,first_part_first_unit_index:0,last_part_end_unit_index:i.length})):t.Recognizes(r)&&a.Try_Add_Match(new Result.Match({first_part_index:n,end_part_index:n+1,first_part_first_unit_index:0,last_part_end_unit_index:i.length}))}return a.Match_Count()>0?a:null}Complex_Class_Start(t,e,n){0,0;const _=n.Line(),a=new Result.Instance(n.Line());for(let n=0,r=_.Macro_Part_Count(LINE_PATH_TYPE);n<r;n+=1)if(e&Mode.META||!_.Macro_Part(n,LINE_PATH_TYPE).Is_Command_Or_Argument()){const r=_.Macro_Part(n,LINE_PATH_TYPE),i=e&Mode.CASE?r.Value():r.Value().toLowerCase();e&Mode.NOT?t.Recognizes(r)||a.Try_Add_Candidate(new Result.Match({first_part_index:n,end_part_index:n+1,first_part_first_unit_index:0,last_part_end_unit_index:i.length})):t.Recognizes(r)&&a.Try_Add_Candidate(new Result.Match({first_part_index:n,end_part_index:n+1,first_part_first_unit_index:0,last_part_end_unit_index:i.length}))}return a.Candidate_Count()>0?a:null}Complex_Class_Middle(t,e,n){const _=n.Line(),a=new Result.Instance(n.Line());for(let r=0,i=n.Candidate_Count();r<i;r+=1){const i=n.Candidate(r);let s=i.End_Part_Index();const d=_.Macro_Part(s-1,LINE_PATH_TYPE),l=e&Mode.CASE?d.Value():d.Value().toLowerCase();if(i.Last_Part_End_Unit_Index()===l.length){const n=_.Macro_Part_Count(LINE_PATH_TYPE);let r=0;if(!(e&Mode.META))for(;s+r<n&&_.Macro_Part(s+r,LINE_PATH_TYPE).Is_Command_Or_Argument();)r+=1;if(s+r<n){const n=_.Macro_Part(s+r,LINE_PATH_TYPE),d=e&Mode.CASE?n.Value():n.Value().toLowerCase();e&Mode.NOT?t.Recognizes(n)||a.Try_Add_Candidate(new Result.Match({first_part_index:i.First_Part_Index(),end_part_index:s+r+1,first_part_first_unit_index:i.First_Part_First_Unit_Index(),last_part_end_unit_index:d.length})):t.Recognizes(n)&&a.Try_Add_Candidate(new Result.Match({first_part_index:i.First_Part_Index(),end_part_index:s+r+1,first_part_first_unit_index:i.First_Part_First_Unit_Index(),last_part_end_unit_index:d.length}))}}}return a.Candidate_Count()>0?a:null}Complex_Class_End(t,e,n){const _=n.Line(),a=new Result.Instance(n.Line());for(let r=0,i=n.Candidate_Count();r<i;r+=1){const i=n.Candidate(r);let s=i.End_Part_Index();const d=_.Macro_Part(s-1,LINE_PATH_TYPE),l=e&Mode.CASE?d.Value():d.Value().toLowerCase();if(i.Last_Part_End_Unit_Index()===l.length){const n=_.Macro_Part_Count(LINE_PATH_TYPE);let r=0;if(!(e&Mode.META))for(;s+r<n&&_.Macro_Part(s+r,LINE_PATH_TYPE).Is_Command_Or_Argument();)r+=1;if(s+r<n){const n=_.Macro_Part(s+r,LINE_PATH_TYPE),d=e&Mode.CASE?n.Value():n.Value().toLowerCase();e&Mode.NOT?t.Recognizes(n)||a.Try_Add_Match(new Result.Match({first_part_index:i.First_Part_Index(),end_part_index:s+r+1,first_part_first_unit_index:i.First_Part_First_Unit_Index(),last_part_end_unit_index:d.length})):t.Recognizes(n)&&a.Try_Add_Match(new Result.Match({first_part_index:i.First_Part_Index(),end_part_index:s+r+1,first_part_first_unit_index:i.First_Part_First_Unit_Index(),last_part_end_unit_index:d.length}))}}}return a.Match_Count()>0?a:null}}