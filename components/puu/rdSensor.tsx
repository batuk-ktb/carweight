const RDsensor = (status:any) => {
  const color = status == 1? 'bg-500-green': 'bg-blue-500'
  return (
    <div className="flex flex-col justify-center items-center">
      {/* rd senser1 */}
      <div className={`w-[28px] h-[18px] ${color}`} style={{
        WebkitMaskImage: "url('/shape.png')",
        WebkitMaskRepeat: "no-repeat",
        WebkitMaskSize: "cover",
        maskImage: "url('/shape.png')",
        maskRepeat: "no-repeat",
        maskSize: "cover",
      }} />
      <div className={`w-[20px] h-[13px] ${color}`} style={{
        WebkitMaskImage: "url('/shape.png')",
        WebkitMaskRepeat: "no-repeat",
        WebkitMaskSize: "cover",
        maskImage: "url('/shape.png')",
        maskRepeat: "no-repeat",
        maskSize: "cover",
      }} />
      <div className="w-[10px] h-[10px] rounded-full ${color}"></div>
    </div>
  )
}
export default RDsensor;