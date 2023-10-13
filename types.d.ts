/* This handles the TypeScript for globalThis.prisma in prismadb.tsx */
import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
}

declare module "@mapbox/mapbox-gl-directions" {
  const MapboxDirections: any; // You may need to specify the correct type here
  export default MapboxDirections;
}
