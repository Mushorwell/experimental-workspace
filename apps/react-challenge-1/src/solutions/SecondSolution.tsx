import { FormEvent, useEffect, useState } from 'react';
import './SecondSolution.css';

export function SecondSolution() {
  const [itemsInShoppingCart, setItemsInShoppingCart] = useState(0);
  const [lines, setLines] = useState([[10, 5, 2], [1], [2], [3], [4]]);

  function addPersonToLine(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (itemsInShoppingCart <= 0 || itemsInShoppingCart === undefined) return;
    let leastItems = 1e9;
    let lineWithLeast: number[] | null = null;
    for (let line of lines) {
      const totalPerLine = line.reduce(
        (accumulator, currentValue) => accumulator + currentValue,
        0
      );
      if (totalPerLine < leastItems) {
        leastItems = totalPerLine;
        lineWithLeast = line;
      }
    }

    if (!lineWithLeast) return;

    setLines((prevState) =>
      prevState.map((line) =>
        line === lineWithLeast ? [...line, itemsInShoppingCart] : line
      )
    );
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setLines((prevState) => {
        return prevState.map((line) => {
          return [line[0] - 1, ...line.slice(1)].filter((value) => value > 0);
        });
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <form onSubmit={addPersonToLine}>
        <input
          type="number"
          required
          value={itemsInShoppingCart}
          onChange={(e) => {
            if (!e.currentTarget.value) return;
            setItemsInShoppingCart(e.currentTarget.valueAsNumber || 0);
          }}
        />
        <button className="bg-amber-900">Checkout</button>
      </form>
      <div className="tills">
        {lines.map((people, idx) => (
          <div className="till" key={`till number-${idx + 1}`}>
            {people.map((items, itemsIdx) => (
              <div
                key={`person-number${itemsIdx + 1}-in-till-${
                  idx + 1
                }-with-${items}-items`}
              >
                {items}
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  );
}
