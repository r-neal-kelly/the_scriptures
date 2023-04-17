import*as Utils from"../../utils.js";import{Boundary}from"./boundary.js";import*as Parser from"./parser.js";import*as Compiler from"./compiler.js";import*as Node from"./node.js";import*as Result from"./result.js";export var Mode;!function(t){t[t.INITIAL=0]="INITIAL",t[t.COMPLEX=1]="COMPLEX",t[t.NOT=2]="NOT",t[t.CASE=4]="CASE",t[t.ALIGN=8]="ALIGN",t[t.META=16]="META"}(Mode||(Mode={}));export class Instance{constructor(){this.parser=new Parser.Instance,this.compiler=new Compiler.Instance}Execute(t,e){const n=this.parser.Parse(t,e.Dictionary());if(n instanceof Parser.Help)return n;{const t=this.compiler.Compile(n),_=[];for(let n=0,r=e.Line_Count();n<r;n+=1){const r=e.Line(n),i=this.Step(t,Mode.INITIAL,new Result.Instance(r));null!=i&&_.push(i)}return _}}Step(t,e,n){const _=t.Type();if(_===Node.Type.MAYBE_ONE||_===Node.Type.MAYBE_MANY||_===Node.Type.ONE_OR_MANY){const _=t,r=this.Step(_.Next(),e,n.Copy()),i=this.Step(_.Operand(),e,n.Copy());return null!=r?null!=i?r.Combine(i):r:null!=i?i:null}if(_===Node.Type.SEQUENCE){const _=t,r=this.Step(_.Operand(),_.Is_Complex()?e|Mode.COMPLEX:e,new Result.Instance(n.Line()));return null!=r?this.Step(_.Next(),e,n.Combine(r)):null}if(_===Node.Type.NOT){const _=t,r=this.Step(_.Operand(),e^Mode.NOT,n);return null!=r?this.Step(_.Next(),e,r):null}if(_===Node.Type.CASE){const _=t,r=this.Step(_.Operand(),e^Mode.CASE,n);return null!=r?this.Step(_.Next(),e,r):null}if(_===Node.Type.ALIGN){const _=t,r=this.Step(_.Operand(),e^Mode.ALIGN,n);return null!=r?this.Step(_.Next(),e,r):null}if(_===Node.Type.META){const _=t,r=this.Step(_.Operand(),e^Mode.META,n);return null!=r?this.Step(_.Next(),e,r):null}if(_===Node.Type.XOR){const _=t,r=this.Step(_.Left_Operand(),e,n.Copy()),i=this.Step(_.Right_Operand(),e,n.Copy());return null!=r?null!=i?null:r:null!=i?i:null}if(_===Node.Type.OR){const _=t,r=this.Step(_.Left_Operand(),e,n.Copy()),i=this.Step(_.Right_Operand(),e,n.Copy());return null!=r?null!=i?r.Combine(i):r:null!=i?i:null}if(_===Node.Type.TEXT){const _=t,r=this.Text(_,e,n);return null!=r?this.Step(_.Next(),e,r):null}return _===Node.Type.END?n:(Utils.Assert(!1,`Unknown node_type: ${_}`),null)}Text(t,e,n){const _=n.Line(),r=t.Part(),i=t.Boundary(),a=e&Mode.CASE?r.Value():r.Value().toLowerCase();if(i===Boundary.START){for(let t=0,r=_.Macro_Part_Count();t<r;t+=1)if(e&Mode.META||!_.Macro_Part(t).Is_Command()){const r=_.Macro_Part(t),i=e&Mode.CASE?r.Value():r.Value().toLowerCase();if(e&Mode.ALIGN)e&Mode.COMPLEX&&e&Mode.NOT?i!==a&&n.Try_Add_Match(new Result.Match({first_part_index:t,end_part_index:t+1,first_part_first_unit_index:0,last_part_end_unit_index:i.length})):i===a&&n.Try_Add_Match(new Result.Match({first_part_index:t,end_part_index:t+1,first_part_first_unit_index:0,last_part_end_unit_index:i.length}));else if(e&Mode.COMPLEX&&e&Mode.NOT&&(i.length<a.length||i.slice(i.length-a.length,i.length)!==a))n.Try_Add_Match(new Result.Match({first_part_index:t,end_part_index:t+1,first_part_first_unit_index:0,last_part_end_unit_index:i.length}));else if(i.length>=a.length&&i.slice(i.length-a.length,i.length)===a){let e=i.length-a.length;for(let t=e,n=0;t>n+(a.length-1)&&i.slice(t-a.length,t)===a;)t-=a.length,e=t;n.Try_Add_Match(new Result.Match({first_part_index:t,end_part_index:t+1,first_part_first_unit_index:e,last_part_end_unit_index:i.length}))}}return e&Mode.COMPLEX?n.Match_Count()>0?n:null:e&Mode.NOT||n.Match_Count()>0?n:null}if(i===Boundary.MIDDLE){const t=new Result.Instance(n.Line());for(let r=0,i=n.Match_Count();r<i;r+=1){const i=n.Match(r);let d=i.End_Part_Index();const l=_.Macro_Part_Count();let s=0;if(!(e&Mode.META))for(;d+s<l&&_.Macro_Part(d+s).Is_Command();)s+=1;if(d+s<l){const n=_.Macro_Part(d+s),r=e&Mode.CASE?n.Value():n.Value().toLowerCase();e&Mode.COMPLEX&&e&Mode.NOT?r!==a&&t.Try_Add_Match(new Result.Match({first_part_index:i.First_Part_Index(),end_part_index:d+s+1,first_part_first_unit_index:i.First_Part_First_Unit_Index(),last_part_end_unit_index:r.length})):r===a&&t.Try_Add_Match(new Result.Match({first_part_index:i.First_Part_Index(),end_part_index:d+s+1,first_part_first_unit_index:i.First_Part_First_Unit_Index(),last_part_end_unit_index:r.length}))}}return e&Mode.COMPLEX?t.Match_Count()>0?t:null:e&Mode.NOT||t.Match_Count()>0?t:null}if(i===Boundary.END){const t=new Result.Instance(n.Line());for(let r=0,i=n.Match_Count();r<i;r+=1){const i=n.Match(r);let d=i.End_Part_Index();const l=_.Macro_Part_Count();let s=0;if(!(e&Mode.META))for(;d+s<l&&_.Macro_Part(d+s).Is_Command();)s+=1;if(d+s<l){const n=_.Macro_Part(d+s),r=e&Mode.CASE?n.Value():n.Value().toLowerCase();if(e&Mode.ALIGN)e&Mode.COMPLEX&&e&Mode.NOT?r!==a&&t.Try_Add_Match(new Result.Match({first_part_index:i.First_Part_Index(),end_part_index:d+s+1,first_part_first_unit_index:i.First_Part_First_Unit_Index(),last_part_end_unit_index:r.length})):r===a&&t.Try_Add_Match(new Result.Match({first_part_index:i.First_Part_Index(),end_part_index:d+s+1,first_part_first_unit_index:i.First_Part_First_Unit_Index(),last_part_end_unit_index:r.length}));else if(e&Mode.COMPLEX&&e&Mode.NOT&&(r.length<a.length||r.slice(0,a.length)!==a))t.Try_Add_Match(new Result.Match({first_part_index:i.First_Part_Index(),end_part_index:d+s+1,first_part_first_unit_index:i.First_Part_First_Unit_Index(),last_part_end_unit_index:r.length}));else if(r.length>=a.length&&r.slice(0,a.length)===a){let e=a.length;for(let t=e,n=r.length;t<n-(a.length-1)&&r.slice(t,t+a.length)===a;)t+=a.length,e=t;t.Try_Add_Match(new Result.Match({first_part_index:i.First_Part_Index(),end_part_index:d+s+1,first_part_first_unit_index:i.First_Part_First_Unit_Index(),last_part_end_unit_index:e}))}}}return e&Mode.COMPLEX?t.Match_Count()>0?t:null:e&Mode.NOT?t.Match_Count()>0?null:t:t.Match_Count()>0?t:null}if(i===Boundary.ANY){for(let t=0,r=_.Macro_Part_Count();t<r;t+=1)if(e&Mode.META||!_.Macro_Part(t).Is_Command()){const r=_.Macro_Part(t),i=e&Mode.CASE?r.Value():r.Value().toLowerCase();if(e&Mode.ALIGN)e&Mode.COMPLEX&&e&Mode.NOT?i!==a&&n.Try_Add_Match(new Result.Match({first_part_index:t,end_part_index:t+1,first_part_first_unit_index:0,last_part_end_unit_index:i.length})):i===a&&n.Try_Add_Match(new Result.Match({first_part_index:t,end_part_index:t+1,first_part_first_unit_index:0,last_part_end_unit_index:i.length}));else{let _=!1,r=0,d=0;for(let t=0,e=i.length;t<e-(a.length-1);)if(_){if(i.slice(t,t+a.length)!==a)break;t+=a.length,d=t}else i.slice(t,t+a.length)===a?(_=!0,r=t,t+=a.length,d=t):t+=1;e&Mode.COMPLEX&&e&Mode.NOT?_||n.Try_Add_Match(new Result.Match({first_part_index:t,end_part_index:t+1,first_part_first_unit_index:0,last_part_end_unit_index:i.length})):_&&n.Try_Add_Match(new Result.Match({first_part_index:t,end_part_index:t+1,first_part_first_unit_index:r,last_part_end_unit_index:d}))}}return e&Mode.COMPLEX?n.Match_Count()>0?n:null:e&Mode.NOT?n.Match_Count()>0?null:n:n.Match_Count()>0?n:null}return Utils.Assert(!1,"Unknown text boundary."),null}}