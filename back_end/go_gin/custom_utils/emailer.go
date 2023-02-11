package custom_utils

import (
	"errors"

	"github.com/go-mail/mail"
)

// Used to send email via SMTP
type Emailer struct {
	EmailFrom     string // The email address to send any emails from
	EmailUsername string // The username for the SMTP email host
	EmailPassword string // The password for the SMTP email host
	EmailHost     string // The SMTP email host
	EmailPort     int    // The port to use for SMTP connections
	IsValid       bool   // Are the settings provided above valid?
}

// Returns an initialised Emailer.
func MakeEmailer(emailFrom string, emailUsername string, emailPassword string, emailHost string, emailPort int) Emailer {
	emailer := Emailer{
		EmailFrom:     emailFrom,
		EmailUsername: emailUsername,
		EmailPassword: emailPassword,
		EmailHost:     emailHost,
		EmailPort:     emailPort,
	}

	emailer.IsValid = emailer.requiredSettingsSet()

	return emailer
}

// Does this Emailer have all the required settings?
func (e *Emailer) requiredSettingsSet() bool {
	return (e.EmailFrom != "" &&
		e.EmailUsername != "" &&
		e.EmailPassword != "" &&
		e.EmailHost != "" &&
		e.EmailPort > 0)
}

// Send email, if Emailer is valid
func (e *Emailer) SendMail(toAddress string, body string) error {

	if !e.IsValid {
		return errors.New("this feature is not available at this time")
	}

	// Setup the email, and send
	msg := mail.NewMessage()
	dialer := mail.NewDialer(e.EmailHost, e.EmailPort, e.EmailUsername, e.EmailPassword)

	msg.SetHeader("From", e.EmailFrom)
	msg.SetHeader("To", toAddress)
	msg.SetHeader("Subject", "LifeScale password reset.")
	msg.SetBody("text/html", body)

	return dialer.DialAndSend(msg)
}
