import http from "k6/http";
import { check } from "k6";

export const options = {
  scenarios: {
    sale: { executor: "shared-iterations", vus: 500, iterations: 10_000, maxDuration: "2m" },
  },
  thresholds: { http_req_failed: ["rate<0.01"], http_req_duration: ["p(95)<500"] },
};

export default function () {
  const key = `sale-${__VU}-${__ITER}`;
  const response = http.post(`${__ENV.BASE_URL}/checkout`, JSON.stringify({ variantId: __ENV.VARIANT_ID, quantity: 1 }), {
    headers: { "content-type": "application/json", "idempotency-key": key },
  });
  check(response, { "accepted or sold out": (result) => [200, 409].includes(result.status) });
}
