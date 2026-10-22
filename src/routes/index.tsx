import { createFileRoute } from "@tanstack/react-router";
import { FlightSim } from "@/components/flight-sim";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return <FlightSim />;
}
