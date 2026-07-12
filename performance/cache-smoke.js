import http from "k6/http";
import { check } from "k6";

export const options = {
  vus: 20,
  duration: "20s",
  thresholds: {
    http_req_duration: ["p(95)<250"],
    checks: ["rate>0.90"],
  },
};

export default function () {
  const response = http.get(`${__ENV.BASE_URL}/products/canvas-market-tote`);
  check(response, {
    "product succeeds": (result) => result.status === 200,
    "cache hit after warm-up": (result) => (__ITER === 0 ? true : result.headers["X-Cache"] === "HIT"),
  });
}
