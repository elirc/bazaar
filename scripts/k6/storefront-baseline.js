import http from "k6/http";
import { check, sleep } from "k6";

export const options = { vus: 20, duration: "30s", thresholds: { http_req_duration: ["p(95)<500"] } };
export default function () {
  const response = http.get(`${__ENV.BASE_URL ?? "http://localhost:3000"}/products/canvas-market-tote`);
  check(response, { "PDP is healthy": (result) => result.status === 200 });
  sleep(0.2);
}
