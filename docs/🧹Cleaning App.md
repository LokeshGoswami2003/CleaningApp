# 🧹Cleaning App requirement

##       **🧹Cleaning App**

# **Cleaning App Requirements (Like Urban Company)**

## **1️. User Roles (Main Actors)**

You should define **3 main roles**:

###  **Customer (User)**

People who book cleaning services.

**Features:**

* Sign up / Login (Email, Phone, Google)  
* Select service (Home cleaning, Sofa, Bathroom)  
* Choose date & time  
* Add address  
* View service price  
* Book service  
* Online payment  
* Track booking status  
* Chat with cleaner  
* Rate & review service  
* View booking history

---

###  **Service Provider (Cleaner)**

People who perform cleaning.

**Features:**

* Register as cleaner  
* Upload ID proof  
* Upload skills/services  
* Accept or reject booking  
* View daily schedule  
* Update job status  
* Earnings dashboard  
* Withdrawal request  
* Ratings tracking

---

###  **Admin (Web Dashboard)**

You (owner) control everything.

**Features:**

* Manage users  
* Manage cleaners  
* Add services  
* Set pricing  
* Assign bookings  
* View reports  
* Manage payments  
* Handle complaints

---

# **2️. Core Features of Cleaning App**

## **Service Categories**

Examples:

* Full House Cleaning  
* Bathroom Cleaning  
* Kitchen Cleaning  
* Sofa Cleaning  
* Mattress Cleaning  
* Office Cleaning  
* Deep Cleaning

Each service should have:

* Name  
* Description  
* Price  
* Duration  
* Image

##  **Booking System**

This is the **heart of the app**.

Flow:

User selects:

1. Service  
2. Date  
3. Time  
4. Address  
5. Payment

Then:

Booking created → Cleaner assigned → Service completed

Booking Status:

* Pending  
* Accepted  
* In Progress  
* Completed  
* Cancelled

##  **Payment System**

Options:

* UPI  
* Credit/Debit Card  
* Wallet  
* Cash on Delivery

Recommended:

* Razorpay  
* Stripe

---

##  **Location & Address**

Important features:

* Add multiple addresses  
* Google Maps integration  
* Location detection  
* Service availability check

##  **Ratings & Reviews**

After service:

User gives:

* Rating (1–5)  
* Feedback  
* Review text

Used to:

* Improve service  
* Rank cleaners

##  **Notifications**

Use:

* Push notifications  
* SMS  
* Email

Examples:

* Booking confirmed  
* Cleaner assigned  
* Service started  
* Payment successful

# **Screens You Must Build (UI Requirements)**

##  **Customer App Screens**

* Splash Screen  
* Login / Signup  
* Home Screen  
* Service List  
* Service Details  
* Select Date & Time  
* Address Page  
* Payment Page  
* Booking Confirmation  
* Booking History  
* Profile  
* Reviews

---

##  **Cleaner App Screens**

* Login  
* Dashboard  
* Booking Requests  
* My Jobs  
* Earnings  
* Profile

##  **Admin Panel Screens**

(Web dashboard)

* Dashboard  
* Manage Users  
* Manage Cleaners  
* Manage Services  
* Manage Bookings  
* Reports  
* Payments

# **Tech Stack Recommendation**

Since you're experienced with **React \+ MERN**, this fits well with your background 👩‍💻

## **Frontend**

* React (Web)  
* React Native OR Flutter (Mobile)

## **Backend**

* Node.js  
* Express.js

## **Database**

* MongoDB OR PostgreSQL

## **Other Tools**

* Firebase (Notifications)  
* Google Maps API  
* Razorpay (Payments)

# **Advanced Features (Phase 2\)**

Add later:

* Live cleaner tracking  
* AI price estimation  
* Subscription plans  
* Coupons & discounts  
* Chat system  
* Multi-city support  
* Referral system

# **Realistic Development Timeline**

If working alone:

* UI Design → 1 week  
* Backend APIs → 2 weeks  
* Frontend → 2 weeks  
* Testing → 1 week

Total:

   **5–6 weeks**

# database

# **Database Design (Basic Tables)**

If you're using **MERN stack** or **PostgreSQL** (which you've used before), you'll need:

**Mobile App Flow (Customer)** 

**Splash Screen**

      **↓**

**Login / Signup**

      **↓**

**Select City**

      **↓**

**Home Screen**

      **↓**

**Choose Service**

      **↓**

**Select Date & Time**

      **↓**

**Add Address**

      **↓**

**Payment**

      **↓**

**Booking Confirmation**

      **↓**

**Track Service**

      **↓**

**Rate Service**

## **Booking Flow**

**User selects service**

       **↓**

**Select Date**

       **↓**

**Select Time**

       **↓**

**Choose Address**

       **↓**

**Choose Payment**

       **↓**

**Booking Created**

## **Booking Status Flow**

Pending

Accepted

In Progress

Completed

Cancelled

### **Users Table**

id  
name  
email  
phone  
password  
role  
address

### **Services Table**

id  
name  
description  
price  
duration  
image

### **Bookings Table**

id  
user\_id  
service\_id  
provider\_id  
date  
time  
status  
total\_price

### **Payments Table**

id  
booking\_id  
payment\_method  
amount  
status  
transaction\_id

### **Reviews Table**

id  
user\_id  
provider\_id  
rating  
Review

## **City Table**

id  
city\_name  
state  
status

**Core Tables:**

Users  
Providers  
Cities  
Services  
Bookings  
Payments  
Reviews  
Addresses

# **Advanced Database Schema — Cleaning App**

This schema supports:

✅ Multi-city  
 ✅ Multiple service types  
 ✅ Provider management  
 ✅ Booking workflow  
 ✅ Payments  
 ✅ Ratings  
 ✅ Admin control  
 ✅ Future scalability

---

# **Core Architecture Overview**

**Main Modules:**

Users  
Providers  
Cities  
Services  
Bookings  
Payments  
Reviews  
Addresses  
Notifications  
Coupons  
---

# **USERS TABLE (Customers \+ Admins)**

Stores all users.

CREATE TABLE users (  
   id UUID PRIMARY KEY,  
   full\_name VARCHAR(100),  
   email VARCHAR(100) UNIQUE,  
   phone VARCHAR(15) UNIQUE NOT NULL,  
   password\_hash TEXT,  
   role VARCHAR(20) DEFAULT 'customer',

   profile\_image TEXT,

   is\_verified BOOLEAN DEFAULT FALSE,  
   is\_active BOOLEAN DEFAULT TRUE,

   created\_at TIMESTAMP DEFAULT CURRENT\_TIMESTAMP,  
   updated\_at TIMESTAMP DEFAULT CURRENT\_TIMESTAMP  
);

Roles:

* customer  
* admin  
* support

---

# **PROVIDERS TABLE (Cleaners)**

Separate from users.

CREATE TABLE providers (  
   id UUID PRIMARY KEY,

   user\_id UUID REFERENCES users(id),

   city\_id UUID REFERENCES cities(id),

   experience\_years INT,  
   rating DECIMAL(2,1) DEFAULT 0,  
   total\_jobs INT DEFAULT 0,

   is\_verified BOOLEAN DEFAULT FALSE,  
   is\_available BOOLEAN DEFAULT TRUE,

   created\_at TIMESTAMP DEFAULT CURRENT\_TIMESTAMP  
);  
---

# **CITIES TABLE (Multi-City Ready)**

CREATE TABLE cities (  
   id UUID PRIMARY KEY,  
   city\_name VARCHAR(100),  
   state VARCHAR(100),

   is\_active BOOLEAN DEFAULT TRUE,

   created\_at TIMESTAMP DEFAULT CURRENT\_TIMESTAMP  
);

Example:

* Vijayawada  
* Hyderabad  
* Bangalore

---

# **ADDRESSES TABLE**

Stores user addresses.

CREATE TABLE addresses (  
   id UUID PRIMARY KEY,

   user\_id UUID REFERENCES users(id),

   city\_id UUID REFERENCES cities(id),

   address\_line1 TEXT,  
   address\_line2 TEXT,

   landmark VARCHAR(150),  
   pincode VARCHAR(10),

   latitude DECIMAL(10,8),  
   longitude DECIMAL(11,8),

   is\_default BOOLEAN DEFAULT FALSE,

   created\_at TIMESTAMP DEFAULT CURRENT\_TIMESTAMP  
);  
---

# **SERVICE CATEGORIES**

Example:

* Home Cleaning  
* Office Cleaning

CREATE TABLE service\_categories (  
   id UUID PRIMARY KEY,

   name VARCHAR(100),  
   description TEXT,

   icon TEXT,

   is\_active BOOLEAN DEFAULT TRUE  
);  
---

# **SERVICES TABLE**

Example:

* Full House Cleaning  
* Sofa Cleaning

CREATE TABLE services (  
   id UUID PRIMARY KEY,

   category\_id UUID REFERENCES service\_categories(id),

   service\_name VARCHAR(150),  
   description TEXT,

   base\_price DECIMAL(10,2),

   duration\_minutes INT,

   image\_url TEXT,

   is\_active BOOLEAN DEFAULT TRUE,

   created\_at TIMESTAMP DEFAULT CURRENT\_TIMESTAMP  
);  
---

# **PROVIDER SERVICES (Many-to-Many)**

Providers can offer multiple services.

CREATE TABLE provider\_services (  
   id UUID PRIMARY KEY,

   provider\_id UUID REFERENCES providers(id),  
   service\_id UUID REFERENCES services(id),

   price\_override DECIMAL(10,2),

   created\_at TIMESTAMP DEFAULT CURRENT\_TIMESTAMP  
);  
---

# **BOOKINGS TABLE (Core Module)**

This is the **heart of the system**.

CREATE TABLE bookings (  
   id UUID PRIMARY KEY,

   user\_id UUID REFERENCES users(id),

   provider\_id UUID REFERENCES providers(id),

   service\_id UUID REFERENCES services(id),

   address\_id UUID REFERENCES addresses(id),

   booking\_date DATE,  
   booking\_time TIME,

   status VARCHAR(30) DEFAULT 'pending',

   total\_price DECIMAL(10,2),

   notes TEXT,

   created\_at TIMESTAMP DEFAULT CURRENT\_TIMESTAMP,  
   updated\_at TIMESTAMP DEFAULT CURRENT\_TIMESTAMP  
);

Booking Status:

pending  
accepted  
in\_progress  
completed  
cancelled  
---

# **PAYMENTS TABLE**

Supports:

* UPI  
* Card  
* Cash

CREATE TABLE payments (  
   id UUID PRIMARY KEY,

   booking\_id UUID REFERENCES bookings(id),

   payment\_method VARCHAR(50),

   transaction\_id VARCHAR(150),

   amount DECIMAL(10,2),

   status VARCHAR(30),

   paid\_at TIMESTAMP  
);

Payment Methods:

upi  
card  
cash  
wallet  
---

#  **REVIEWS TABLE**

Customer feedback.

CREATE TABLE reviews (  
   id UUID PRIMARY KEY,

   booking\_id UUID REFERENCES bookings(id),

   user\_id UUID REFERENCES users(id),

   provider\_id UUID REFERENCES providers(id),

   rating INT CHECK (rating BETWEEN 1 AND 5),

   comment TEXT,

   created\_at TIMESTAMP DEFAULT CURRENT\_TIMESTAMP  
);  
---

# **NOTIFICATIONS TABLE**

Push notifications tracking.

CREATE TABLE notifications (  
   id UUID PRIMARY KEY,

   user\_id UUID REFERENCES users(id),

   title VARCHAR(150),

   message TEXT,

   is\_read BOOLEAN DEFAULT FALSE,

   created\_at TIMESTAMP DEFAULT CURRENT\_TIMESTAMP  
);  
---

# **COUPONS TABLE**

Discount system.

CREATE TABLE coupons (  
   id UUID PRIMARY KEY,

   code VARCHAR(50) UNIQUE,

   discount\_type VARCHAR(20),

   discount\_value DECIMAL(10,2),

   min\_order\_amount DECIMAL(10,2),

   expiry\_date DATE,

   is\_active BOOLEAN DEFAULT TRUE  
);  
---

# **BOOKING STATUS HISTORY**

Tracks status changes.

CREATE TABLE booking\_status\_history (  
   id UUID PRIMARY KEY,

   booking\_id UUID REFERENCES bookings(id),

   status VARCHAR(30),

   changed\_at TIMESTAMP DEFAULT CURRENT\_TIMESTAMP  
);

Very useful for:

* Tracking progress  
* Analytics

---

# **ADMIN SETTINGS TABLE**

CREATE TABLE admin\_settings (  
   id UUID PRIMARY KEY,

   setting\_key VARCHAR(100),

   setting\_value TEXT  
);  
---

# **ANALYTICS TABLE (Optional Advanced)**

For reporting.

CREATE TABLE analytics\_logs (  
   id UUID PRIMARY KEY,

   event\_type VARCHAR(100),

   user\_id UUID,

   metadata JSONB,

   created\_at TIMESTAMP DEFAULT CURRENT\_TIMESTAMP  
);  
---

# **Relationships Overview**

Simplified ER flow:

Users → Addresses  
Users → Bookings  
Providers → Bookings  
Services → Bookings  
Bookings → Payments  
Bookings → Reviews  
Cities → Providers  
Cities → Addresses  
---

# **Recommended Indexes (Performance)**

Very important for large data.

CREATE INDEX idx\_user\_phone  
ON users(phone);

CREATE INDEX idx\_booking\_status  
ON bookings(status);

CREATE INDEX idx\_provider\_city  
ON providers(city\_id);

CREATE INDEX idx\_booking\_date  
ON bookings(booking\_date);  
---

# **Future-Ready Additions**

You can easily add:

✅ Multi-city  
 ✅ Dynamic pricing  
 ✅ Subscription plans  
 ✅ Real-time tracking  
 ✅ Surge pricing  
 ✅ Provider shifts

Without breaking schema.

# sequence diagram of App

# **Cleaning App UI Wireframes (Mobile First)**

These are **low-fidelity wireframes** — simple layouts showing structure.

---

# **1️. Splash Screen**

![][image1]

Purpose:

* Branding  
* Load app resources

# **Login / Signup Screen**

![][image2]

Alternative:

* Email login  
* Google login

# **Select City Screen (Future Ready)**

![][image3]

# **Home Screen (Most Important)**

![][image4]

Key features:

* Categories  
* Search  
* Service cards

# **Service List Screen**

![][image5]

# **Service Details Screen**

![][image6]

# **Select Date & Time Screen**

![][image7]

# **Address Screen**

![][image8]

Use:

* Google Maps integration

# **Payment Screen**

![][image9]

# **1.Booking Confirmation Screen**

![][image10]

# **1.1Booking Tracking Screen**

![][image11]

# **1.2 Booking History Screen**

![][image12]

# **Profile Screen**

![][image13]

# **Cleaner App Wireframes (Short Version)**

Cleaner Dashboard:

![][image14]

# **Admin Panel (Web Wireframe)**

![][image15]

# figma UI design

# **Figma UI Design Plan — Cleaning App**

This will be a **professional mobile-first design system**.

---

#  **Step 1 — Create Figma File Structure**

Inside **Figma**, create pages like this:

📁 Cleaning App UI

Page 1: Design System  
Page 2: Customer App  
Page 3: Cleaner App  
Page 4: Admin Dashboard  
Page 5: Components Library

This keeps your design scalable.

---

#  **Step 2 — Design System (Very Important)**

Create reusable styles first.

##  **Color Palette**

Use a **clean professional look**.

Primary Colors:

* Primary Blue → `#2F80ED`  
* Secondary Green → `#27AE60`  
* Background → `#F7F9FC`  
* Card Background → `#FFFFFF`

Text Colors:

* Title → `#1F2937`  
* Subtitle → `#6B7280`  
* Border → `#E5E7EB`

Status Colors:

* Success → `#22C55E`  
* Warning → `#F59E0B`  
* Error → `#EF4444`

---

## **Typography**

Recommended:

Font:

* **Poppins** (Best for mobile apps)

Text Styles:

Heading 1 → 24px Bold  
Heading 2 → 20px SemiBold  
Body → 16px Regular  
Small → 14px Regular  
Button → 16px Medium  
---

##  **Components to Create First**

Create reusable components:

* Button  
* Text Field  
* Service Card  
* Booking Card  
* Bottom Navigation  
* App Bar  
* Rating Stars

These save huge time later.

---

# **Step 3 — Customer App Screens (Figma Layout)**

Now we design each screen.

---

# **Screen 1 — Splash Screen**

Layout:

\[ Center Logo \]

🧹 CLEANIFY

"Trusted Cleaning Services"

Loading indicator

Figma Elements:

* Logo (center)  
* Brand name  
* Tagline  
* Loader

---

# **Screen 2 — Login Screen**

Layout:

← Back

Welcome Back 👋

Mobile Number  
\[\_\_\_\_\_\_\_\_\_\_\_\_\]

OTP  
\[\_\_\_\_\_\_\_\_\_\_\_\_\]

\[ Login Button \]

──────── OR ────────

\[ Continue with Google \]

New user? Sign Up

Use:

* Text Input component  
* Primary Button

---

# **Screen 3 — Home Screen (Most Important)**

Layout:

📍 Vijayawada        🔔

🔍 Search services...

──────────────

Popular Services

\[ Full House \]  
\[ Kitchen \]  
\[ Bathroom \]  
\[ Sofa \]

──────────────

Home Cleaning

🧹 Full House Cleaning  
₹2499  
⭐ 4.8

🧽 Kitchen Cleaning  
₹899  
⭐ 4.6

──────────────

Bottom Navigation

🏠 Home  
📅 Bookings  
👤 Profile

Components:

* Category Cards  
* Service Cards  
* Bottom Navigation

---

# **Screen 4 — Service Details**

Layout:

← Back

\[ Service Image \]

Full House Cleaning

⭐ 4.8   ⏱ 4 Hours

Price: ₹2499

Includes:

✔ Dusting  
✔ Floor Cleaning  
✔ Kitchen Cleaning  
✔ Bathroom Cleaning

\[ Book Now \]

Key Component:

Service Detail Card

---

# **Screen 5 — Date & Time Picker**

Layout:

Select Date

\[ Calendar UI \]

Select Time

\[ 9:00 AM \]  
\[ 11:00 AM \]  
\[ 1:00 PM \]  
\[ 3:00 PM \]

\[ Continue \]

Use:

Calendar component.

---

# **Screen 6 — Address Screen**

Layout:

Select Address

📍 Current Location

🏠 Home  
Street Name

🏢 Office  
Street Name

\[ \+ Add New Address \]

\[ Continue \]

Add:

Map preview later.

---

# **Screen 7 — Payment Screen**

Layout:

Payment

Total Amount  
₹2499

Select Payment

○ UPI  
○ Card  
○ Cash

\[ Pay Now \]  
---

# **Screen 8 — Booking Success**

Layout:

✅ Booking Confirmed

Booking ID \#12345

Cleaner Assigned Soon

\[ Track Booking \]

Use:

Success animation.

---

# **Screen 9 — Booking Tracking**

Layout:

Track Booking

Cleaner:  
👤 Ravi Kumar  
⭐ 4.8

Status:

✔ Accepted  
✔ On the Way  
⏳ Cleaning  
⏳ Completed  
---

# **Screen 10 — Profile Screen**

Layout:

👤 Vaishali Sharma

📍 My Addresses  
📅 Booking History  
💳 Payments  
⭐ Reviews

🚪 Logout  
---

#  **Cleaner App (Second Priority)**

Key Screens:

* Login  
* Dashboard  
* New Jobs  
* My Earnings  
* Profile

---

#  **Admin Dashboard (Web)**

Later stage.

Key screens:

* Dashboard  
* Manage Cities  
* Manage Services  
* Manage Bookings  
* Reports

---

# **Step 4 — Components Library**

Create reusable components:

Primary Button  
Secondary Button  
Text Field  
Card  
Service Card  
Booking Card  
Navigation Bar  
Rating Stars

This is critical for scalability.

---

#  **Step 5 — Recommended Layout Sizes**

Use:

Mobile Frame:

Width: 390px  
Height: 844px  
(Device: iPhone 13\)

Works well for Android too.

---

#  **Suggested App Theme Style**

Best style for cleaning app:

✔ Clean  
 ✔ Minimal  
 ✔ Soft shadows  
 ✔ Rounded corners

Use:

Border Radius: 12px  
Card Padding: 16px  
Spacing: 8px grid  
---

#  **Step 6 — Figma Naming Convention**

Use clean naming:

Btn/Primary  
Input/Text  
Card/Service  
Nav/Bottom  
Screen/Home  
Screen/Login

This helps developers later.

# ER diagram

# **ER Diagram — Cleaning Service App**

# High-Level ER Diagram (Core Relationships)

 USERS  
   |  
   | 1  
   |------\< ADDRESSES \>------1 CITIES  
   |  
   | 1  
   |------\< BOOKINGS \>------1 SERVICES  
                    |  
                    |------1 PROVIDERS  
                    |  
                    |------\< PAYMENTS  
                    |  
                    |------\< REVIEWS  
                    |  
                    |------\< BOOKING\_STATUS\_HISTORY

 SERVICE\_CATEGORIES  
           |  
           | 1  
           |------\< SERVICES

 PROVIDERS  
      |  
      |------\< PROVIDER\_SERVICES \>------ SERVICES

 BOOKINGS  
      |  
      |------\< NOTIFICATIONS

 BOOKINGS  
      |  
      |------\< COUPONS

# **Detailed ER Diagram (With Attributes)**

Follow this link to see ER diagram

https://dbdocs.io/vaishali930240sharma/cleaning-app?view=relationships

# Api design

# **API Design — Cleaning Service App**

Architecture:

Mobile App (Customer)  
Mobile App (Provider)  
Admin Panel (Web)  
       ↓  
REST API (Node.js / Express)  
       ↓  
PostgreSQL Database  
---

#  **AUTHENTICATION APIs**

Used by:

* Customer  
* Provider  
* Admin

---

## **1️. Register User**

POST /api/auth/register

Request:

{  
 "full\_name": "Vaishali Sharma",  
 "phone": "9876543210",  
 "email": "vaishali@email.com",  
 "password": "123456"  
}

Response:

{  
 "message": "User registered successfully",  
 "user\_id": "uuid"  
}  
---

## **2️. Login User**

POST /api/auth/login

Request:

{  
 "phone": "9876543210",  
 "password": "123456"  
}

Response:

{  
 "token": "jwt\_token\_here",  
 "user": {}  
}  
---

## **3️. OTP Login (Recommended)**

POST /api/auth/send-otp  
POST /api/auth/verify-otp  
---

#  **USER APIs**

---

## **Get Profile**

GET /api/users/profile  
---

## **Update Profile**

PUT /api/users/profile

Request:

{  
 "full\_name": "Vaishali Sharma",  
 "email": "new@email.com"  
}  
---

# **CITY APIs**

Used for **multi-city support**.

---

## **Get Cities**

GET /api/cities

Response:

\[  
 {  
   "id": "uuid",  
   "city\_name": "Vijayawada"  
 }  
\]  
---

#  **ADDRESS APIs**

---

## **Add Address**

POST /api/addresses  
{  
 "address\_line1": "Street Name",  
 "pincode": "520001",  
 "city\_id": "uuid",  
 "latitude": 16.506,  
 "longitude": 80.648  
}  
---

## **Get Addresses**

GET /api/addresses  
---

## **Delete Address**

DELETE /api/addresses/:id  
---

#  **SERVICE APIs**

---

## **Get Categories**

GET /api/service-categories

Example:

\[  
 {  
   "id": "uuid",  
   "name": "Home Cleaning"  
 }  
\]  
---

## **Get Services**

GET /api/services

Query:

/api/services?category\_id=123  
---

## **Get Service Details**

GET /api/services/:id  
---

#  **BOOKING APIs (Most Important)**

Core module.

---

## **Create Booking**

POST /api/bookings

Request:

{  
 "service\_id": "uuid",  
 "address\_id": "uuid",  
 "booking\_date": "2026-05-01",  
 "booking\_time": "10:00",  
 "notes": "Bring cleaning supplies"  
}

Response:

{  
 "booking\_id": "uuid",  
 "status": "pending"  
}  
---

## **Get My Bookings**

GET /api/bookings  
---

## **Get Booking Details**

GET /api/bookings/:id  
---

## **Cancel Booking**

PUT /api/bookings/:id/cancel  
---

## **Update Booking Status (Provider/Admin)**

PUT /api/bookings/:id/status  
{  
 "status": "in\_progress"  
}  
---

#  **PROVIDER APIs**

Used in cleaner app.

---

## **Register Provider**

POST /api/providers/register  
---

## **Get Provider Jobs**

GET /api/providers/jobs  
---

## **Accept Booking**

PUT /api/providers/bookings/:id/accept  
---

## **Complete Booking**

PUT /api/providers/bookings/:id/complete  
---

#  **PAYMENT APIs**

Supports:

* UPI  
* Card  
* Cash

---

## **Create Payment**

POST /api/payments  
{  
 "booking\_id": "uuid",  
 "payment\_method": "upi"  
}  
---

## **Verify Payment**

POST /api/payments/verify

Used for:

* Razorpay integration

---

# **REVIEW APIs**

---

## **Add Review**

POST /api/reviews  
{  
 "booking\_id": "uuid",  
 "rating": 5,  
 "comment": "Excellent service"  
}  
---

## **Get Reviews**

GET /api/reviews/:provider\_id  
---

#  **COUPON APIs**

---

## **Apply Coupon**

POST /api/coupons/apply  
{  
 "code": "SAVE100"  
}  
---

#  **NOTIFICATION APIs**

---

## **Get Notifications**

GET /api/notifications  
---

## **Mark As Read**

PUT /api/notifications/:id/read  
---

#  **ADMIN APIs**

Used in Admin Panel.

---

## **Manage Services**

POST /api/admin/services  
PUT /api/admin/services/:id  
DELETE /api/admin/services/:id  
---

## **Manage Providers**

GET /api/admin/providers  
PUT /api/admin/providers/:id/verify  
---

## **Manage Bookings**

GET /api/admin/bookings  
PUT /api/admin/bookings/:id/assign  
---

#  **Booking Status Flow API**

Important lifecycle:

pending  
  ↓  
accepted  
  ↓  
on\_the\_way  
  ↓  
in\_progress  
  ↓  
completed

Or:

pending → cancelled  
---

#  **Suggested API Folder Structure**

If using **Node.js \+ Express**:

src/  
├── modules/  
│    ├── auth/  
│    ├── users/  
│    ├── providers/  
│    ├── services/  
│    ├── bookings/  
│    ├── payments/  
│    ├── reviews/  
│    ├── notifications/  
│    ├── coupons/  
│    └── admin/  
│  
├── middleware/  
├── config/  
├── utils/  
└── server.js

# 🧹 Booking Workflow Diagram — Cleaning App

# **🧹 Booking Workflow Diagram — Cleaning App**

This workflow shows **how a booking moves from start → completion**.

# **High-Level Booking Workflow**

Customer Selects Service  
       ↓  
Choose Date & Time  
       ↓  
Add Address  
       ↓  
Apply Coupon (Optional)  
       ↓  
Choose Payment Method  
       ↓  
Create Booking  
       ↓  
Provider Assigned  
       ↓  
Provider Accepts Booking  
       ↓  
Service Starts  
       ↓  
Service Completed  
       ↓  
Payment Completed  
       ↓  
Customer Gives Review  
       ↓  
Booking Closed  
---

#  **Detailed Booking Workflow (Production Level)**

This includes **real-world scenarios**.

START

Customer opens app  
       ↓  
Browse Services  
       ↓  
Select Service  
       ↓  
Select Date & Time  
       ↓  
Select Address  
       ↓  
Apply Coupon? (Optional)  
       ↓  
Calculate Final Price  
       ↓  
Select Payment Method

       ├── Online Payment  
       │        ↓  
       │   Payment Gateway  
       │        ↓  
       │   Payment Success  
       │        ↓  
       │   Booking Created  
       │  
       └── Cash on Delivery  
                ↓  
          Booking Created

       ↓  
Booking Status → PENDING  
       ↓  
System Assigns Provider  
       ↓  
Provider Receives Request

       ├── Accept  
       │        ↓  
       │   Status → ACCEPTED  
       │  
       └── Reject  
                ↓  
          Assign New Provider

       ↓  
Provider Travels to Location  
       ↓  
Status → ON\_THE\_WAY  
       ↓  
Provider Arrives  
       ↓  
Status → IN\_PROGRESS  
       ↓  
Cleaning Service Done  
       ↓  
Status → COMPLETED

       ↓  
If COD → Collect Cash  
If Online → Already Paid

       ↓  
Customer Rates Service  
       ↓  
Review Stored

       ↓  
Booking CLOSED

END  
---

#  **Booking Status Flow Diagram**

These statuses must exist in database.

PENDING  
  ↓  
ASSIGNED  
  ↓  
ACCEPTED  
  ↓  
ON\_THE\_WAY  
  ↓  
IN\_PROGRESS  
  ↓  
COMPLETED  
  ↓  
CLOSED

Alternative:

PENDING → CANCELLED  
ACCEPTED → CANCELLED  
---

# **⚠️ Exception Workflow (Real-Life Cases)**

These are **very important** in production systems.

---

## **❌ Provider Rejects Booking**

Provider Rejects  
       ↓  
System Finds Another Provider  
       ↓  
Reassign Booking

If none available:

No Provider Available  
       ↓  
Notify Customer  
       ↓  
Cancel Booking  
       ↓  
Refund (If Paid)  
---

## **❌ Customer Cancels Booking**

Customer Cancels  
       ↓  
Update Status → CANCELLED  
       ↓  
If Paid → Refund Process  
---

## **❌ Payment Failure**

Payment Failed  
       ↓  
Booking NOT Created  
       ↓  
Retry Payment  
---

#  **Payment Workflow Diagram**

Supports:

* UPI  
* Card  
* Cash

User Selects Payment

     ├── Online Payment  
     │        ↓  
     │   Redirect to Gateway  
     │        ↓  
     │   Success?  
     │        │  
     │        ├── Yes  
     │        │     ↓  
     │        │ Booking Created  
     │        │  
     │        └── No  
     │              ↓  
     │          Show Error  
     │  
     └── Cash on Delivery  
              ↓  
        Booking Created  
              ↓  
        Collect Cash Later  
---

#  **Provider Workflow**

Cleaner side flow.

Provider Login  
       ↓  
View Assigned Booking  
       ↓  
Accept / Reject

If Accept:  
       ↓  
Navigate to Customer  
       ↓  
Start Cleaning  
       ↓  
Complete Cleaning  
       ↓  
Mark Completed  
---

#  **Admin Workflow**

Admin manages edge cases.

Admin Dashboard  
       ↓  
View Bookings  
       ↓  
Assign Provider  
       ↓  
Monitor Status  
       ↓  
Handle Complaints  
       ↓  
Manage Refunds  
---

#  **Location Tracking Workflow (Future Feature)**

Provider Accepts Booking  
       ↓  
Location Sharing Enabled  
       ↓  
Customer Sees Live Tracking  
       ↓  
Provider Reaches Location  
---

# **Notification Workflow**

Triggered at each stage.

Booking Created → Notify Provider

Provider Accepted → Notify Customer

Provider On The Way → Notify Customer

Service Completed → Notify Customer

Payment Done → Send Receipt  
---

#  **Database Tables Used in Workflow**

These tables are critical.

bookings  
booking\_status\_history  
payments  
providers  
users  
reviews  
notifications  
coupon\_usage  
---

#  **Real System Booking Flow (Most Accurate)**

User → Create Booking  
          ↓  
Booking → Pending  
          ↓  
System → Assign Provider  
          ↓  
Provider → Accept  
          ↓  
Status → In Progress  
          ↓  
Status → Completed  
          ↓  
Payment → Completed  
          ↓  
Review → Submitted  