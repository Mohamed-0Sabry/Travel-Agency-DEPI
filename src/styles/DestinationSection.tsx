// import React, { useEffect, useState } from "react";
// import TopDestinations from "./TopDestinations";
// import SpecialOffers from "./SpecialOffers";
// import TourPackages from "./TourPackages";
// import FlightOffers, { FlightOfferCard } from "./FlightOffers";
// import data from "../../../data/destinationsData.json";

// type TopDestination = {
//   id: number | string;
//   title: string;
//   location?: string;
//   image: string;
// };

// type SpecialOffer = {
//   id: number | string;
//   title: string;
//   image: string;
//   rating?: number;
//   description?: string;
//   price?: string;
// };

// type TourPackage = SpecialOffer;

// interface DestinationContent {
//   topDestinations: TopDestination[];
//   specialOffers: SpecialOffer[];
//   tourPackages: TourPackage[];
//   filters: string[];
//   flightOffers: FlightOfferCard[];
// }

// const DestinationSection: React.FC = () => {
//   const [content, setContent] = useState<DestinationContent>({
//     topDestinations: (data as any).topDestinations,
//     specialOffers: (data as any).specialOffers,
//     tourPackages: (data as any).tourPackages,
//     filters: (data as any).filters,
//     flightOffers: [],
//   });

//   const [loadingFlights, setLoadingFlights] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchFlightOffers = async () => {
//       try {
//         const res = await fetch("http://localhost:5000/api/offers");
//         if (!res.ok) {
//           throw new Error("Failed to fetch flight offers");
//         }

//         const flightsFromApi = await res.json();

//         const mappedOffers: FlightOfferCard[] = flightsFromApi.map(
//           (f: any): FlightOfferCard => ({
//             id: f._id,
//             destination: `${f.destination.city}, ${f.destination.country}`,
//             image: `/uploads/${f.image}`, // depends how you expose the images
//             badge: {
//               text: f.offer?.badge || "Hot Offer",
//               // map to existing CSS classes: limited / popular / discount
//               type: f.offer?.badge === "Hot Offer" ? "limited" : "discount",
//             },
//             discountPrice: `€${f.offer?.newPrice ?? f.price}`,
//             originalPrice: `€${f.offer?.oldPrice ?? f.price}`,
//             description: f.description,
//           })
//         );

//         setContent((prev) => ({
//           ...prev,
//           flightOffers: mappedOffers,
//         }));
//       } catch (err: any) {
//         console.error(err);
//         setError(err.message || "Error fetching flight offers");
//       } finally {
//         setLoadingFlights(false);
//       }
//     };

//     fetchFlightOffers();
//   }, []);

//   return (
//     <>
//       <TopDestinations destinations={content.topDestinations} />
//       <SpecialOffers offers={content.specialOffers} />
//       <TourPackages packages={content.tourPackages} filters={content.filters} />

//       {loadingFlights && <p>Loading flight offers...</p>}
//       {error && <p style={{ color: "red" }}>{error}</p>}

//       {!loadingFlights && !error && (
//         <FlightOffers flights={content.flightOffers} />
//       )}
//     </>
//   );
// };

// export default DestinationSection;
