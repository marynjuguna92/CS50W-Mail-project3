document.addEventListener('DOMContentLoaded', function() {

  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);
  document.querySelector('#compose-form').addEventListener('submit', send_email);

  load_mailbox('inbox');
});

function compose_email() {
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';
  document.querySelector('#email-detail-view').style.display = 'none';

  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';

}

function send_email(event) { 
  event.preventDefault();

  const recipients = document.querySelector('#compose-recipients').value;
  const subject = document.querySelector('#compose-subject').value;
  const body = document.querySelector('#compose-body').value;

  fetch('/emails', {
    method: 'POST',
    body: JSON.stringify({
      recipients: recipients,
      subject: subject,
      body: body
    })
  })
  .then(response => response.json())
  .then(result => {
    console.log("Result:", result);
    if (result.error) {
      console.error("Error sending email:", result.error);
      alert(`Error: ${result.error}`);
    }
    else {
      console.log("Email sent successfully");
      load_mailbox('sent');
    }
  });
}

function load_mailbox(mailbox) {
  console.log("Loading mailbox:", mailbox);

  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#email-detail-view').style.display = 'none';

  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

  fetch(`/emails/${mailbox}`)
    .then(response => response.json())
    .then(emails => {
      console.log(`Emails in ${mailbox}:`, emails);

      emails.forEach(email => {
        const emailDiv = document.createElement('div');
        emailDiv.className = email.read ? 'email-item read' : 'email-item unread';
        emailDiv.style.border = '1px solid #ccc';
        emailDiv.style.padding = '10px';
        emailDiv.style.margin = '5px';
        emailDiv.style.cursor = 'pointer';
        emailDiv.style.backgroundColor = email.read ? '#fff' : 'white';

        emailDiv.innerHTML = `
          <strong>${mailbox === 'sent' ? 'To: ' + email.recipients.join(', ') : 'From: ' + email.sender}</strong>
          <span style="margin-left: 10px;">${email.subject}</span>
          <span style="float: right;">${email.timestamp}</span>
        `;

        emailDiv.addEventListener('click', () => load_email(email.id));
        document.querySelector('#emails-view').append(emailDiv);
      });
    });
}

function load_email(id) {
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#email-detail-view').style.display = 'block';

  fetch(`/emails/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ read: true })
  })
  .then(() => {
    return fetch(`/emails/${id}`);
  })
  .then(response => response.json())
  .then(email => {
    console.log("Viewing email:", email);

    document.querySelector('#email-detail-view').innerHTML = '';

    const container = document.createElement('div');
    container.style.border = '1px solid #ccc';
    container.style.padding = '15px';

    container.innerHTML = `
      <p><strong>From:</strong> ${email.sender}</p>
      <p><strong>To:</strong> ${email.recipients.join(', ')}</p>
      <p><strong>Subject:</strong> ${email.subject}</p>
      <p><strong>Timestamp:</strong> ${email.timestamp}</p>
      <hr>
      <p>${email.body.replace(/\n/g, '<br>')}</p>
    `;

    const currentUser = document.querySelector('h2').innerText;

    if (email.sender !== currentUser) {
      const archiveButton = document.createElement('button');
      archiveButton.className = 'btn btn-sm btn-outline-primary mt-3';
      archiveButton.innerText = email.archived ? 'Unarchive' : 'Archive';

      archiveButton.addEventListener('click', () => {
        fetch(`/emails/${id}`, {
          method: 'PUT',
          body: JSON.stringify({ archived: !email.archived })
        })
        .then(() => load_mailbox('inbox'));
      });

      container.appendChild(archiveButton);
    
    const replyButton = document.createElement('button');
    replyButton.className = 'btn btn-sm btn-outline-primary mt-3';
    replyButton.innerText = 'Reply';

    replyButton.addEventListener('click', () => {
      compose_email();

      document.querySelector('#compose-recipients').value = email.sender;

      let subject = email.subject;
      if (!subject.startsWith("Re:")) {
        subject = `Re: ${subject}`;
      }
      document.querySelector('#compose-subject').value = subject;

      document.querySelector('#compose-body').value =
        `\n\nOn ${email.timestamp}, ${email.sender} wrote:\n${email.body}`;
    });
  
    container.appendChild(replyButton);
    }
    document.querySelector('#email-detail-view').appendChild(container);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}
