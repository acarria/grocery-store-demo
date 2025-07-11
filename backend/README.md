## Logging

This backend uses [structlog](https://www.structlog.org/) for robust, context-aware logging. All logs are output in JSON format and include a unique `request_id` for each HTTP request, enabling easy tracing across the system.

### Usage

To log in any backend file, import the logger from the logging utility:

```python
from app.core.logging import get_logger
logger = get_logger("your_module_name")

logger.info("event_name", key1="value1", key2="value2")
```

### Request IDs

Every HTTP request is automatically assigned a unique `request_id` (UUID), which is included in all logs for that request. This enables you to trace all logs related to a single request across the system.

### Adding Context

You can add additional context to your logs using structlog's contextvars or by passing extra key-value pairs to your log calls. For advanced usage, see the [structlog documentation](https://www.structlog.org/en/stable/contextvars.html).

### Best Practices
- Use structured logging (key-value pairs) for all log events.
- Always include meaningful event names and context.
- Use the provided logger from `app.core.logging` for consistency. 

## API Endpoints

### Products
- `GET /api/v1/products/` — List all products. Supports filtering by category, search (with fuzzy search), and pagination.
- `GET /api/v1/products/{product_id}` — Retrieve a specific product by its ID.
- `GET /api/v1/products/search/suggestions?query=...` — Get product search suggestions based on a partial query.

### Categories
- `GET /api/v1/categories/` — List all product categories.
- `GET /api/v1/categories/{category_id}` — Retrieve a specific category by its ID.

### Cart (Authenticated)
- `GET /api/v1/cart/` — Retrieve the current user's cart. If the cart does not exist, it is created.
- `POST /api/v1/cart/items` — Add an item to the cart. Requires a JSON body with `product_id` and `quantity`. If the item already exists, its quantity is updated. Checks for stock and product existence.

All cart routes require authentication (Bearer token).

---
For more details on request/response schemas, see the code in `app/schemas/` and the FastAPI auto-generated docs at `/docs` when the backend is running. 

## Seeding the Database for Testing

To populate your development database with sample data (products, categories, users, and order history), use the provided seed script:

```bash
python seed_data.py
```

This script will:
- **Clear all existing data** from the relevant tables (orders, order_items, cart_items, carts, products, categories, users)
- Add a set of sample categories and products
- Create an admin user and a sample customer user
- Add mock order history for the customer user

**Default credentials:**
- Admin: `admin@savegowholesale.com` / `admin123`
- Customer: `customer@savegowholesale.com` / `customer123`

> **Warning:** This will delete all existing data in the above tables. Use only in development/testing environments!

After seeding, you can log in as the sample customer and view order history in the frontend. 