import*as Utils from"../../../utils.js";import*as Entity from"../../entity.js";import*as Column from"./column.js";export class Instance extends Entity.Instance{static Min_Column_Count(){return Instance.min_column_count}static Set_Min_Column_Count(t){0,Instance.min_column_count=t}constructor({buffer:t,index:s,result:n}){if(super(),this.buffer=t,this.index=s,this.result=n,this.columns=[],null==n)0,0;else{0,0;for(let t=0,s=this.Text().Column_Count();t<s;t+=1)this.columns.push(new Column.Instance({line:this,index:t}))}this.Add_Dependencies(this.columns)}Buffer(){return 0,this.buffer}Index(){return 0,this.index}Has_Text(){return this.Has_Result()}Text(){return 0,this.result.Line()}Has_Result(){return null!=this.result}Result(){return 0,this.result}Column_Count(){return this.columns.length}Column_At(t){return 0,t<this.Column_Count()?this.columns[t]:Instance.blank_column}Is_Blank(){return null==this.result}Is_Multi_Column(){return this.Has_Text()&&this.Text().Is_Multi_Column()}Is_First_Multi_Column(){return this.Has_Text()&&this.Text().Is_First_Multi_Column()}Has_Styles(){return this.Has_Text()}Styles(){if(this.Has_Styles()){const t=this.Is_Multi_Column()?10*this.Text().Column_Count()+"em":"100%";return`\n                grid-template-columns: repeat(${this.Text().Column_Count()}, 1fr);\n\n                max-width: ${t};\n            `}return""}}Instance.min_column_count=1,Instance.blank_column=new Column.Instance({line:null,index:null});