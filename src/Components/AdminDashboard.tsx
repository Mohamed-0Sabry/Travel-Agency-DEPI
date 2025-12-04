// import React, { useState, useEffect } from "react";
// import "../styles/AdminDashboard.css";
// import type { Offer, Flight, PaymentMethod, ApiResponse} from "@/types/api.types";

// interface DataStore {
//   offers: Offer[];
//   flights: Flight[];
//   payments: PaymentMethod[];
// }

// type Entity = "offers" | "flights" | "payments";
// type FormType = Partial<Offer & Flight & PaymentMethod>;

// const AdminDashboard: React.FC = () => {
//   const [activeTab, setActiveTab] = useState<Entity>("offers");
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [isEditing, setIsEditing] = useState(false);
//   const [editingId, setEditingId] = useState<string | null>(null);
//   const [searchTerm, setSearchTerm] = useState("");

//   const [offers, setOffers] = useState<Offer[]>([]);
//   const [flights, setFlights] = useState<Flight[]>([]);
//   const [payments, setPayments] = useState<PaymentMethod[]>([]);
//   const [formData, setFormData] = useState<FormType>({});

//   useEffect(() => {
//     const resposne: ApiResponse<DataStore> = {
//       success: true,
//       data: {
//           offers: [
//               {
//                   _id: 'offer1',
//                   isActive: true,
//                   oldPrice: 100,
//                   newPrice: 80,
//                   badge: 'Sale',
//                   expiresAt: new Date('2022-12-31')
//               },
//               {
//                   _id: 'offer2',
//                   isActive: true,
//                   newPrice: 50,
//                   expiresAt: new Date('2022-12-31')
//               }
//           ],
//           flights: [
//               {
//                   _id: 'flight1',
//                   price: 200,
//                   origin: {
//                       city: 'New York',
//                       country: 'USA'
//                   },
//                   destination: {
//                       city: 'Los Angeles',
//                       country: 'USA'
//                   },
//                   offer: {
//                       _id: 'offer1',
//                       isActive: true,
//                       newPrice: 80,
//                       expiresAt: new Date('2022-12-31')
//                   },
//                   image: 'flight1.jpg',
//                   description: 'Flight from New York to Los Angeles',
//                   rating: 4.5,
//                   createdAt: new Date('2022-01-01'),
//                   updatedAt: new Date('2022-01-01')
//               },
//               {
//                   _id: 'flight2',
//                   price: 300,
//                   origin: {
//                       city: 'London',
//                       country: 'UK'
//                   },
//                   destination: {
//                       city: 'Paris',
//                       country: 'France'
//                   },
//                   offer: {
//                       _id: 'offer2',
//                       isActive: true,
//                       newPrice: 50,
//                       expiresAt: new Date('2022-12-31')
//                   },
//                   image: 'flight2.jpg',
//                   description: 'Flight from London to Paris',
//                   rating: 4.8,
//                   createdAt: new Date('2022-01-01'),
//                   updatedAt: new Date('2022-01-01')
//               }
//           ],
//           payments: [
//               {
//                   _id: 'payment1',
//                   success: true,
//                   transactionId: '123456789',
//                   amount: 200,
//                   paymentMethod: {
//                       cardType: 'VISA',
//                       lastFourDigits: '1234'
//                   },
//                   timestamp: new Date('2022-01-01')
//               },
//               {
//                   _id: 'payment2',
//                   success: false,
//                   transactionId: '',
//                   amount: 300,
//                   paymentMethod: {
//                       cardType: 'MASTERCARD',
//                       lastFourDigits: '5678'
//                   },
//                   timestamp: new Date('2022-01-01')
//               }
//           ]
//       }
//   };
//   const sample = resposne.data;
//     setOffers(sample.offers);
//     setFlights(sample.flights);
//     setPayments(sample.payments);
//   }, []);

//   const openModal = (entity?: FormType) => {
//     if (entity) {
//       setIsEditing(true);
//       setEditingId(entity._id || null);
//       setFormData(entity);
//     } else {
//       setIsEditing(false);
//       setEditingId(null);
//       setFormData({});
//     }
//     setIsModalOpen(true);
//   };

//   const closeModal = () => {
//     setIsModalOpen(false);
//     setFormData({});
//     setEditingId(null);
//   };

//   const handleSubmit = () => {
//     const id = editingId ?? Date.now();

//     if (activeTab === "offers") {
//       setOffers((prev) =>
//         isEditing
//           ? prev.map((o) => (o.id === id ? ({ ...formData, id } as Offer) : o))
//           : [...prev, { ...formData, id } as Offer]
//       );
//     }

//     if (activeTab === "flights") {
//       setFlights((prev) =>
//         isEditing
//           ? prev.map((f) => (f.id === id ? ({ ...formData, id } as Flight) : f))
//           : [...prev, { ...formData, id } as Flight]
//       );
//     }

//     if (activeTab === "payments") {
//       setPayments((prev) =>
//         isEditing
//           ? prev.map((p) =>
//               p.id === id ? ({ ...formData, id } as Payment) : p
//             )
//           : [...prev, { ...formData, id } as Payment]
//       );
//     }

//     closeModal();
//   };

//   const getFilteredData = () => {
//     const data =
//       activeTab === "offers"
//         ? offers
//         : activeTab === "flights"
//         ? flights
//         : payments;
//     return data.filter((item) =>
//       Object.values(item).some((val) =>
//         String(val).toLowerCase().includes(searchTerm.toLowerCase())
//       )
//     );
//   };

//   return (
//     <div className="dashboard">
//       <header className="header">
//         <div className="header-content">
//           <h1 className="header-title">Admin Dashboard</h1>
//         </div>
//       </header>

//       <div className="container">
//         <div className="nav-tabs">
//           <nav className="nav-flex">
//             <button
//               className={`nav-tab ${
//                 activeTab === "offers" ? "nav-tab-active" : ""
//               }`}
//               onClick={() => setActiveTab("offers")}
//             >
//               Offers
//             </button>

//             <button
//               className={`nav-tab ${
//                 activeTab === "flights" ? "nav-tab-active" : ""
//               }`}
//               onClick={() => setActiveTab("flights")}
//             >
//               Flights
//             </button>

//             <button
//               className={`nav-tab ${
//                 activeTab === "payments" ? "nav-tab-active" : ""
//               }`}
//               onClick={() => setActiveTab("payments")}
//             >
//               Payments
//             </button>
//           </nav>
//         </div>

//         <div className="toolbar">
//           <input
//             className="search-input"
//             placeholder="Search..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />

//           <button className="btn-add" onClick={() => openModal()}>
//             Add New
//           </button>
//         </div>

//         <div className="content-card">
//           <div className="table-container">
//             <table className="data-table">
//               <thead>
//                 <tr>
//                   {activeTab === "offers" && (
//                     <>
//                       <th>Title</th>
//                       <th>Description</th>
//                       <th>Discount</th>
//                       <th>Valid</th>
//                       <th>Actions</th>
//                     </>
//                   )}
//                   {activeTab === "flights" && (
//                     <>
//                       <th>Flight</th>
//                       <th>Origin</th>
//                       <th>Dest</th>
//                       <th>Depart</th>
//                       <th>Arrive</th>
//                       <th>Price</th>
//                       <th>Actions</th>
//                     </>
//                   )}
//                   {activeTab === "payments" && (
//                     <>
//                       <th>User</th>
//                       <th>Amount</th>
//                       <th>Date</th>
//                       <th>Status</th>
//                       <th>Method</th>
//                       <th>Actions</th>
//                     </>
//                   )}
//                 </tr>
//               </thead>

//               <tbody>
//                 {getFilteredData().map((item) => (
//                   <tr key={item.id}>
//                     {activeTab === "offers" && (
//                       <>
//                         <td>{item.id}</td>
//                         <td>{item.description}</td>
//                         <td>{item.discount}%</td>
//                         <td>{item.validUntil}</td>
//                         <td>
//                           <button
//                             className="btn-edit"
//                             onClick={() => openModal(item)}
//                           >
//                             Edit
//                           </button>
//                           <button
//                             className="btn-delete"
//                             onClick={() => handleDelete(item.id)}
//                           >
//                             Delete
//                           </button>
//                         </td>
//                       </>
//                     )}

//                     {activeTab === "flights" && (
//                       <>
//                         <td>{item.flightNumber}</td>
//                         <td>{item.origin}</td>
//                         <td>{item.destination}</td>
//                         <td>{item.departureTime}</td>
//                         <td>{item.arrivalTime}</td>
//                         <td>{item.price}</td>
//                         <td>
//                           <button
//                             className="btn-edit"
//                             onClick={() => openModal(item)}
//                           >
//                             Edit
//                           </button>
//                           <button
//                             className="btn-delete"
//                             onClick={() => handleDelete(item.id)}
//                           >
//                             Delete
//                           </button>
//                         </td>
//                       </>
//                     )}

//                     {activeTab === "payments" && (
//                       <>
//                         <td>{item.userId}</td>
//                         <td>{item.amount}</td>
//                         <td>{item.date}</td>
//                         <td>{item.status}</td>
//                         <td>{item.method}</td>
//                         <td>
//                           <button
//                             className="btn-edit"
//                             onClick={() => openModal(item)}
//                           >
//                             Edit
//                           </button>
//                           <button
//                             className="btn-delete"
//                             onClick={() => handleDelete(item.id)}
//                           >
//                             Delete
//                           </button>
//                         </td>
//                       </>
//                     )}
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>

//       {isModalOpen && (
//         <div className="modal-overlay">
//           <div className="modal-content">
//             <h3 className="modal-title">
//               {isEditing ? "Edit" : "Add"} {activeTab}
//             </h3>

//             <div className="modal-body">
//               {/* Reuse your same inputs */}
//               {/* ... you already wrote these */}
//               {/* Keep same logic */}

//               <div className="modal-actions">
//                 <button className="btn-primary" onClick={handleSubmit}>
//                   Save
//                 </button>
//                 <button className="btn-secondary" onClick={closeModal}>
//                   Cancel
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AdminDashboard;
