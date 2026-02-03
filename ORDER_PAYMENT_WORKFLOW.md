# Order & Payment Workflow (Manual Bank Transfer)

This document defines the admin flow for manual bank transfer: **check money → verify payment → confirm order → process → ship**. One verification step, no double-verifying.

---

## 1. Status Names & Meaning

### Order status (order lifecycle)

| Status      | Meaning |
|------------|--------|
| **pending**   | Order placed; waiting for payment verification. |
| **confirmed** | Payment verified; order confirmed (ready to fulfill). |
| **processing**| Being prepared/fulfilled. |
| **shipped**   | Sent to customer. |
| **delivered** | Completed. |
| **cancelled** | Cancelled. |

### Payment status (order-level: `orders.payment_status`)

| Status    | UI label   | Meaning |
|-----------|------------|--------|
| **unpaid**  | Unpaid     | No payment submitted yet. |
| **pending**| Submitted  | Customer submitted transaction ID; **awaiting admin verification**. |
| **paid**   | Verified   | Admin verified payment; order can advance. |
| **failed** | Rejected   | Admin rejected (wrong amount, wrong ref, etc.); customer can resubmit. |
| **refunded**| Refunded  | Payment refunded. |

### Payment record status (`payments.status`)

| Status   | Meaning |
|----------|--------|
| **pending** | Submitted by customer; awaiting admin verify/reject. |
| **paid**    | Admin verified. |
| **failed**  | Admin rejected. |

---

## 2. Rules & Transitions

### Payment first, then order

- **Order status** can move from `pending` to `confirmed` (and beyond) **only when** `orders.payment_status === 'paid'`.
- Admin must **verify or reject** the payment (one action on the payment) before advancing the order. No “verify twice”.

### Allowed admin actions by stage

| Order status | Payment status | Allowed admin actions |
|--------------|----------------|------------------------|
| pending      | unpaid         | Wait for customer to submit payment (or cancel order). |
| pending      | **pending** (submitted) | **Verify payment** or **Reject payment** (on the payment record). |
| pending      | paid (verified)| **Confirm order** → order becomes `confirmed`. |
| pending      | failed         | Wait for customer to resubmit (or cancel). |
| confirmed    | paid           | **Start processing** → `processing`. |
| processing   | paid           | **Mark shipped** → `shipped`. |
| shipped      | paid           | **Mark delivered** → `delivered`. |

### Invalid transitions (guarded in backend)

- Order status **cannot** go to `confirmed`, `processing`, `shipped`, or `delivered` if `payment_status !== 'paid'`.
- Order status **cannot** move backward (e.g. from `processing` back to `confirmed`) except via `cancelled`.
- **Payment**: only a payment with `status === 'pending'` can be set to `paid` or `failed` (verify/reject once).

---

## 3. UI Logic (Admin)

- **No status dropdown.** Use **one clear action per step** so admin is not confused.
- **Payment**: When there is a payment with status **pending**, show only:
  - **Verify payment** → sets payment to `paid`, order `payment_status` to `paid`.
  - **Reject payment** → sets payment to `failed`, order `payment_status` to `failed`.
- **Order**: Show only the **next** allowed step:
  - After payment is **verified** and order is **pending**: button **Confirm order**.
  - **Confirmed** → button **Start processing**.
  - **Processing** → button **Mark shipped**.
  - **Shipped** → button **Mark delivered**.
- If payment is still **pending**, show a short message: *“Verify or reject the submitted payment first. Order status can advance only after payment is verified.”*

---

## 4. Backend Guards

- **`OrderController@updateStatus`**
  - For `confirmed`, `processing`, `shipped`, `delivered`: require `order.payment_status === 'paid'`, else 422 with message: *“Payment must be verified before order can be confirmed/processed/shipped/delivered.”*
  - Optional: enforce forward-only order status (no jumping back except to `cancelled`).

- **`OrderController@updatePaymentStatus`**
  - Only allow transition when `payment.status === 'pending'`.
  - On **paid**: set `payment.status = 'paid'` and `order.payment_status = 'paid'`.
  - On **failed**: set `payment.status = 'failed'` and `order.payment_status = 'failed'`.

- **`OrderController@store`**
  - New order: `order.payment_status = 'unpaid'`.

- **`PaymentController@store`**
  - When customer submits payment: create payment with `status = 'pending'`, set `order.payment_status = 'pending'` (submitted).

---

## 5. Flow Summary

```
Customer places order     → order: pending, payment_status: unpaid
Customer transfers & submits ID → order: pending, payment_status: pending (submitted)
Admin verifies payment    → order: pending, payment_status: paid
Admin confirms order      → order: confirmed
Admin starts processing   → order: processing
Admin marks shipped       → order: shipped
Admin marks delivered     → order: delivered
```

**Single verification:** Admin verifies (or rejects) the payment once; after that, only order status buttons are used. No second “payment verification” step.

---

## 6. Database

- **`orders.payment_status`**: `enum('unpaid', 'pending', 'paid', 'failed', 'refunded')`, default `unpaid`.
- **`payments.status`**: `enum('pending', 'paid', 'failed')`.

Migration: `2026_02_03_000001_add_unpaid_to_order_payment_status.php` adds `unpaid` and sets default for new orders.
