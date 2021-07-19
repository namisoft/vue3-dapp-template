import { ClassType } from "./class-type";

const objects: Map<ClassType, any> = new Map();

export const singleton = {
  get<T>(cls: ClassType<T>): T {
    if (!objects.has(cls)) {
      objects.set(cls, new cls());
    }
    return objects.get(cls);
  },
};
