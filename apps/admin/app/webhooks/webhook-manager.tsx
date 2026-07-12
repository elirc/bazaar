import type { WebhookDeliveryRow } from "../../src/webhook-admin";

export function WebhookManager({ deliveries }: { deliveries: readonly WebhookDeliveryRow[] }) {
  return (
    <section aria-labelledby="webhook-heading">
      <h2 id="webhook-heading">Merchant webhooks</h2>
      <form>
        <label>HTTPS destination<input name="url" type="url" pattern="https://.*" required /></label>
        <label>Events<select name="events" multiple required><option>order.paid</option><option>fulfillment.created</option><option>refund.created</option></select></label>
        <button type="submit">Create endpoint</button>
      </form>
      <table><caption>Recent deliveries</caption><thead><tr><th>Event</th><th>Destination</th><th>Status</th><th>Attempts</th></tr></thead>
        <tbody>{deliveries.map((delivery) => <tr key={delivery.id}><td>{delivery.event}</td><td>{delivery.destination}</td><td>{delivery.status}</td><td>{delivery.attempts}</td></tr>)}</tbody>
      </table>
    </section>
  );
}
