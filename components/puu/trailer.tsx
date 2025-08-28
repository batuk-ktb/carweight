const Trailer = ({ data }: any) => {
  return (
    <div className="flex flex-col justify-center items-center relative">
      {/* chirguul1 */}
      <div className="w-ful items-center absolute -top-3 left-0">
        <p>Баруун тал:{data.cam1}</p>
      </div>
      <div className="w-[200px] h-[80px] bg-blue-500">
      </div>
      <div className="w-ful items-center absolute -bottom-3 right-0">
        <p>Зүүн тал:{data.cam2}</p>
      </div>
    </div>
  )
}

export default Trailer