Manage customer's account

## Rest API

Method      | URI                           | Description                           |permissions         |
----------- | ----------------------------- | ------------------------------------- |--------------------|     
`POST`      | */user/register*              | Create new account                    |                    |
`POST`      | */user/login*                 | Authenticate user                     |                    |
`PAICH`     | */user*                       | Update account information            |admin/account owner |
`GET`       | */users/:id*                  | View account information              |                    |
`GET`       | */user*                       | View  ALL account information         |admin               |
`DELETE`    | */user*                       | Delete account information            |admin/account owner |

## Rest API
User
• id
• email
• password
• first name
• last name
• birth date
• is admin
• favourite flats list
• created
• updated

user-service/
├── Dockerfile
├── package.json
├── config/
│   └── default.json         # service port, DB URI, etc.
├── src/
│   ├── app.js               # Express setup
│   ├── server.js            # Starts the service
│   ├── controllers/
│   │     └── userController.js
│   ├── middlewares/
│   │     └── ensureAdmin.js
│   ├── models/
│   │     └── user.model.js
│   ├── routes/
│   │     └── user.routes.js
│   └── db.js                # (optional) MongoDB connection
└── README.md
(if you turned off TLS for local dev, use http://localhost:443 or whatever port you chose)
• Get a user by ID
• GET
• URL → https://localhost/user/u123
• Headers →
• Authorization: Bearer <accessToken>
• Update your own profile
• PUT
• URL → https://localhost/user/u123
• Headers → Authorization
• Body → JSON of fields to change
• Delete your own account
• DELETE
• URL → https://localhost/user/u123
• Promote a user to admin
• POST
• URL → https://localhost/user/u123/upgrade
• Headers → Authorization (must be admin/editor/moderator)
• Body → { "confirmAdmin":"YES" }
• (Later) Payment, Shipping, Cart, Order…
• GET https://localhost/payment/…
• GET https://localhost/shipping/…
— — —
3) Postman tips
— — —
• Disable SSL verification in Settings → General (for self-signed)
• Use an environment variable for your base URL:
- KEY = base
- VALUE = https://localhost
Then your request URL becomes:
{{base}}/user/u123


• Set an auth variable after login:
- KEY = token
- VALUE = eyJhbGci…
Then add a header:
Authorization: Bearer {{token}}


With that in place, you’ll be able to walk through register → login → call protected routes via the gateway → see rate-limit or circuit-breaker behavior. Enjoy!
