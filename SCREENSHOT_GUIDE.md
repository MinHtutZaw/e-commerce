# Screenshot Guide for Test Cases

## Instructions for Capturing Test Case Screenshots

### Preparation
1. Open your application in a browser (preferably Chrome/Firefox)
2. Use light mode for consistent screenshots (or dark mode if preferred)
3. Clear browser console/devtools before capturing
4. Use full-screen browser window
5. Recommended screenshot tool: Windows Snipping Tool, Lightshot, or ShareX

---

## Fig 5.1 – Account Sign Up

### What to Capture
The successful registration flow showing the user being redirected to login after signup.

### Steps:
1. Navigate to: `http://localhost:8000/register`
2. Fill in the registration form:
   - Name: `John Doe`
   - Email: `john.doe@example.com`
   - Password: `password123`
   - Confirm Password: `password123`
3. Click "Register" button
4. **Screenshot 1**: Capture the registration page with filled form (before submitting)
5. **Screenshot 2**: Capture the login page after successful registration showing success message

### What Should Be Visible:
- ✓ Registration form fields
- ✓ Success message/toast notification
- ✓ Redirection to login page
- ✓ "Registration successful" or similar message

### Page Location:
- Route: `/register`
- Component: `resources/js/pages/auth/register.tsx`

---

## Fig 5.2 – User Authentication

### What to Capture
Dashboard displayed after successful login.

### Steps:
1. Navigate to: `http://localhost:8000/login`
2. Enter credentials:
   - Email: `john.doe@example.com` (or existing user)
   - Password: `password123`
3. Click "Log In" button
4. Wait for redirection
5. **Screenshot**: Capture the dashboard/home page after login

### What Should Be Visible:
- ✓ User's name in navigation/header
- ✓ Dashboard content
- ✓ Logout button
- ✓ Navigation menu
- ✓ Welcome message or user profile indicator

### Page Location:
- Route: `/dashboard` or `/`
- Component: `resources/js/pages/admin/dashboard.tsx` (admin) or `resources/js/pages/landing/welcome.tsx` (customer)

---

## Fig 5.3 – Login Validation (Invalid Credentials)

### What to Capture
Error message shown when entering wrong credentials.

### Steps:
1. Navigate to: `http://localhost:8000/login`
2. Enter INVALID credentials:
   - Email: `wrong@email.com`
   - Password: `wrongpassword`
3. Click "Log In" button
4. **Screenshot**: Capture the login page showing error message

### What Should Be Visible:
- ✓ Login form
- ✓ Red error message: "These credentials do not match our records"
- ✓ Email and password fields highlighted in red (validation)
- ✓ Error icon or alert component

### Page Location:
- Route: `/login`
- Component: `resources/js/pages/auth/login.tsx`

---

## Fig 5.4 – Add to Cart Function

### What to Capture
Shopping cart showing newly added product.

### Steps:
1. Navigate to: `http://localhost:8000/products`
2. Browse available products
3. Select a product
4. Choose a size from dropdown (e.g., "M")
5. Click "Add to Cart" button
6. Wait for success toast notification
7. Navigate to: `http://localhost:8000/cart`
8. **Screenshot**: Capture the cart page showing the added item

### What Should Be Visible:
- ✓ Product name
- ✓ Selected size (e.g., "M")
- ✓ Quantity (1)
- ✓ Unit price
- ✓ Subtotal
- ✓ Total amount
- ✓ Product image (if available)
- ✓ Remove/Update quantity buttons

### Page Location:
- Route: `/cart`
- Component: `resources/js/pages/landing/cart.tsx`

### Example Data:
```
Product: White School Shirt
Size: M
Quantity: 1
Price: 15,000 MMK
Subtotal: 15,000 MMK
```

---

## Fig 5.5 – Inventory Update

### What to Capture
Product stock quantity decreasing after an order is placed.

### Steps (Two-part screenshot):

#### Part A - Before Order:
1. Login as admin: `http://localhost:8000/login`
2. Navigate to: `http://localhost:8000/admin/products`
3. **Screenshot 1**: Capture product list showing stock quantity (e.g., "100 units")

#### Part B - After Order:
4. Logout from admin
5. Login as customer (or guest checkout)
6. Add product to cart
7. Complete checkout and place order
8. Login back as admin
9. Navigate to: `http://localhost:8000/admin/products`
10. **Screenshot 2**: Capture the same product showing reduced stock (e.g., "99 units")

### What Should Be Visible:
- ✓ Product name
- ✓ Stock quantity BEFORE order (e.g., 100)
- ✓ Stock quantity AFTER order (e.g., 99)
- ✓ Stock indicator color (green/amber/red)
- ✓ Same product highlighted in both screenshots

### Page Location:
- Route: `/admin/products`
- Component: `resources/js/pages/admin/products/index.tsx`

### Tips:
- Use arrows or circles to highlight the stock number
- Create a side-by-side comparison image
- Mark "BEFORE" and "AFTER" clearly

---

## Fig 5.6 – Order Total Calculation

### What to Capture
Checkout page showing multiple items and correct total calculation.

### Steps:
1. Add multiple products to cart:
   - Product 1: White Shirt (Size M) - Qty 2 - 15,000 MMK each = 30,000 MMK
   - Product 2: Navy Blazer (Size L) - Qty 1 - 45,000 MMK = 45,000 MMK
2. Navigate to: `http://localhost:8000/cart`
3. Verify cart items and quantities
4. Click "Proceed to Checkout"
5. Navigate to: `http://localhost:8000/checkout`
6. **Screenshot**: Capture checkout page with order summary

### What Should Be Visible:
- ✓ List of all cart items
- ✓ Individual item prices
- ✓ Quantities
- ✓ Subtotals for each item
- ✓ Order subtotal (30,000 + 45,000 = 75,000 MMK)
- ✓ Shipping cost (if applicable)
- ✓ **Total Amount: 75,000 MMK**
- ✓ Calculation breakdown

### Page Location:
- Route: `/checkout`
- Component: `resources/js/pages/landing/checkout.tsx`

### Calculation Example:
```
Item 1: White Shirt x 2       = 30,000 MMK
Item 2: Navy Blazer x 1       = 45,000 MMK
-------------------------------------------
Subtotal:                     = 75,000 MMK
Shipping:                     =  5,000 MMK
-------------------------------------------
TOTAL:                        = 80,000 MMK
```

---

## Fig 5.7 – Custom Order Handling

### What to Capture
Custom order form submission and confirmation.

### Steps:

#### Part A - Customer Submits:
1. Navigate to: `http://localhost:8000/` (homepage)
2. Look for "Custom Order" or "Request Custom Uniform" link
3. Click on custom order form
4. Fill in the form:
   - School Name: `ABC International School`
   - Uniform Type: `School`
   - Gender: `Unisex`
   - Quantity: `50`
   - Description: `Need custom blazers with school logo`
   - Budget: `5000-10000 MMK per piece`
5. Submit the form
6. **Screenshot 1**: Capture the custom order form (filled, before submission)
7. **Screenshot 2**: Capture success message after submission

#### Part B - Admin Views:
8. Login as admin
9. Navigate to admin panel (custom orders section)
10. **Screenshot 3**: Capture admin panel showing the submitted custom order

### What Should Be Visible:

**Customer View:**
- ✓ Custom order form with all fields
- ✓ Submit button
- ✓ Success confirmation message

**Admin View:**
- ✓ Custom order entry in admin panel
- ✓ Customer details (name, email, phone)
- ✓ School name
- ✓ Uniform specifications
- ✓ Quantity requested
- ✓ Status (Pending/Confirmed)
- ✓ Admin action buttons (Approve/Quote/Reject)

### Page Location:
- Customer Route: `/custom-orders` (if exists) or homepage form
- Admin Route: `/admin/custom-orders`
- Component: `resources/js/pages/landing/custom-order.tsx` (customer)
- Component: `resources/js/pages/admin/custom-orders/index.tsx` (admin)

---

## Additional Tips for All Screenshots

### General Best Practices:
1. **Resolution**: Use 1920x1080 or 1366x768 for consistency
2. **Browser**: Use Chrome or Firefox (hide bookmarks bar)
3. **Zoom**: Set browser zoom to 100%
4. **Annotations**: Add arrows, circles, or text to highlight important elements
5. **File Format**: Save as PNG or JPG
6. **File Naming**: Use descriptive names like `fig5-1-signup.png`

### What to Highlight:
- ✅ Success messages (green)
- ❌ Error messages (red)
- 🔵 Action buttons
- 📊 Data changes (stock updates)
- 💰 Price calculations
- 👤 User information

### What to Hide/Blur:
- Real email addresses (if using production data)
- Sensitive user information
- API keys or tokens (if visible in console)

---

## Screenshot Checklist

Before submitting, verify each screenshot has:

- [ ] Clear visibility (not blurry)
- [ ] Relevant content in frame
- [ ] No unnecessary UI elements (close extra tabs)
- [ ] Proper labeling (Fig number and title)
- [ ] Annotations/highlights where needed
- [ ] Consistent style across all screenshots
- [ ] Proper resolution
- [ ] Saved with correct filename

---

## Tools Recommended

### Screenshot Tools:
- **Windows**: Snipping Tool (Win + Shift + S)
- **Mac**: Screenshot (Cmd + Shift + 4)
- **Cross-platform**: 
  - Lightshot (https://app.prntscr.com)
  - ShareX (Windows)
  - Flameshot (Linux)

### Annotation Tools:
- Microsoft Paint
- Paint.NET
- GIMP (free)
- Photoshop
- Snagit

### Browser Extensions:
- Awesome Screenshot
- Nimbus Screenshot
- Full Page Screen Capture

---

## Sample Test Data

Use this consistent test data for all screenshots:

### Test User Accounts:
```
Customer Account:
Email: customer@test.com
Password: password123
Name: John Customer

Admin Account:
Email: admin@test.com
Password: password123
Name: Admin User
```

### Test Products:
```
Product 1:
Name: White School Shirt
Category: Shirts
Price: 15,000 MMK
Stock: 100 units
Sizes: S, M, L, XL
Gender: Unisex
Uniform Type: School

Product 2:
Name: Navy Blazer
Category: Blazers
Price: 45,000 MMK
Stock: 50 units
Sizes: M, L, XL
Gender: Male
Uniform Type: University

Product 3:
Name: Plaid Skirt
Category: Skirts
Price: 25,000 MMK
Stock: 75 units
Sizes: S, M, L
Gender: Female
Uniform Type: College
```

---

## Final Notes

- Take screenshots in sequence to tell a complete story
- Ensure consistency in theme (light/dark mode)
- Add figure numbers and captions in your report
- Reference these screenshots in the corresponding test case descriptions
- Keep original high-resolution versions as backup

**Good luck with your documentation!** 📸

---

*Screenshot Guide Version 1.0 - Created January 27, 2026*
