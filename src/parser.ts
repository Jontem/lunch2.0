import { haversine_km } from "./haversine";
interface Coordinate {
  readonly lat: number;
  readonly long: number;
}

export interface Restaurant {
  readonly name: string;
  readonly coordinate: Coordinate | undefined;
  readonly menu: string | undefined;
  readonly distance: number | undefined; // meters
}

const officeCoordinate: Coordinate = {
  lat: 57.783817,
  long: 14.164682
};

const restName = 0;
const coordinate = 4;
const firstDay = 8;

export function parse(input: string): ReadonlyArray<Restaurant> {
  const dayOfWeek = new Date().getDay() - 1;
  let arr = input.split("~");
  const every = parseInt(arr.shift()!, 10);
  arr = arr.slice(1);
  const rests: Array<Restaurant> = [];
  while (arr.length > 0) {
    const curr = arr.splice(0, every);
    const parsedCoordinate = parseCoordinate(curr[coordinate]);
    rests.push({
      name: curr[restName],
      coordinate: parsedCoordinate,
      menu: curr[firstDay + dayOfWeek] && curr[firstDay + dayOfWeek],
      distance:
        parsedCoordinate &&
        Math.round(
          haversine_km(
            parsedCoordinate.lat,
            parsedCoordinate.long,
            officeCoordinate.lat,
            officeCoordinate.long
          ) * 1000
        )
    });
  }

  return rests.sort((a, b) => a.distance! - b.distance!);
}

function parseCoordinate(input: string): Coordinate | undefined {
  const splitted = input.replace(/[\(\)]/g, "").split(",");

  if (splitted.length !== 2) {
    return undefined;
  }

  return {
    lat: parseFloat(splitted[0]),
    long: parseFloat(splitted[1])
  };
}
