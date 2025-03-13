import {
  BarChart3,
  Building2,
  Database,
  LineChart,
  Network,
  ShoppingCart,
} from "lucide-react"

const features = [
  {
    name: "Unified Operations",
    description: "Seamlessly manage procurement, warehousing, and inventory across multiple locations.",
    icon: Network,
  },
  {
    name: "Universal Catalog",
    description: "Access a centralized product database that can be customized for each location.",
    icon: Database,
  },
  {
    name: "Multi-Chain Support",
    description: "Perfect for single-chain and multi-chain pharmacies in retail and hospital sectors.",
    icon: Building2,
  },
  {
    name: "Smart Analytics",
    description: "Leverage network insights to identify operational gaps and market opportunities.",
    icon: BarChart3,
  },
  {
    name: "Real-time Monitoring",
    description: "Track performance and ensure data uniformity across all locations.",
    icon: LineChart,
  },
  {
    name: "Inventory Control",
    description: "Efficient inventory management with advanced tracking and optimization.",
    icon: ShoppingCart,
  },
]

export function Features() {
  return (
    <div id="features" className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-blue-600">
            Comprehensive Solution
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Everything you need to run your pharmacy
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            A scalable, modular, and data-driven solution that integrates seamlessly 
            with your pharmacy network's complex workflows.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.name} className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                  <feature.icon className="h-5 w-5 flex-none text-blue-600" />
                  {feature.name}
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">{feature.description}</p>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  )
}