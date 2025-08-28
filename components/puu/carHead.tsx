const CarHead = ({ data }: any) => {
  return (

    <div className="relative">
      {/* lpr bolood tolgoi heseg */}
      <p className="absolute -top-5 left-0">LPR:{data.lpr}</p>
      <div className="flex justify-end items-center">
        <div className="w-[50px] h-[80px] border border-blue-500 rounded-l-lg bg-blue-500 ">
          {/* hamar */}
        </div>
        <div className="w-[80px] h-[100px] border border-blue-500 rounded-lg bg-blue-500 ">
          {/* tolgoi */}
        </div>
      </div>
    </div>
  )
}
export default CarHead