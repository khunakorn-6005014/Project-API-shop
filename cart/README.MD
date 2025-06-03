APIproject/
 ├── cart/
 │   ├── controllers/       # Handles requests & business logic
 │   │   ├── cartController.js
 │   ├── models/            # Defines database structure
 │   │   ├── cart.js
 │   ├── routes/            # API endpoints for interacting with Cart
 │   │   ├── cartRoutes.js
 │   ├── services/          # Handles core logic separate from controllers
 │   │   ├── cartService.js
 │   ├── validations/       # Validates cart actions (adding/removing items)
 │   │   ├── cartValidation.js
 │   ├── middleware/        # Middleware for verifying user actions
 │   │   ├── verifyCart.js
 │   ├── utils/             # Utility functions (calculating totals, formatting responses)
 │   │   ├── cartUtils.js
 │   ├── index.js           # Entry point for setting up the Cart module
 📝 Role Breakdown
## Controllers (cartController.js) 
→ Directly handles API requests.
## Models (cart.js) → 
Defines how Cart data is stored in MongoDB.
## Routes (cartRoutes.js) → 
Sets up endpoints (/cart/add, /cart/remove, etc.).
## Services (cartService.js)-
 → Contains business logic for managing cart (auto-updating totals, merging carts, clearing carts).
## Validations (cartValidation.js)
 → Ensures users don’t add invalid or duplicate items.
## Middleware (verifyCart.js) → 
Checks user authentication before modifying the cart.
## Utils (cartUtils.js) 
→ Houses helper functions for dynamic calculations.
