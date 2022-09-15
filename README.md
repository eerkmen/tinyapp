# TinyApp Project

TinyApp is a full stack web application built with Node and Express that allows users to shorten long URLs (à la bit.ly).

## Final Product

!["Main URL page"](/screenshots/url.png)
!["URL creation page"](/screenshots/create-url.png)
!["Register"](/screenshots/register.png)
!["Login"](/screenshots/login.png)
!["Short URL"](/screenshots/short-url.png)


## DevDependencies

    - chai
    - mocha
    - nodemon

## Dependencies

    - bcryptjs
    - cookie-parser
    - cookie-session
    - dotenv
    - ejs
    - express
    - method-override
    - morgan

## Getting Started

- Install all dependencies (using the `npm install` command).
- Run the development web server using the `node express_server.js` command.

## How to use?
Make .env file in the root directory and paste this:

SECRET_KEY="YOURSECRETKEYGOESHERE"

password1= 1234

password2= 2345

email1 = 'name@mail.com'

email2 = 'name2@mail.com'

id1 = 1

id2 = 2