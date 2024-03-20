// THIS CODE IS CURRENTLY BUGGED
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
//           startTime: "2024-03-22 15:00:00",
//           endTime: "2024-03-22 15:30:00",
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
// updateSchedule();
