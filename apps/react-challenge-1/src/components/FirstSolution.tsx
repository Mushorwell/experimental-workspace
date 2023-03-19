import { FormEvent, useEffect, useRef, useState } from 'react';

export function FirstSolution() {
  const [queues, setQueues] = useState<Array<Array<number>>>([
    [13],
    [5, 7, 2],
    [1],
    [],
    [9],
  ]);

  const processQueues = () => {
    const updatedQueues = queues.map((queue, queueIndex) => {
      if (queue.length >= 1) {
        if (queue[0] - 1 === 0) {
          return [...queue.slice(1)];
        }
        return [queue[0] - 1, ...queue.slice(1)];
      }
      return queue;
    });
    setQueues(() => updatedQueues);
  };

  const valueToAddInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      processQueues();
    }, 10000);
    return () => clearTimeout(timeout);
  }, [queues]);

  const addToQueues = (val: number) => {
    const totalsArr = queues.map((queue: number[], queueIdx: number) =>
      queue.reduce((accumulator, currentValue) => accumulator + currentValue, 0)
    );
    const indexOfSmallest = totalsArr.indexOf(Math.min(...totalsArr));
    const updatedQueues = [...queues];
    updatedQueues.splice(indexOfSmallest, 1, [...queues[indexOfSmallest], val]);
    setQueues(() => updatedQueues);
  };

  const handleCheckout = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (valueToAddInput.current && valueToAddInput.current.value) {
      const valueToAdd = JSON.parse(valueToAddInput.current.value);
      addToQueues(valueToAdd);
    }
  };

  return (
    <>
      <form onSubmit={handleCheckout}>
        <input type="number" ref={valueToAddInput} />
        <button type="submit">Checkout</button>
      </form>
      <section>{JSON.stringify(queues)}</section>
    </>
  );
}
