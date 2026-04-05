# CS50W Project 3: Mail

## Overview
This project is a web-based email client built as part of HarvardX's CS50 Web Programming with Python and JavaScript course. The application allows users to send, receive, and manage emails through a dynamic and interactive user interface.

The project focuses on building a single-page application using JavaScript that communicates with a Django backend via API calls.

---

## Features

- **Send Emails**
  - Compose and send emails to one or multiple recipients

- **Mailbox Navigation**
  - Inbox
  - Sent
  - Archived

- **View Emails**
  - Open individual emails
  - Mark emails as read automatically upon opening

- **Archive Functionality**
  - Archive and unarchive emails

- **Dynamic UI**
  - Seamless navigation without full page reloads
  - Real-time updates using JavaScript and Fetch API

## Technologies Used

- **Frontend**
  - HTML
  - CSS
  - JavaScript

- **Backend**
  - Python
  - Django

- **Other Concepts**
  - Fetch API
  - RESTful API interaction
  - JSON handling
  - DOM manipulation

## Project Structure
mail/
│── static/mail/
│ ├── inbox.js
│ ├── styles.css
│
│── templates/mail/
│ ├── inbox.html
│ ├── layout.html
│
│── views.py
│── models.py
│── urls.py


---

## How It Works

The application uses JavaScript to interact with Django API endpoints:

- `GET /emails/<mailbox>` → Load emails for a mailbox  
- `GET /emails/<id>` → View a single email  
- `POST /emails` → Send a new email  
- `PUT /emails/<id>` → Update email status (read, archived)

All interactions are handled dynamically without reloading the page, creating a smooth single-page application experience.

## Key Learning Outcomes

- Building single-page applications using JavaScript  
- Integrating frontend with backend APIs  
- Managing application state dynamically  
- Writing clean, modular, and maintainable code  
- Understanding client-server communication  

## Future Improvements

- Improve UI/UX design for a more modern look  
- Add email search and filtering functionality  
- Implement pagination for large inboxes  
- Enhance validation and error handling  
- Add real-time notifications for new emails  

## Author

**Mary Njuguna**  
Full-Stack Software Developer | AI Engineer  

GitHub Portfolio: https://github.com/marynjuguna92

## Acknowledgements

- Harvard University - CS50 Web Programming with Python and JavaScript  
- CS50 Course Team
