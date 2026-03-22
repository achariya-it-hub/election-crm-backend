# Election CRM Backend

Express.js backend API for Election CRM with MySQL database.

## Quick Start

### 1. Setup Database

1. Create a MySQL database
2. Run the schema file:
```bash
mysql -u root -p < sql/schema.sql
```

### 2. Configure Environment

Copy `.env.example` to `.env` and update:
```
PORT=3000
DB_HOST=your_mysql_host
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=election_crm
JWT_SECRET=your_secret_key
```

### 3. Install & Run

```bash
npm install
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login (username or email)
- `POST /api/auth/register` - Register user (Admin only)
- `POST /api/auth/change-password` - Change password

### Users
- `GET /api/users` - Get all users (Admin)
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create user (Admin)
- `PUT /api/users/:id` - Update user (Admin)
- `DELETE /api/users/:id` - Delete user (Admin)

### Booths
- `GET /api/booths` - Get all booths
- `GET /api/booths/:id` - Get booth by ID
- `POST /api/booths` - Create booth
- `PUT /api/booths/:id` - Update booth
- `DELETE /api/booths/:id` - Delete booth

### Voters
- `GET /api/voters` - Get all voters
- `GET /api/voters/:id` - Get voter by ID
- `POST /api/voters` - Create voter
- `PUT /api/voters/:id` - Update voter
- `PUT /api/voters/bulk/update` - Bulk update voters
- `DELETE /api/voters/:id` - Delete voter

### Volunteers
- `GET /api/volunteers` - Get all volunteers
- `GET /api/volunteers/:id` - Get volunteer by ID
- `POST /api/volunteers` - Create volunteer
- `PUT /api/volunteers/:id` - Update volunteer
- `DELETE /api/volunteers/:id` - Delete volunteer

### Complaints
- `GET /api/complaints` - Get all complaints
- `GET /api/complaints/:id` - Get complaint by ID
- `POST /api/complaints` - Create complaint
- `PUT /api/complaints/:id` - Update complaint
- `DELETE /api/complaints/:id` - Delete complaint

### Campaigns
- `GET /api/campaigns` - Get all campaigns
- `GET /api/campaigns/:id` - Get campaign by ID
- `POST /api/campaigns` - Create campaign
- `PUT /api/campaigns/:id` - Update campaign
- `DELETE /api/campaigns/:id` - Delete campaign

### Settings
- `GET /api/settings/global` - Get settings
- `PUT /api/settings/global` - Update settings

## Default Admin Login

- **Username:** admin
- **Password:** admin123

⚠️ **Change this password immediately after first login!**

## Deploy to Render.com (Free)

1. Create account at [render.com](https://render.com)
2. Create New → PostgreSQL (free tier)
3. Note the connection string
4. Create New → Web Service
5. Connect GitHub repo
6. Set environment variables:
   - `DB_HOST` = from PostgreSQL connection string
   - `DB_NAME` = election_crm
   - `DB_USER` = from connection string
   - `DB_PASSWORD` = from connection string
   - `JWT_SECRET` = your secret key
7. Set build command: `npm install`
8. Set start command: `npm start`

## Deploy to Railway.app (Free Tier)

1. Create account at [railway.app](https://railway.app)
2. New Project → Provision MySQL
3. Note the connection details
4. New Project → Deploy from GitHub
5. Add environment variables from MySQL connection
6. Deploy!

## Deploy to Namecheap (cPanel)

1. Upload files to public_html
2. Create MySQL database in cPanel
3. Import sql/schema.sql
4. Create .htaccess with:
```apache
RewriteEngine On
RewriteRule ^$3000 [L]
```
5. Run: `nohup node src/server.js &`
