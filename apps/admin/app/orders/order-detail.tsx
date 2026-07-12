import type { AdminOrder } from "../../src/order-admin";

export function OrderDetail({ order }: { order: AdminOrder }) {
  return (
    <article aria-labelledby={`order-${order.id}`}>
      <h2 id={`order-${order.id}`}>Order {order.id}</h2>
      <p>{order.customerEmail} · {order.status}</p>
      <ol aria-label="Order timeline">
        {order.events.map((event) => <li key={event.id}><time dateTime={event.occurredAt}>{event.occurredAt}</time> {event.message}</li>)}
      </ol>
      <form>
        <label>Merchant note<textarea name="note" required /></label>
        <button type="submit">Add note</button>
      </form>
    </article>
  );
}
