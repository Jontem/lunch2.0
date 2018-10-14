import { haversine_km } from "./haversine";
interface Coordinate {
  readonly lat: number;
  readonly long: number;
}

export interface Restaurant {
  readonly name: string;
  readonly coordinate?: Coordinate;
  readonly menu?: string;
  readonly weeksAlternative?: string;
  readonly distance: number | undefined; // meters
  readonly website?: string;
}

const officeCoordinate: Coordinate = {
  lat: 57.783817,
  long: 14.164682
};

const restName = 0;
const coordinate = 4;
const website = 5;
const firstDay = 8;
const weeeksAlternative = 17;

export function parse(input: string): ReadonlyArray<Restaurant> {
  const dayOfWeek = getDayOfWeekIndex();

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
      weeksAlternative: curr[weeeksAlternative] && curr[weeeksAlternative],
      distance:
        parsedCoordinate &&
        Math.round(
          haversine_km(
            parsedCoordinate.lat,
            parsedCoordinate.long,
            officeCoordinate.lat,
            officeCoordinate.long
          ) * 1000
        ),
      website: curr[website] || undefined
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

function getDayOfWeekIndex(): number {
  const dayOfWeek = new Date().getDay();

  if (dayOfWeek === 0) {
    // sunday
    return 6;
  }

  return dayOfWeek - 1;
}
