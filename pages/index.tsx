import IndexForm from '../src/components/form'

export default function Home() {
  return (
    <div className="hero min-h-screen bg-base-200">
      <div className="text-center hero-content">
        <div className="card col-span-1 row-span-3 shadow-lg xl:col-span-2 bg-base-100">
          <div className="card-body">
            <h2 className="mt-4 mb-7 text-4xl font-bold card-title">Index Calculator</h2>
            <IndexForm />
          </div>
        </div>
      </div>
    </div>
  )
}
