const d2r = Math.PI / 180.0;

//calculate haversine distance for linear distance
export function haversine_km(
  lat1: number,
  long1: number,
  lat2: number,
  long2: number
): number {
  const dlong = (long2 - long1) * d2r;
  const dlat = (lat2 - lat1) * d2r;
  const a =
    Math.pow(Math.sin(dlat / 2.0), 2) +
    Math.cos(lat1 * d2r) *
      Math.cos(lat2 * d2r) *
      Math.pow(Math.sin(dlong / 2.0), 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = 6367 * c;

  return d;
}
