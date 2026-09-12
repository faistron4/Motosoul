import { Tool } from "@/types";

// Backend aane tak static data. Baad me is file ki jagah API/DB call use kar lena.
export const tools: Tool[] = [
  {
    slug: "corner-weight-calculator",
    title: "Corner weight calculator",
    description:
      "Calculate your car's corner weights and cross weights using our easy-to-use calculator.",
  },
  {
    slug: "drivetrain-horsepower-loss-guestimator",
    title: "Drivetrain horsepower loss guestimator",
    description:
      "Estimate your drivetrain loss and calculate your engine's wheel horsepower.",
  },
  {
    slug: "dyno-correction-calculator",
    title: "Dyno correction calculator",
    description:
      "Correct your engine's power output for different atmospheric conditions.",
  },
  {
    slug: "engine-displacement-calculator",
    title: "Engine displacement calculator",
    description:
      "Quickly calculate your engine's displacement using bore size, stroke length, and cylinder count.",
  },
  {
    slug: "kw-to-hp-calculator",
    title: "KW to HP calculator",
    description:
      "Convert kilowatts (kW) to horsepower (HP) and HP to kW with our easy-to-use power calculator.",
  },
  {
  slug: 'power-to-weight-ratio',
  title: 'Power to Weight Ratio Calculator',
  description: 'Calculate PWR instantly for cars, motorcycles, bikes, and rockets with bidirectional units and acceleration estimates.',
  icon: 'fa-gauge-high',
  category: 'automotive',
},
  {
    slug: "supercharger-pulley-ratio-and-boost-calculator",
    title: "Supercharger pulley ratio and boost calculator",
    description:
      "Optimize your supercharger setup — estimate boost levels, RPM limits, and performance gains.",
  },
  {
    slug: "torque-to-horsepower-calculator",
    title: "Torque to horsepower calculator",
    description:
      "Find your engine's power output. Just enter torque (lb-ft) and RPM for instant results.",
  },
  {
    slug: "turbo-boost-pressure-calculator",
    title: "Turbo boost pressure calculator",
    description:
      "Calculate the required turbo boost pressure for your engine given N/A power and target HP.",
  },
  {
    slug: "vehicle-speed-calculator",
    title: "Vehicle speed calculator",
    description:
      "Calculate your vehicle's top speed in each gear by entering gear ratio, RPM, and tire size.",
  },
  {
    slug: "wheel-and-tyre-fitment-calculator",
    title: "Wheel & tyre fitment calculator",
    description:
      "Visualise different wheel and tyre options by comparing size, width and offset.",
  },
];

export function getToolBySlug(slug: string): Tool | undefined {
  return tools.find((tool) => tool.slug === slug);
}
