export class Instance{constructor({taskbar:s}){this.taskbar=s}Taskbar(){return this.taskbar}Symbol(){return this.Taskbar().Layout().Desktop().Menu().Is_Open()?"-":"="}Should_Open(){return this.Taskbar().Layout().Desktop().Menu().Is_Closed()}Should_Close(){return this.Taskbar().Layout().Desktop().Menu().Is_Open()}}