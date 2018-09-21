export const internal = Symbol('builder-internal');

//#region These are needed in order to strictly type the tests for the builder
export type _INode = {
  [internal]: IInternal;
}
export const hasInternal = (node: object): node is _INode => {
  return internal in node;
}
//#endregion

export enum NodeType {
  Base = 'Base',
  Number = 'Number',
  Max = 'Max',
  Min = 'Min',
  Exact = 'Exact',
  Length = 'Length',
  Each = 'Each',
  Contains = 'Contains',
  LikeArray = 'LikeArray',
  LikeObject = 'LikeObject',
  Array = 'Array',
  And = 'And',
  Or = 'Or',
  Not = 'Not',
  Any = 'Any',
  Boolean = 'Boolean',
  True =  'True',
  False = 'False',
  Modulo = 'Modulo',
  Either =  'Either',
  Custom = 'Custom',
  String = 'String',
  StartsWith = 'StartsWith',
  EndsWith = 'EndsWith',
  Matches = 'Matches',
  Regex = 'Regex',
  Test = 'Test',
  Values = 'Values',
  Keys = 'Keys',
  Object =  'Object',
}
export interface IInternal {
  type: NodeType;
  data: any[];
  children: IInternal[];
}

//#region Interfaces for each builder node-type
export interface INode { } // Used to refer to any Node
export interface INode_Void extends INode { }
export interface INode_Number extends INode {
  not: INode_Number;
  Whole: INode_Number;
  Natural: INode_Number;
  Min(value: number): INode_Number;
  Max(value: number): INode_Number;
  Mod(mod: number, result: number): INode_Number;
  Exact(value: number): INode_Number;
  Either(values: number[]): INode_Number;
  Between(valueA: number, valueB: number): INode_Number;
}
export interface INode_Array extends INode {
  Length: INode_Number;
  Each: INode_Base;
  Contains: INode_Base;
  Like(tuple_of_constraints: INode[]): INode_Void;
}
export interface INode_Boolean extends INode {
  True: INode_Void;
  False: INode_Void;
}
export interface INode_String extends INode {
  not: INode_String;
  Length: INode_Number;
  Exact(value: string): INode_String;
  StartsWith(value: string): INode_String;
  EndsWith(value: string): INode_String;
  Either(values: string[]): INode_String;
  Matches(regex: RegExp): INode_String;
}
export interface INode_Regex extends INode {
  Test(value: string): INode_Base;
}
export interface INode_Object extends INode {
  Values: INode_Array;
  Keys: INode_Array;
  Like(obj: { [k: string]: INode }): INode_Void;
}
export interface INode_Base extends INode {
  not: INode_Base;
  Any: INode_Void;
  Null: INode_Void;
  Undefined: INode_Void;
  Object: INode_Object;
  Number: INode_Number;
  Boolean: INode_Boolean;
  String: INode_String;
  Array: INode_Array;
  Regex: INode_Regex;
  and(constraints: INode[]): INode_Void;
  or(constraints: INode[]): INode_Void;
  Custom(predicate: (value: any) => boolean): INode_Base;
}
//#endregion
