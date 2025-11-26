import type { Destination } from "./Destination";
import type { Offer } from "./Offer";
import type { Origin } from "./Origin";

export interface Flight {
  _id:string,
  price: number;
  origin: Origin;
  destination: Destination;
  offer?: Offer;
  image: string;
  description: string;
  rating: number;
}
