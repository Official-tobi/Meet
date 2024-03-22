//This code is currently bugged
// THIS OUGHT TO BE THE CODE TO SEND A REQUEST TO THE BACKDEND FOR A NEW EVENT
// import { toast } from "sonner";

// const updateSchedule = async () => {
//   try {
//     const res = await fetch(
//       `https://motex-web-services.onrender.com/api/v1/book-demo/calendar`,
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           start: "2024-03-22%2015:00:00.0000000",
//           end: "2024-03-22%2015:30:00.0000000",
//           showAs: "free",
//           isBusyAllDay: false,
//         }),
//       }
//     );
//     if (!res.ok) {
//       const err = await res.json();
//       toast(`Error Code ${400}`, {
//         description: `${err.message}`,
//         action: {
//           label: "close",
//           onClick: () => {},
//         },
//       });
//       throw new Error(`Bad Request [${res.status}]`);
//     }
//     const data = await res.json();
//     console.log(data);
//   } catch (error) {
//     console.warn(error);
//   }
// };
// export default updateSchedule;
