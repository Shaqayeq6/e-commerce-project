# StepStyle Test Cases

This document lists core manual test cases for our EECS4413 Project.

## Customer Authentication

### TC-01 Register New Customer
- Preconditions: User is logged out.
- Steps:
  1. Open the registration page.
  2. Enter a valid full name, email, and password.
  3. Submit the form.
- Expected Result:
  - Account is created successfully.
  - User is logged in automatically or redirected appropriately.
  - User data is stored in the backend persistence layer.

### TC-02 Login with Valid Credentials
- Preconditions: Customer account already exists.
- Steps:
  1. Open the login page.
  2. Enter valid email and password.
  3. Submit the form.
- Expected Result:
  - Login succeeds.
  - User session is stored.
  - Navbar/profile reflects logged-in state.

### TC-03 Login with Invalid Credentials
- Preconditions: Customer account already exists.
- Steps:
  1. Open the login page.
  2. Enter an incorrect password.
  3. Submit the form.
- Expected Result:
  - Login is rejected.
  - Error message is shown.
  - User remains logged out.

## Product Catalog and Browsing

### TC-04 Load Product Catalog
- Preconditions: Backend is running.
- Steps:
  1. Open the home page.
- Expected Result:
  - Products are loaded from the backend.
  - Catalog displays product cards.
  - No fetch error is shown.

### TC-05 Search Products
- Preconditions: Catalog page is loaded.
- Steps:
  1. Enter a product name or brand in the search box.
- Expected Result:
  - Catalog filters to matching products only.

### TC-06 Filter and Sort Products
- Preconditions: Catalog page is loaded.
- Steps:
  1. Select a category filter.
  2. Select a brand filter.
  3. Apply sort by name or price.
- Expected Result:
  - Product list updates according to the selected filter and sort options.

### TC-07 Open Product Details
- Preconditions: Catalog page is loaded.
- Steps:
  1. Click `View Details` on a product card.
- Expected Result:
  - Product details page opens.
  - Correct product information is displayed.
  - Size selection and add-to-cart actions are available.

## Cart and Checkout

### TC-08 Add Product to Cart
- Preconditions: Product details page is open.
- Steps:
  1. Select a size.
  2. Choose quantity if applicable.
  3. Click `Add to Cart`.
- Expected Result:
  - Product is added to the cart.
  - Cart count updates in the navbar.

### TC-09 Update Cart Quantity
- Preconditions: Cart contains at least one item.
- Steps:
  1. Open the cart page.
  2. Increase or decrease item quantity.
- Expected Result:
  - Quantity updates correctly.
  - Item subtotal and cart total update correctly.

### TC-10 Remove Cart Item
- Preconditions: Cart contains at least one item.
- Steps:
  1. Open the cart page.
  2. Remove an item.
- Expected Result:
  - Item is removed from the cart.
  - Total is recalculated.

### TC-11 Complete Checkout Successfully
- Preconditions: Cart contains valid items and stock is available.
- Steps:
  1. Open checkout.
  2. Enter valid shipping and payment information.
  3. Submit the order.
- Expected Result:
  - Checkout succeeds.
  - Order is saved.
  - Inventory is reduced.
  - Cart is cleared.
  - Confirmation page is shown.

### TC-12 Order Confirmation Email
- Preconditions: SMTP credentials are configured and checkout succeeds.
- Steps:
  1. Place an order with a valid customer email.
- Expected Result:
  - Confirmation email is sent to the customer email address.
  - Confirmation page shows email status.
  - Order record stores confirmation email metadata.

## Orders and Profile

### TC-13 Customer Order History
- Preconditions: Logged-in customer has at least one order.
- Steps:
  1. Open the profile page or orders page.
- Expected Result:
  - Only that customer’s orders are shown.
  - Order totals and dates are displayed correctly.

### TC-14 Update Customer Profile
- Preconditions: User is logged in.
- Steps:
  1. Open profile page.
  2. Edit address/contact information.
  3. Save changes.
- Expected Result:
  - Updated information is saved successfully.
  - New values persist after reload.

## Wishlist and Enhanced Customer Features

### TC-15 Add Product to Wishlist from Catalog
- Preconditions: Catalog page is loaded.
- Steps:
  1. Click the heart icon on a product card.
- Expected Result:
  - Product is added to wishlist.
  - Wishlist count updates in navbar.

### TC-16 Add Product to Wishlist from Product Details
- Preconditions: Product details page is open.
- Steps:
  1. Click the wishlist heart near the product title.
- Expected Result:
  - Product is added to wishlist.
  - Saved state is shown on screen.

### TC-17 Move Wishlist Item to Cart
- Preconditions: Wishlist contains at least one item.
- Steps:
  1. Open the wishlist page.
  2. Click `Move to Cart`.
- Expected Result:
  - Item is added to cart.
  - Item is removed from wishlist.

### TC-18 Recently Viewed Products
- Preconditions: User has visited multiple product detail pages.
- Steps:
  1. Open several product detail pages.
  2. Return to the catalog page.
- Expected Result:
  - Recently viewed section shows recent products.
  - Most recent items appear first.

### TC-19 Recommended Products
- Preconditions: Product details page is open.
- Steps:
  1. Scroll to the recommendations section.
  2. Click a recommended product.
- Expected Result:
  - Related products are shown.
  - Clicking a recommendation opens the selected product page.
  - Page scroll resets correctly to the top of the new product page.

### TC-20 Product Reviews
- Preconditions: Product details page is open.
- Steps:
  1. Submit a review with name, rating, and comment.
  2. Refresh the page.
- Expected Result:
  - Review is displayed.
  - Average rating updates.
  - Review persists in local storage.

## Admin Features

### TC-21 Admin Login and Access
- Preconditions: Admin account exists.
- Steps:
  1. Log in using admin credentials.
  2. Open the admin page.
- Expected Result:
  - Admin routes are accessible.
  - Admin-only controls are visible.

### TC-22 Add Product as Admin
- Preconditions: Logged in as admin.
- Steps:
  1. Open admin page.
  2. Fill out product form.
  3. Submit.
- Expected Result:
  - Product is added successfully.
  - Product appears in admin list and catalog.

### TC-23 Update Product Inventory
- Preconditions: Logged in as admin and product exists.
- Steps:
  1. Edit product quantity or price.
  2. Save changes.
- Expected Result:
  - Product updates are saved.
  - Updated values appear in catalog and admin view.

### TC-24 View Customer Accounts
- Preconditions: Logged in as admin.
- Steps:
  1. Open admin customers page.
- Expected Result:
  - Customer list is displayed.
  - Customer details can be reviewed and updated.

### TC-25 View Orders as Admin
- Preconditions: Logged in as admin and at least one order exists.
- Steps:
  1. Open admin orders view.
- Expected Result:
  - Order history is visible.
  - Customer and order details are displayed correctly.

## Database and Persistence

### TC-26 PostgreSQL Persistence Mode
- Preconditions: Backend environment is configured for PostgreSQL.
- Steps:
  1. Start backend server.
- Expected Result:
  - Backend startup log indicates PostgreSQL persistence is active.

### TC-27 Seed PostgreSQL from JSON
- Preconditions: PostgreSQL connection is configured.
- Steps:
  1. Run `npm run seed:postgres`.
- Expected Result:
  - Schema is created successfully.
  - Users, products, and orders are inserted into PostgreSQL.

### TC-28 Persist New Order to Database
- Preconditions: Backend is running in PostgreSQL mode.
- Steps:
  1. Place a new order.
  2. Refresh orders page or query backend data.
- Expected Result:
  - New order is stored in PostgreSQL.
  - Order remains available after backend restart.
