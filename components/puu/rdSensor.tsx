const RDsensor = () => {
  return (
    <div className="flex flex-col justify-center items-center">
      {/* rd senser1 */}
      <div className={`w-[28px] h-[18px] bg-blue-500`} style={{
        WebkitMaskImage: "url('/shape.png')",
        WebkitMaskRepeat: "no-repeat",
        WebkitMaskSize: "cover",
        maskImage: "url('/shape.png')",
        maskRepeat: "no-repeat",
        maskSize: "cover",
      }} />
      <div className={`w-[20px] h-[13px] bg-blue-500`} style={{
        WebkitMaskImage: "url('/shape.png')",
        WebkitMaskRepeat: "no-repeat",
        WebkitMaskSize: "cover",
        maskImage: "url('/shape.png')",
        maskRepeat: "no-repeat",
        maskSize: "cover",
      }} />
      <div className="w-[10px] h-[10px] rounded-full bg-blue-500"></div>
    </div>
  )
}
export default RDsensor;