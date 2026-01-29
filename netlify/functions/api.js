import serverless from "serverless-http";
import { handler as app } from "../../backend/server.js";

export const handler = serverless(app);
