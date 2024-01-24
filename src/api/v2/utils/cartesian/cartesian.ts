import { ObjectType } from "../../common/types/common";

type ElementType<A> = A extends ReadonlyArray<infer T> ? T : never;
type ElementsOfAll<
  Inputs,
  R extends ReadonlyArray<unknown> = []
> = Inputs extends readonly [infer F, ...infer M]
  ? ElementsOfAll<M, [...R, ElementType<F>]>
  : R;

type CartesianProduct<Inputs> = ElementsOfAll<Inputs>[];

export function handleCartesian<
  Sets extends ReadonlyArray<ReadonlyArray<unknown>>
>(sets: Sets) {
  return sets.reduce((a, b) =>
    a.flatMap((d) => b.map((e) => [d, e].flat()))
  ) as CartesianProduct<Sets>;
}
export const handleCartesianBaseOnSource = (properties: any[]) => {
  const { keys, combineValues } = properties.reduce(
    (res: ObjectType<any>, { key, values }) => {
      res.keys.push(key);
      res.combineValues.push(values);
      return res;
    },
    {
      keys: [],
      combineValues: [],
    }
  );

  return {
    keys,
    productVariants: handleCartesian(combineValues),
  };
};
