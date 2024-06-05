# Mon vieux grimoire : back-end

This project was completed as part of the Web Developper training program at [OpenClassrooms](https://openclassrooms.com/fr/paths/899-developpeur-web).

> Implement the back-end of a book rating website 📚★ <br>
> Set up the server structure and manage the communication between the server and the database 💻

### Technical constraints :

-   Security :
    -   The user's password must be hashed.
    -   Authentication must be enforced on all required book routes.
    -   Email addresses in the database must be unique, and an appropriate Mongoose plugin should be used to ensure their uniqueness and report errors.
    -   The security of the MongoDB database (from a service such as MongoDB Atlas) should not prevent the application from launching on a user's machine.
    -   Errors from the database must be reported.
      
    -   Images uploaded by users need to be optimized to ensure the project adheres to green code best practices.

## Built with :

<p align="center">
  <a href="https://skillicons.dev">
    <img src="https://skillicons.dev/icons?i=mongodb,nodejs,express,figma,github,js,vscode" />
  </a>
</p>

Use of `Figma` for design.<br>
Use of `Node.js` for development.<br>
Use of `Git` for version control.<br>

## Installation:

1. Clone the repository :

-   `git clone https://github.com/Nienkepuiss/projet6`

2. Install all dependencies for Front-end:

-   `npm install` or `yarn`

3. Install all dependencies for Back-end:

-   `npm install -g nodemon`

4. Launch front-end:

-   `npm start` or `yarn start`

5. Launch back-end:

-   `nodemon start`

Front-end will launch at URL:
`http://localhost:3000`
