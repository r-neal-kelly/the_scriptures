import*as Utils from"../../../utils.js";import*as Entity from"../../entity.js";import*as Column from"./column.js";export class Instance extends Entity.Instance{static Min_Column_Count(){return Instance.min_column_count}static Set_Min_Column_Count(t){0,Instance.min_column_count=t}constructor({buffer:t,index:s,result:n}){if(super(),this.buffer=t,this.index=s,this.result=n,this.columns=[],null==n)0,0;else{0,0;for(let t=0,s=this.Text().Column_Count();t<s;t+=1)this.columns.push(new Column.Instance({line:this,index:t}))}this.Add_Dependencies(this.columns)}Buffer(){return 0,this.buffer}Index(){return 0,this.index}Has_Text(){return this.Has_Result()}Text(){return 0,this.result.Line()}Has_Result(){return null!=this.result}Result(){return 0,this.result}Column_Count(){return this.columns.length}Column_At(t){return 0,t<this.Column_Count()?this.columns[t]:Instance.blank_column}Is_Blank(){return null==this.result}Has_Margin(){return 0,this.Text().Has_Margin()}Has_Interlineation(){return 0,this.Text().Has_Interlineation()}Has_Forward_Interlineation(){return 0,this.Text().Has_Forward_Interlineation()}Has_Reverse_Interlineation(){return 0,this.Text().Has_Reverse_Interlineation()}Is_Row_Of_Table(){return 0,this.Text().Is_Row_Of_Table()}Is_First_Row_Of_Table(){return 0,this.Text().Is_First_Row_Of_Table()}Is_Centered(){return 0,this.Text().Is_Centered()}Has_Styles(){return this.Has_Text()}Styles(){if(this.Has_Styles()){const t=this.Text();if(this.Has_Interlineation()){return`    \n                    justify-content: ${t.Is_Centered()?"center":"start"};\n                `}{const s=t.Column_Count();let n="",e="";if(this.Is_Row_Of_Table())n=`repeat(${s}, 1fr)`,e=10*s+"em";else{for(let e=0,i=s;e<i;e+=1){t.Column(e).Is_Marginal()?n+=" 0.5fr":n+=" 1fr"}e="100%"}return`\n                    grid-template-columns: ${n};\n    \n                    max-width: ${e};\n                `}}return""}}Instance.min_column_count=1,Instance.blank_column=new Column.Instance({line:null,index:null});