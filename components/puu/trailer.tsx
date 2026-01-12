type TrailerProps = {
  data: {
    cam1?: string
    cam2?: string
  }
}

const Trailer = ({ data }: TrailerProps) => {
  return (
    <div className="flex flex-col justify-center items-center relative gap-2">

      {/* Баруун камер */}
      <div className="flex flex-col items-center">
        <div className="w-[200px] h-[120px] border bg-black overflow-hidden">
          <img
            src={data?.cam1 || "/no-signal.jpg"}
            alt="Right camera"
            className="w-full h-full object-cover"
          />
        </div>
        <p>Баруун тал</p>
      </div>

      {/* Trailer body */}
      <div className="w-[200px] h-[80px] bg-blue-500"></div>

      {/* Зүүн камер */}
      <div className="flex flex-col items-center">
        <div className="w-[200px] h-[120px] border bg-black overflow-hidden">
          <img
            src={data?.cam2 || "/no-signal.jpg"}
            alt="Left camera"
            className="w-full h-full object-cover"
          />
        </div>
        <p>Зүүн тал</p>
      </div>

    </div>
  )
}

export default Trailer
