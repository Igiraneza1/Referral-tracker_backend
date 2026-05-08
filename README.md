# Referral-tracker_backend

Healthcare Information Management
Patient Referral Tracker
A system for managing patient referrals; tracking patient referrals from one facility to another, their status, outcomes, and follow-up notes.

# The problem it solves
In many hospitala, referrals are tracked on paper or in spreadsheets, making it hard to know which patients attended specialist appointments and what happened. This app fixes that.

# Who uses it
Health records officers, ward clerks, and clinical staff who need to log, update, and report on referral statuses across departments or facilities.

# Core features to build
Referral log : Create and view referrals with patient ID, referring facility, receiving facility, date, and reason
Status tracking : Update referral status: Pending → Accepted → Attended → Feedback Received → Closed
Notes & feedback : Add clinical notes per referral; record specialist feedback when received
Dashboard : Summary cards: total referrals, pending, overdue (>14 days with no update), closed this month
Search & filter : Filter by status, date range, referring facility, or patient ID

# Tech stack : exactly what you know
# Backend
Node.jsExpressTypeScript
Database
PostgreSQLPrisma ORM
Auth
JWTRole-based access

# Why this project specifically:
Healthcare information management is largely about tracking the movement of patients and information between units. Referral management is one of the most common pain points in health records departments across Rwanda facilities often lose track of whether a referred patient actually showed up or what the outcome was. Building this puts domain knowledge directly into your code.
