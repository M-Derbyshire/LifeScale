package models

// Holds the data require to change reset a password
type PasswordRequest struct {
	Email string `json:"email"`
}
