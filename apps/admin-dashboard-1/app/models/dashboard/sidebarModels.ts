import { ReactElement } from "react";
export interface IMenuItem{
  title: string;
  path: string;
  icon: ReactElement;
}

export interface IMenuPage{
  title: string;
  list: IMenuItem[];
}