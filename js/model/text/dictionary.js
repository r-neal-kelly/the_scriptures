import*as Utils from"../../utils.js";import*as Unicode from"../../unicode.js";export var Boundary;!function(s){s.START="START",s.MIDDLE="MIDDLE",s.END="END"}(Boundary||(Boundary={}));export class Instance{constructor({json:s=null}){this.info=null!=s?JSON.parse(s):{letters:[],markers:[],words:{},breaks:{[Boundary.START]:{},[Boundary.MIDDLE]:{},[Boundary.END]:{}},word_errors:[],break_errors:{[Boundary.START]:[],[Boundary.MIDDLE]:[],[Boundary.END]:[]}};for(const s of["letters","markers"]){Utils.Assert(this.info.hasOwnProperty(s)&&Utils.Is.Array(this.info[s]),`info.${s} is missing or is invalid.`);for(const r of this.info[s])Utils.Assert(Utils.Is.String(r),`info.${s} is missing or is invalid.`)}Utils.Assert(this.info.hasOwnProperty("words")&&Utils.Is.Object(this.info.words),"info.words is missing or is invalid.");for(const[s,r]of Object.entries(this.info.words)){Utils.Assert(Utils.Is.String(s)&&Utils.Is.Array(r),"info.words is missing or is invalid.");for(const s of r)Utils.Assert(Utils.Is.String(s),"info.words is missing or is invalid.")}Utils.Assert(this.info.hasOwnProperty("breaks")&&Utils.Is.Object(this.info.breaks),"info.breaks is missing or is invalid.");for(const s of[Boundary.START,Boundary.MIDDLE,Boundary.END]){Utils.Assert(this.info.breaks.hasOwnProperty(s)&&Utils.Is.Object(this.info.breaks[s]),"info.breaks is missing or is invalid.");for(const[r,i]of Object.entries(this.info.breaks[s])){Utils.Assert(Utils.Is.String(r)&&Utils.Is.Array(i),"info.breaks is missing or is invalid.");for(const s of i)Utils.Assert(Utils.Is.String(s),"info.breaks is missing or is invalid.")}}Utils.Assert(this.info.hasOwnProperty("word_errors")&&Utils.Is.Array(this.info.word_errors),"info.word_errors is missing or is invalid.");for(const s of this.info.word_errors)Utils.Assert(Utils.Is.String(s),"info.word_errors is missing or is invalid.");Utils.Assert(this.info.hasOwnProperty("break_errors")&&Utils.Is.Object(this.info.break_errors),"info.break_errors is missing or is invalid.");for(const s of[Boundary.START,Boundary.MIDDLE,Boundary.END]){Utils.Assert(this.info.break_errors.hasOwnProperty(s)&&Utils.Is.Array(this.info.break_errors[s]),"info.break_errors is missing or is invalid.");for(const r of this.info.break_errors[s])Utils.Assert(Utils.Is.String(r),"info.break_errors is missing or is invalid.")}}Has_Letter(s){return Utils.Assert(Unicode.Is_Point(s),"Letter must be a point."),this.info.letters.includes(s)}Add_Letter(s){Utils.Assert(Unicode.Is_Point(s),"Letter must be a point."),this.info.letters.includes(s)||(this.info.letters.push(s),this.info.words[s]=[])}Remove_Letter(s){Utils.Assert(Unicode.Is_Point(s),"Letter must be a point.");const r=this.info.letters.indexOf(s);r>-1&&(this.info.letters[r]=this.info.letters[this.info.letters.length-1],this.info.letters.pop(),delete this.info.words[s])}Has_Marker(s){return Utils.Assert(Unicode.Is_Point(s),"Marker must be a point."),this.info.markers.includes(s)}Add_Marker(s){Utils.Assert(Unicode.Is_Point(s),"Marker must be a point."),this.info.markers.includes(s)||(this.info.markers.push(s),this.info.breaks[Boundary.START][s]=[],this.info.breaks[Boundary.MIDDLE][s]=[],this.info.breaks[Boundary.END][s]=[])}Remove_Marker(s){Utils.Assert(Unicode.Is_Point(s),"Marker must be a point.");const r=this.info.markers.indexOf(s);r>-1&&(this.info.markers[r]=this.info.markers[this.info.markers.length-1],this.info.markers.pop(),delete this.info.breaks[Boundary.START][s],delete this.info.breaks[Boundary.MIDDLE][s],delete this.info.breaks[Boundary.END][s])}Has_Word(s){Utils.Assert(s.length>0,"Word must have a length greater than 0.");const r=Unicode.First_Point(s);return null!=this.info.words[r]&&this.info.words[r].includes(s)}Add_Word(s){Utils.Assert(s.length>0,"Word must have a length greater than 0."),Utils.Assert(!this.Has_Word_Error(s),"Word must not be considered an error.");const r=Unicode.First_Point(s);null==this.info.words[r]?(this.Add_Letter(r),this.info.words[r].push(s)):this.info.words[r].includes(s)||this.info.words[r].push(s)}Remove_Word(s){Utils.Assert(s.length>0,"Word must have a length greater than 0.");const r=Unicode.First_Point(s);if(null!=this.info.words[r]){const i=this.info.words[r].indexOf(s);i>-1&&(this.info.words[r][i]=this.info.words[r][this.info.words[r].length-1],this.info.words[r].pop())}}Has_Break(s,r){Utils.Assert(s.length>0,"Break must have a length greater than 0.");const i=Unicode.First_Point(s);return null!=this.info.breaks[r][i]&&this.info.breaks[r][i].includes(s)}Add_Break(s,r){Utils.Assert(s.length>0,"Break must have a length greater than 0."),Utils.Assert(!this.Has_Break_Error(s,r),"Break must not be considered an error.");const i=Unicode.First_Point(s);null==this.info.breaks[r][i]?(this.Add_Marker(i),this.info.breaks[r][i].push(s)):this.info.breaks[r][i].includes(s)||this.info.breaks[r][i].push(s)}Remove_Break(s,r){Utils.Assert(s.length>0,"Break must have a length greater than 0.");const i=Unicode.First_Point(s);if(null!=this.info.breaks[r][i]){const t=this.info.breaks[r][i].indexOf(s);t>-1&&(this.info.breaks[r][i][t]=this.info.breaks[r][i][this.info.breaks[r][i].length-1],this.info.breaks[r][i].pop())}}Has_Word_Error(s){return Utils.Assert(s.length>0,"Word error must have a length greater than 0."),this.info.word_errors.includes(s)}Add_Word_Error(s){Utils.Assert(s.length>0,"Word error must have a length greater than 0."),Utils.Assert(!this.Has_Word(s),"Error must not be considered a word."),this.info.word_errors.includes(s)||this.info.word_errors.push(s)}Remove_Word_Error(s){Utils.Assert(s.length>0,"Word error must have a length greater than 0.");const r=this.info.word_errors.indexOf(s);r>-1&&(this.info.word_errors[r]=this.info.word_errors[this.info.word_errors.length-1],this.info.word_errors.pop())}Has_Break_Error(s,r){return Utils.Assert(s.length>0,"Break error must have a length greater than 0."),this.info.break_errors[r].includes(s)}Add_Break_Error(s,r){Utils.Assert(s.length>0,"Break error must have a length greater than 0."),Utils.Assert(!this.Has_Break(s,r),"Error must not be considered a break."),this.info.break_errors[r].includes(s)||this.info.break_errors[r].push(s)}Remove_Break_Error(s,r){Utils.Assert(s.length>0,"Break error must have a length greater than 0.");const i=this.info.break_errors[r].indexOf(s);i>-1&&(this.info.break_errors[r][i]=this.info.break_errors[r][this.info.break_errors[r].length-1],this.info.break_errors[r].pop())}To_JSON(){this.info.letters.sort(),this.info.markers.sort();const s={};for(const r of Object.keys(this.info.words).sort())s[r]=this.info.words[r].sort();this.info.words=s;const r={[Boundary.START]:{},[Boundary.MIDDLE]:{},[Boundary.END]:{}};for(const s of[Boundary.START,Boundary.MIDDLE,Boundary.END])for(const i of Object.keys(this.info.breaks[s]).sort())r[s][i]=this.info.breaks[s][i].sort();this.info.breaks=r,this.info.word_errors.sort();for(const s of[Boundary.START,Boundary.MIDDLE,Boundary.END])this.info.break_errors[s].sort();return JSON.stringify(this.info)}}