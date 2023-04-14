import*as Utils from"../../utils.js";import*as Node from"./node.js";import*as Result from"./result.js";export var Mode;!function(e){e[e.INITIAL=0]="INITIAL",e[e.SEQUENCED=1]="SEQUENCED",e[e.NEGATED=2]="NEGATED",e[e.CASED=4]="CASED",e[e.ALIGNED=8]="ALIGNED"}(Mode||(Mode={}));export class Instance{constructor(){}Execute(e,t){const n=[];for(let d=0,s=t.Line_Count();d<s;d+=1){const s=t.Line(d),r=this.Step(e,Mode.INITIAL,new Result.Instance(s));null!=r&&n.push(r)}return n}Step(e,t,n){const d=e.Type();if(d===Node.Type.SEQUENCE){const d=e,s=this.Step(d.Operand(),t|Mode.SEQUENCED,new Result.Instance(n.Line()));return null!=s?this.Step(d.Next(),t,n.Combine(s)):null}if(d===Node.Type.NOT){const d=e,s=this.Step(d.Operand(),t^Mode.NEGATED,n);return null!=s?this.Step(d.Next(),t,s):null}if(d===Node.Type.CASE){const d=e,s=this.Step(d.Operand(),t^Mode.CASED,n);return null!=s?this.Step(d.Next(),t,s):null}if(d===Node.Type.ALIGN){const d=e,s=this.Step(d.Operand(),t^Mode.ALIGNED,n);return null!=s?this.Step(d.Next(),t,s):null}if(d===Node.Type.XOR){const d=e,s=this.Step(d.Left_Operand(),t,n.Copy()),r=this.Step(d.Right_Operand(),t,n.Copy());return null!=s?null!=r?null:s:null!=r?r:null}if(d===Node.Type.OR){const d=e,s=this.Step(d.Left_Operand(),t,n.Copy()),r=this.Step(d.Right_Operand(),t,n.Copy());return null!=s?null!=r?s.Combine(r):s:null!=r?r:null}if(d===Node.Type.TEXT){const d=e;let s;return s=t&Mode.SEQUENCED?t&Mode.NEGATED?t&Mode.CASED?t&Mode.ALIGNED?this.Sequenced_Negated_Cased_Aligned_Text(d,n):this.Sequenced_Negated_Cased_Text(d,n):t&Mode.ALIGNED?this.Sequenced_Negated_Aligned_Text(d,n):this.Sequenced_Negated_Text(d,n):t&Mode.CASED?t&Mode.ALIGNED?this.Sequenced_Cased_Aligned_Text(d,n):this.Sequenced_Cased_Text(d,n):t&Mode.ALIGNED?this.Sequenced_Aligned_Text(d,n):this.Sequenced_Text(d,n):t&Mode.NEGATED?t&Mode.CASED?t&Mode.ALIGNED?this.Negated_Cased_Aligned_Text(d,n):this.Negated_Cased_Text(d,n):t&Mode.ALIGNED?this.Negated_Aligned_Text(d,n):this.Negated_Text(d,n):t&Mode.CASED?t&Mode.ALIGNED?this.Cased_Aligned_Text(d,n):this.Cased_Text(d,n):t&Mode.ALIGNED?this.Aligned_Text(d,n):this.Text(d,n),null!=s?this.Step(d.Next(),t,s):null}return d===Node.Type.END?n:(Utils.Assert(!1,`Unknown node_type: ${d}`),null)}Sequenced_Negated_Cased_Aligned_Text(e,t){return t}Sequenced_Negated_Cased_Text(e,t){return t}Sequenced_Negated_Aligned_Text(e,t){return t}Sequenced_Negated_Text(e,t){return t}Sequenced_Cased_Aligned_Text(e,t){return t}Sequenced_Cased_Text(e,t){return t}Sequenced_Aligned_Text(e,t){return t}Sequenced_Text(e,t){return t}Negated_Cased_Aligned_Text(e,t){return t}Negated_Cased_Text(e,t){return t}Negated_Aligned_Text(e,t){return t}Negated_Text(e,t){return t}Cased_Aligned_Text(e,t){return t}Cased_Text(e,t){return t}Aligned_Text(e,t){return t}Text(e,t){t.Line().Text().Dictionary();return t}}