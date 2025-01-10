export enum GroupType {
  HR = "HR",
  Normal_Employee = "Normal_Employee",
}

export type Employee = {
  id: number;
  name: string;
  email: string;
  group: GroupType;
};
