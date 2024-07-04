import React, { ReactNode } from 'react';

// import {
//   PieChart,
//   Pie,
//   Sector,
//   Cell,
//   ResponsiveContainer,
//   Label,
// } from 'recharts';

// const COLORS = ['#747474', '#0088FE'];

// const calculateMonthsDifference = (currentDate, targetDate) => {
//   const current = new Date(currentDate);
//   const target = new Date(targetDate);

//   let months;
//   months = (target.getFullYear() - current.getFullYear()) * 12;
//   months -= current.getMonth();
//   months += target.getMonth();

//   return months <= 0 ? 0 : months;
// };

// function PieChartComponent() {
//   const currentDate = new Date();
//   const targetDate = new Date('2024-11-22');

//   const monthsDifference = calculateMonthsDifference(currentDate, targetDate);
//   const remainingMonths = 12 - monthsDifference;

//   const data = [
//     { name: 'Months Until Target', value: monthsDifference },
//     { name: 'Remaining Months in Year', value: remainingMonths },
//   ];

//   return (
//     <ResponsiveContainer width='100%' height={400}>
//       <PieChart>
//         <Pie
//           data={data}
//           cx='50%'
//           cy='50%'
//           innerRadius={60}
//           outerRadius={80}
//           fill='#8884d8'
//           paddingAngle={5}
//           dataKey='value'
//         >
//           {data.map((entry, index) => (
//             <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//           ))}
//           <Label
//             value={`${monthsDifference} Months`}
//             position='center'
//             fill='#000'
//             style={{
//               fontSize: '24px',
//               fontWeight: 'bold',
//             }}
//           />
//         </Pie>
//       </PieChart>
//     </ResponsiveContainer>
//   );
// }

function Page() {
  return (
    <div>
      <WidgetContainer>
        <div className=' h-[200px] bg-blue-500 p-4 text-white border'>1</div>
        <div className='h-[200px]  bg-blue-500 p-4 text-white border'>2</div>
        <div className=' h-[200px]  bg-blue-500 p-4 text-white border'>3</div>
        <div className='h-[200px]  bg-blue-500 p-4 text-white'>4</div>
      </WidgetContainer>
    </div>
  );
}

export default Page;

export function WidgetContainer({ children }: { children: ReactNode }) {
  // const childrenCount = Children.count(children);

  // const getFlexClass = (childrenCount: number) => {
  //   switch (childrenCount) {
  //     case 1:
  //       return ' flex flex-1';
  //     case 2:
  //       return ' flex flex-1/2';
  //     case 3:
  //       return ' flex flex-1/3';
  //     default:
  //       return ' flex flex-1/4';
  //   }
  // };

  // const flexClass = getFlexClass(childrenCount);

  return (
    <div className='mt-20 border-2 border-rose-600 flex flex-col md:flex-row flex-1'>
      {React.Children.map(children, (child) => (
        <div className='flex-1 '>{child}</div>
      ))}
    </div>
  );
}
