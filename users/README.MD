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
