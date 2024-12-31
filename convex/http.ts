import { httpRouter } from "convex/server";
import { auth } from "./auth";
import { registerInstallation } from "./github";

const http = httpRouter();

auth.addHttpRoutes(http);
http.route({
    path: "/github/registerInstallation",
    method: "POST",
    handler: registerInstallation,
  })


export default http;
