# RentNest Backend

RentNest is a backend API for a rental property management system.  
The main purpose of this project is to manage rental properties, tenants, landlords, rental requests and online payments.

## Features

- User registration and login
- JWT based authentication
- Role based authorization
- Tenant and Landlord roles
- Admin role
- Property management
- Property categories
- Rental request system
- Landlord can approve or reject rental requests
- Tenant can cancel pending rental requests
- Stripe checkout payment
- Stripe webhook for payment confirmation
- Payment records stored in database
- Rental request becomes active after successful payment
- Property status changes to rented after approval
- PostgreSQL database with Prisma ORM
- Deployed on Vercel

## User Roles

### Tenant

A tenant can:

- Register and login
- View available properties
- Send rental requests
- View own rental requests
- Cancel pending rental requests
- Make payment for an approved rental request

### Landlord

A landlord can:

- Register and login
- Create properties
- Update own properties
- Delete own properties
- View rental requests for own properties
- Approve or reject rental requests

### Admin

Admin can:

- Login
- Create categories
- Update categories
- Delete categories
- Manage the rental system through admin APIs

## Technologies Used

- Node.js
- Express.js
- TypeScript
- PostgreSQL
- Prisma ORM
- Neon PostgreSQL
- JWT
- bcrypt
- Zod
- Stripe
- Vercel

## Project Structure

```text
src/
├── config/
├── lib/
├── middleware/
├── modules/
│   ├── auth/
│   ├── category/
│   ├── payment/
│   ├── property/
│   ├── rentalRequest/
│   └── review/
├── validations/
├── app.ts
└── server.ts

prisma/
├── migrations/
├── seed.ts
└── *.prisma

author-Rafsan Rad