/**
 * Author: Vu Duy Tuan - tuanvd@gmail.com
 * Date: 11/6/20
 * Time: 14:56
 */
export type ClassType<T = any> = {
  new (...args: any[]): T;
};

export class InterfaceCloner<I> {
  constructor(props: I) {
    Object.assign(this, props);
  }
}
