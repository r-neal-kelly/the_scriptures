import*as Unicode from"../../unicode.js";import*as Text from"../text.js";import{Operator}from"./operator.js";import{Operand}from"./operand.js";import{Sequence_Type}from"./sequence_type.js";import*as Class from"./class.js";import*as Token from"./token.js";const LINE_PATH_TYPE=Text.Path.Type.DEFAULT;export class Help{constructor(e,r){this.message=e.replace(/\r?\n/g," ").replace(/\s+/g," "),this.expression_index=r}Message(){return this.message}Expression_Index(){return this.expression_index}}export class Instance{constructor(){}Parse(e,r){const n=[];let p=0,t=0,O=0,o=0,a=!1;function T(){return n.length>0?n[n.length-1]:null}function E(){const e=T();null==e||e.Type()!==Token.Type.MAYBE_ONE&&e.Type()!==Token.Type.MAYBE_MANY&&e.Type()!==Token.Type.ONE_OR_MANY&&e.Type()!==Token.Type.CLOSE_GROUP&&e.Type()!==Token.Type.CLOSE_SEQUENCE&&e.Type()!==Token.Type.CLASS&&e.Type()!==Token.Type.TEXT||(O>0&&(a=!0),n.push(new Token.And))}function l(e){if(O<1){O+=1,n.push(new Token.Open_Sequence);for(let r=0,p=e.Line(0).Macro_Part_Count(LINE_PATH_TYPE);r<p;r+=1)n.push(new Token.Text({part:e.Line(0).Macro_Part(r,LINE_PATH_TYPE)})),r<p-1&&n.push(new Token.And);O-=1,n.push(new Token.Close_Sequence({sequence_type:Sequence_Type.SIMPLE}))}else{const r=e.Line(0).Macro_Part_Count(LINE_PATH_TYPE),p=r>1||a;p&&(t+=1,n.push(new Token.Open_Group));for(let p=0,t=r;p<t;p+=1)n.push(new Token.Text({part:e.Line(0).Macro_Part(p,LINE_PATH_TYPE)})),p<t-1&&(a=!0,n.push(new Token.And));p&&(t-=1,n.push(new Token.Close_Group))}}let i=new Unicode.Iterator({text:e});for(;!i.Is_At_End();i=i.Next()){const y=i.Point();if(!/\s/.test(y))if(y===Operator.VERBATIM){if(E(),i=i.Next(),i.Is_At_End())return new Help(`Unclosed ${Operator.VERBATIM}`,i.Previous().Index());{const n=i;for(;!i.Is_At_End()&&i.Point()!==Operator.VERBATIM;i=i.Next());if(i.Is_At_End())return new Help(`Unclosed ${Operator.VERBATIM}`,i.Previous().Index());{const t=new Text.Instance({dictionary:r,value:e.slice(n.Index(),i.Index())});if(t.Line_Count()>1)return new Help(`Newline inside ${Operator.VERBATIM}`,i.Index());if(0===t.Line(0).Macro_Part_Count(LINE_PATH_TYPE))return new Help(`Empty ${Operator.VERBATIM}`,i.Index());p=i.Index(),l(t)}}}else if(y===Operator.MAYBE_ONE){if(O<1)return new Help(`Invalid ${Operator.MAYBE_ONE} outside sequence`,i.Index());{const e=T();if(null==e)return new Help(`Invalid ${Operator.MAYBE_ONE} at beginning`,i.Index());if(e.Type()===Token.Type.MAYBE_ONE)return new Help(`Invalid ${Operator.MAYBE_ONE} after ${Operator.MAYBE_ONE}`,p);if(e.Type()===Token.Type.MAYBE_MANY)return new Help(`Invalid ${Operator.MAYBE_ONE} after ${Operator.MAYBE_MANY}`,p);if(e.Type()===Token.Type.ONE_OR_MANY)return new Help(`Invalid ${Operator.MAYBE_ONE} after ${Operator.ONE_OR_MANY}`,p);if(e.Type()===Token.Type.OPEN_GROUP)return new Help(`Invalid ${Operator.MAYBE_ONE} after ${Operator.OPEN_GROUP}`,p);if(e.Type()===Token.Type.OPEN_SEQUENCE)return new Help(`Invalid ${Operator.MAYBE_ONE} after ${Operator.OPEN_SEQUENCE}`,p);if(e.Type()===Token.Type.NOT)return new Help(`Invalid ${Operator.MAYBE_ONE} after ${Operator.NOT}`,p);if(e.Type()===Token.Type.CASE)return new Help(`Invalid ${Operator.MAYBE_ONE} after ${Operator.CASE}`,p);if(e.Type()===Token.Type.ALIGN)return new Help(`Invalid ${Operator.MAYBE_ONE} after ${Operator.ALIGN}`,p);if(e.Type()===Token.Type.META)return new Help(`Invalid ${Operator.MAYBE_ONE} after ${Operator.META}`,p);if(e.Type()===Token.Type.AND)return new Help(`Invalid ${Operator.MAYBE_ONE} after ${Operator.AND}`,p);if(e.Type()===Token.Type.XOR)return new Help(`Invalid ${Operator.MAYBE_ONE} after ${Operator.XOR}`,p);if(e.Type()===Token.Type.OR)return new Help(`Invalid ${Operator.MAYBE_ONE} after ${Operator.OR}`,p);p=i.Index(),n.push(new Token.Maybe_One)}}else if(y===Operator.MAYBE_MANY){if(O<1)return new Help(`Invalid ${Operator.MAYBE_MANY} outside sequence`,i.Index());{const e=T();if(null==e)return new Help(`Invalid ${Operator.MAYBE_MANY} at beginning`,i.Index());if(e.Type()===Token.Type.MAYBE_ONE)return new Help(`Invalid ${Operator.MAYBE_MANY} after ${Operator.MAYBE_ONE}`,p);if(e.Type()===Token.Type.MAYBE_MANY)return new Help(`Invalid ${Operator.MAYBE_MANY} after ${Operator.MAYBE_MANY}`,p);if(e.Type()===Token.Type.ONE_OR_MANY)return new Help(`Invalid ${Operator.MAYBE_MANY} after ${Operator.ONE_OR_MANY}`,p);if(e.Type()===Token.Type.OPEN_GROUP)return new Help(`Invalid ${Operator.MAYBE_MANY} after ${Operator.OPEN_GROUP}`,p);if(e.Type()===Token.Type.OPEN_SEQUENCE)return new Help(`Invalid ${Operator.MAYBE_MANY} after ${Operator.OPEN_SEQUENCE}`,p);if(e.Type()===Token.Type.NOT)return new Help(`Invalid ${Operator.MAYBE_MANY} after ${Operator.NOT}`,p);if(e.Type()===Token.Type.CASE)return new Help(`Invalid ${Operator.MAYBE_MANY} after ${Operator.CASE}`,p);if(e.Type()===Token.Type.ALIGN)return new Help(`Invalid ${Operator.MAYBE_MANY} after ${Operator.ALIGN}`,p);if(e.Type()===Token.Type.META)return new Help(`Invalid ${Operator.MAYBE_MANY} after ${Operator.META}`,p);if(e.Type()===Token.Type.AND)return new Help(`Invalid ${Operator.MAYBE_MANY} after ${Operator.AND}`,p);if(e.Type()===Token.Type.XOR)return new Help(`Invalid ${Operator.MAYBE_MANY} after ${Operator.XOR}`,p);if(e.Type()===Token.Type.OR)return new Help(`Invalid ${Operator.MAYBE_MANY} after ${Operator.OR}`,p);p=i.Index(),n.push(new Token.Maybe_Many)}}else if(y===Operator.ONE_OR_MANY){if(O<1)return new Help(`Invalid ${Operator.ONE_OR_MANY} outside sequence`,i.Index());{const e=T();if(null==e)return new Help(`Invalid ${Operator.ONE_OR_MANY} at beginning`,i.Index());if(e.Type()===Token.Type.MAYBE_ONE)return new Help(`Invalid ${Operator.ONE_OR_MANY} after ${Operator.MAYBE_ONE}`,p);if(e.Type()===Token.Type.MAYBE_MANY)return new Help(`Invalid ${Operator.ONE_OR_MANY} after ${Operator.MAYBE_MANY}`,p);if(e.Type()===Token.Type.ONE_OR_MANY)return new Help(`Invalid ${Operator.ONE_OR_MANY} after ${Operator.ONE_OR_MANY}`,p);if(e.Type()===Token.Type.OPEN_GROUP)return new Help(`Invalid ${Operator.ONE_OR_MANY} after ${Operator.OPEN_GROUP}`,p);if(e.Type()===Token.Type.OPEN_SEQUENCE)return new Help(`Invalid ${Operator.ONE_OR_MANY} after ${Operator.OPEN_SEQUENCE}`,p);if(e.Type()===Token.Type.NOT)return new Help(`Invalid ${Operator.ONE_OR_MANY} after ${Operator.NOT}`,p);if(e.Type()===Token.Type.CASE)return new Help(`Invalid ${Operator.ONE_OR_MANY} after ${Operator.CASE}`,p);if(e.Type()===Token.Type.ALIGN)return new Help(`Invalid ${Operator.ONE_OR_MANY} after ${Operator.ALIGN}`,p);if(e.Type()===Token.Type.META)return new Help(`Invalid ${Operator.ONE_OR_MANY} after ${Operator.META}`,p);if(e.Type()===Token.Type.AND)return new Help(`Invalid ${Operator.ONE_OR_MANY} after ${Operator.AND}`,p);if(e.Type()===Token.Type.XOR)return new Help(`Invalid ${Operator.ONE_OR_MANY} after ${Operator.XOR}`,p);if(e.Type()===Token.Type.OR)return new Help(`Invalid ${Operator.ONE_OR_MANY} after ${Operator.OR}`,p);p=i.Index(),n.push(new Token.One_Or_Many)}}else if(y===Operator.OPEN_GROUP)E(),p=i.Index(),t+=1,O>0&&(o+=1),n.push(new Token.Open_Group);else if(y===Operator.CLOSE_GROUP){const e=T();if(null==e)return new Help(`Invalid ${Operator.CLOSE_GROUP} at beginning`,i.Index());if(e.Type()===Token.Type.OPEN_GROUP)return new Help(`Empty ${Operator.OPEN_GROUP}${Operator.CLOSE_GROUP}`,p);if(e.Type()===Token.Type.OPEN_SEQUENCE)return new Help(`Invalid ${Operator.OPEN_SEQUENCE} followed by ${Operator.CLOSE_GROUP}`,p);if(e.Type()===Token.Type.NOT)return new Help(`Invalid ${Operator.NOT} followed by ${Operator.CLOSE_GROUP}`,p);if(e.Type()===Token.Type.CASE)return new Help(`Invalid ${Operator.CASE} followed by ${Operator.CLOSE_GROUP}`,p);if(e.Type()===Token.Type.ALIGN)return new Help(`Invalid ${Operator.ALIGN} followed by ${Operator.CLOSE_GROUP}`,p);if(e.Type()===Token.Type.META)return new Help(`Invalid ${Operator.META} followed by ${Operator.CLOSE_GROUP}`,p);if(e.Type()===Token.Type.AND)return new Help(`Invalid ${Operator.AND} followed by ${Operator.CLOSE_GROUP}`,p);if(e.Type()===Token.Type.XOR)return new Help(`Invalid ${Operator.XOR} followed by ${Operator.CLOSE_GROUP}`,p);if(e.Type()===Token.Type.OR)return new Help(`Invalid ${Operator.OR} followed by ${Operator.CLOSE_GROUP}`,p);if(t<1)return new Help(`Extra ${Operator.CLOSE_GROUP}`,i.Index());p=i.Index(),t-=1,O>0&&(o-=1),n.push(new Token.Close_Group)}else if(y===Operator.OPEN_SEQUENCE){if(O>0)return new Help(`Interior ${Operator.OPEN_SEQUENCE} within sequence`,p);E(),p=i.Index(),O+=1,o=0,a=!1,n.push(new Token.Open_Sequence)}else if(y===Operator.CLOSE_SEQUENCE){const e=T();if(null===e)return new Help(`Invalid ${Operator.CLOSE_SEQUENCE} at beginning`,i.Index());if(e.Type()===Token.Type.OPEN_GROUP)return new Help(`Invalid ${Operator.OPEN_GROUP} followed by ${Operator.CLOSE_SEQUENCE}`,p);if(e.Type()===Token.Type.OPEN_SEQUENCE)return new Help(`Empty ${Operator.OPEN_SEQUENCE}${Operator.CLOSE_SEQUENCE}`,p);if(e.Type()===Token.Type.CLOSE_SEQUENCE)return new Help(`Invalid ${Operator.CLOSE_SEQUENCE} followed by ${Operator.CLOSE_SEQUENCE}`,p);if(e.Type()===Token.Type.NOT)return new Help(`Invalid ${Operator.NOT} followed by ${Operator.CLOSE_SEQUENCE}`,p);if(e.Type()===Token.Type.CASE)return new Help(`Invalid ${Operator.CASE} followed by ${Operator.CLOSE_SEQUENCE}`,p);if(e.Type()===Token.Type.ALIGN)return new Help(`Invalid ${Operator.ALIGN} followed by ${Operator.CLOSE_SEQUENCE}`,p);if(e.Type()===Token.Type.META)return new Help(`Invalid ${Operator.META} followed by ${Operator.CLOSE_SEQUENCE}`,p);if(e.Type()===Token.Type.AND)return new Help(`Invalid ${Operator.AND} followed by ${Operator.CLOSE_SEQUENCE}`,p);if(e.Type()===Token.Type.XOR)return new Help(`Invalid ${Operator.XOR} followed by ${Operator.CLOSE_SEQUENCE}`,p);if(e.Type()===Token.Type.OR)return new Help(`Invalid ${Operator.OR} followed by ${Operator.CLOSE_SEQUENCE}`,p);if(O<1)return new Help(`Extra ${Operator.CLOSE_SEQUENCE}`,i.Index());p=i.Index(),O-=1,o=0,a=!1,n.push(new Token.Close_Sequence({sequence_type:Sequence_Type.COMPLEX}))}else if(y===Operator.NOT)E(),p=i.Index(),n.push(new Token.Not);else if(y===Operator.CASE)E(),p=i.Index(),n.push(new Token.Case);else if(y===Operator.ALIGN)E(),p=i.Index(),n.push(new Token.Align);else if(y===Operator.META)E(),p=i.Index(),n.push(new Token.Meta);else if(y===Operator.AND){const e=T();if(null===e)return new Help(`Invalid ${Operator.AND} at beginning`,i.Index());if(e.Type()===Token.Type.OPEN_GROUP)return new Help(`Invalid ${Operator.AND} after ${Operator.OPEN_GROUP}`,i.Index());if(e.Type()===Token.Type.OPEN_SEQUENCE)return new Help(`Invalid ${Operator.AND} after ${Operator.OPEN_SEQUENCE}`,i.Index());if(e.Type()===Token.Type.NOT)return new Help(`Invalid ${Operator.AND} after ${Operator.NOT}`,i.Index());if(e.Type()===Token.Type.CASE)return new Help(`Invalid ${Operator.AND} after ${Operator.CASE}`,i.Index());if(e.Type()===Token.Type.ALIGN)return new Help(`Invalid ${Operator.AND} after ${Operator.ALIGN}`,i.Index());if(e.Type()===Token.Type.META)return new Help(`Invalid ${Operator.AND} after ${Operator.META}`,i.Index());if(e.Type()===Token.Type.AND)return new Help(`Invalid ${Operator.AND} after ${Operator.AND}`,i.Index());if(e.Type()===Token.Type.XOR)return new Help(`Invalid ${Operator.AND} after ${Operator.XOR}`,i.Index());if(e.Type()===Token.Type.OR)return new Help(`Invalid ${Operator.AND} after ${Operator.OR}`,i.Index());p=i.Index(),O>0&&(a=!0),n.push(new Token.And)}else if(y===Operator.XOR){const e=T();if(null===e)return new Help(`Invalid ${Operator.XOR} at beginning`,i.Index());if(e.Type()===Token.Type.OPEN_GROUP)return new Help(`Invalid ${Operator.XOR} after ${Operator.OPEN_GROUP}`,i.Index());if(e.Type()===Token.Type.OPEN_SEQUENCE)return new Help(`Invalid ${Operator.XOR} after ${Operator.OPEN_SEQUENCE}`,i.Index());if(e.Type()===Token.Type.NOT)return new Help(`Invalid ${Operator.XOR} after ${Operator.NOT}`,i.Index());if(e.Type()===Token.Type.CASE)return new Help(`Invalid ${Operator.XOR} after ${Operator.CASE}`,i.Index());if(e.Type()===Token.Type.ALIGN)return new Help(`Invalid ${Operator.XOR} after ${Operator.ALIGN}`,i.Index());if(e.Type()===Token.Type.META)return new Help(`Invalid ${Operator.XOR} after ${Operator.META}`,i.Index());if(e.Type()===Token.Type.AND)return new Help(`Invalid ${Operator.XOR} after ${Operator.AND}`,i.Index());if(e.Type()===Token.Type.XOR)return new Help(`Invalid ${Operator.XOR} after ${Operator.XOR}`,i.Index());if(e.Type()===Token.Type.OR)return new Help(`Invalid ${Operator.XOR} after ${Operator.OR}`,i.Index());p=i.Index(),O>0&&0===o&&(a=!1),n.push(new Token.Xor)}else if(y===Operator.OR){const e=T();if(null===e)return new Help(`Invalid ${Operator.OR} at beginning`,i.Index());if(e.Type()===Token.Type.OPEN_GROUP)return new Help(`Invalid ${Operator.OR} after ${Operator.OPEN_GROUP}`,i.Index());if(e.Type()===Token.Type.OPEN_SEQUENCE)return new Help(`Invalid ${Operator.OR} after ${Operator.OPEN_SEQUENCE}`,i.Index());if(e.Type()===Token.Type.NOT)return new Help(`Invalid ${Operator.OR} after ${Operator.NOT}`,i.Index());if(e.Type()===Token.Type.CASE)return new Help(`Invalid ${Operator.OR} after ${Operator.CASE}`,i.Index());if(e.Type()===Token.Type.ALIGN)return new Help(`Invalid ${Operator.OR} after ${Operator.ALIGN}`,i.Index());if(e.Type()===Token.Type.META)return new Help(`Invalid ${Operator.OR} after ${Operator.META}`,i.Index());if(e.Type()===Token.Type.AND)return new Help(`Invalid ${Operator.OR} after ${Operator.AND}`,i.Index());if(e.Type()===Token.Type.XOR)return new Help(`Invalid ${Operator.OR} after ${Operator.XOR}`,i.Index());if(e.Type()===Token.Type.OR)return new Help(`Invalid ${Operator.OR} after ${Operator.OR}`,i.Index());p=i.Index(),O>0&&0===o&&(a=!1),n.push(new Token.Or)}else if(y===Operand.PART)E(),p=i.Index(),N=new Token.Class({value:Class.PART}),O<1?(O+=1,n.push(new Token.Open_Sequence),n.push(N),O-=1,n.push(new Token.Close_Sequence({sequence_type:Sequence_Type.SIMPLE}))):n.push(N);else{E();const n=i;for(i=i.Next();!i.Is_At_End();i=i.Next()){const e=i.Point();if(/\s/.test(e)||e===Operator.VERBATIM||e===Operator.MAYBE_ONE||e===Operator.MAYBE_MANY||e===Operator.ONE_OR_MANY||e===Operator.OPEN_GROUP||e===Operator.CLOSE_GROUP||e===Operator.OPEN_SEQUENCE||e===Operator.CLOSE_SEQUENCE||e===Operator.NOT||e===Operator.CASE||e===Operator.ALIGN||e===Operator.META||e===Operator.AND||e===Operator.XOR||e===Operator.OR||e===Operand.PART)break}const t=new Text.Instance({dictionary:r,value:e.slice(n.Index(),i.Index())});i=i.Previous(),p=n.Index(),l(t)}}var N;if(n.length<1)return new Help("Empty expression",0);if(t>0)return new Help(`Unclosed ${Operator.OPEN_GROUP}`,i.Previous().Index());if(O>0)return new Help(`Unclosed ${Operator.OPEN_SEQUENCE}`,i.Previous().Index());{const e=n[n.length-1];if(e.Type()===Token.Type.OPEN_GROUP)return new Help(`Invalid ${Operator.OPEN_GROUP} at end`,p);if(e.Type()===Token.Type.OPEN_SEQUENCE)return new Help(`Invalid ${Operator.OPEN_SEQUENCE} at end`,p);if(e.Type()===Token.Type.NOT)return new Help(`Invalid ${Operator.NOT} at end`,p);if(e.Type()===Token.Type.CASE)return new Help(`Invalid ${Operator.CASE} at end`,p);if(e.Type()===Token.Type.ALIGN)return new Help(`Invalid ${Operator.ALIGN} at end`,p);if(e.Type()===Token.Type.META)return new Help(`Invalid ${Operator.META} at end`,p);if(e.Type()===Token.Type.AND)return new Help(`Invalid ${Operator.AND} at end`,p);if(e.Type()===Token.Type.XOR)return new Help(`Invalid ${Operator.XOR} at end`,p);if(e.Type()===Token.Type.OR)return new Help(`Invalid ${Operator.OR} at end`,p)}return n}}