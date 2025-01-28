# Secure Web Tokens (SWT)

This is a lightweight and secure authentication system built with **Node.js**, **Express**, **ValKey** (Redis fork), and **PostgreSQL**. Unlike JWT-based approaches, it avoids common pitfalls like token theft by using **stateful tokens** with **device-specific fingerprints** for added security.  

## 🚀 Features  
- **Stateful Tokens**: Tokens are stored in ValKey for quick lookup and easy revocation.  
- **Device-Specific Security**: Tokens are tied to device fingerprints for protection against theft.  
- **Effortless Token Revocation**: Sessions can be invalidated instantly by deleting tokens.  
- **Customizable Fingerprints**: Enhance security by including device details, IPs, or user-agent data.  

## 🛠 How It Works  
1. **Login**  
   - Users authenticate with a username, password, and a unique fingerprint.  
   - A token is generated and stored in ValKey along with user data and fingerprint.  

2. **Protected Routes**  
   - Middleware validates the token and ensures the fingerprint matches the request.  
   - Expired or mismatched tokens are denied access.