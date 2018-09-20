interface Coordinate {
  readonly lat: number;
  readonly long: number;
}

interface Restaurant {
  readonly name: string;
  readonly coordinate: Coordinate | undefined;
  readonly menu: ReadonlyArray<string>;
}

const restName = 0;
const coordinate = 4;
const firstDay = 8;

export function parse(input: string): ReadonlyArray<Restaurant> {
  let arr = input.split("~");
  const every = parseInt(arr.shift()!, 10);
  console.log(every);
  arr = arr.slice(1);
  const rests: Array<Restaurant> = [];
  while (arr.length > 0) {
    const curr = arr.splice(0, every);

    rests.push({
      name: curr[restName],
      coordinate: parseCoordinate(curr[coordinate]),
      menu: curr.slice(firstDay, firstDay + 7)
    });
  }

  return rests;
}

function parseCoordinate(input: string): Coordinate | undefined {
  const splitted = input.split(",");

  if (splitted.length !== 2) {
    return undefined;
  }

  return {
    lat: parseInt(splitted[0]),
    long: parseInt(splitted[1])
  };
}
