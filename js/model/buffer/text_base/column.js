import*as Utils from"../../../utils.js";import*as Entity from"../../entity.js";import*as Data from"../../data.js";export class Instance extends Entity.Instance{constructor({line:t,index:s,text:n}){super(),this.line=t,this.index=s,this.text=n,this.rows=[],0,this.Add_Dependencies([Data.Singleton()])}Is_Blank(){return null==this.text}Buffer(){return this.Line().Buffer()}Line(){return this.line}Index(){return this.index}Text(){return 0,this.text}Row_Buffer_Count(){return Data.Singleton().Info().Average_Row_Count({line_index:this.Line().Index(),column_index:this.Index()})}Row_Count(){return this.rows.length}Row_At(t){return 0,t<this.Row_Count()?this.rows[t]:this.Blank_Row(t)}Push_Row(t){0,this.rows.push(t)}Is_Marginal(){return 0,this.Text().Is_Marginal()}Is_Inter_Marginal(){return 0,this.Text().Is_Inter_Marginal()}Is_Interlinear(){return 0,this.Text().Is_Interlinear()}Is_Inter_Interlinear(){return 0,this.Text().Is_Inter_Interlinear()}Is_Fully_Tabular(){return 0,this.Text().Is_Tabular()}}