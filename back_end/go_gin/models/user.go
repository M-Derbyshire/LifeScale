package models

import (
	"errors"
	"fmt"
	"log"
	"regexp"

	customutils "github.com/M-Derbyshire/LifeScale/tree/main/back_end/go_gin/custom_utils"
	"gorm.io/gorm"
)

type User struct {
	gorm.Model
	StrID    string  `gorm:"-" json:"id"` //The front end uses strings for the ID (incase this needs to use a NoSQL DB in the future)
	ID       uint64  `gorm:"id" json:"-"`
	Email    string  `gorm:"email;unique" json:"email"`
	Forename string  `gorm:"forename" json:"forename"`
	Surname  string  `gorm:"surname" json:"surname"`
	Scales   []Scale `json:"scales"`
}

// Will return an error if any of the data in this entity is not valid (does the same for inner entities)
func (u *User) Validate(authUser User, db gorm.DB, isCreating bool) error {

	emailRegex := `^[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,4}$`

	emailValid, regexErr := regexp.MatchString(emailRegex, u.Email)
	if regexErr != nil {
		err := fmt.Errorf("error while validating email address (%s): %s", u.Email, regexErr.Error())
		log.Println(err)
		return errors.New("unable to validate email address") //Not returning error message, for security reasons
	}

	if !emailValid {
		return errors.New("email address is invalid")
	}

	var emailUseCount int64
	db.Model(&User{}).Where("email = ?", u.Email).Count(&emailUseCount)

	//Shouldn't be any other uses of the new email address.
	if (isCreating || u.Email != authUser.Email) && emailUseCount > 0 {
		return errors.New("email address is already in use")
	}

	//Now do the names
	if u.Forename == "" {
		return errors.New("forename is required")
	}

	if u.Surname == "" {
		return errors.New("surname is required")
	}

	for scaleIdx, _ := range u.Scales {
		scaleErr := u.Scales[scaleIdx].Validate(authUser, db, isCreating)
		if scaleErr != nil {
			return fmt.Errorf(`invalid scale at index %d: %s`, scaleIdx, scaleErr.Error())
		}
	}

	return nil
}

// Will return an error if the authorised user is not the owner of this entity (does the same for inner entities)
func (u *User) ValidateAuthorisation(authUser User, db gorm.DB) error {

	if authUser.ID != u.ID {
		return errors.New("user is not authorised to make changes to this account")
	}

	for scaleIdx, _ := range u.Scales {
		scaleErr := u.Scales[scaleIdx].ValidateAuthorisation(authUser, db)
		if scaleErr != nil {
			return fmt.Errorf("user not authorised to create/update scale ID %s: %s", u.Scales[scaleIdx].StrID, scaleErr.Error())
		}
	}

	return nil

}

// The front-end used string IDs (so a NoSQL DB could be used). This will populate either the numeric or string ID, with the value from the other (does the same for inner entities)
func (u *User) ResolveID() error {

	err := customutils.IDResolver(&u.ID, &u.StrID)

	if err != nil {
		return err
	}

	for scaleIdx, _ := range u.Scales {
		scaleErr := u.Scales[scaleIdx].ResolveID()
		if scaleErr != nil {
			return fmt.Errorf("error while resolving ID of scale at index %d: %s", scaleIdx, scaleErr.Error())
		}
	}

	return nil
}

// Sanitises the string values in this entity (does the same for inner entities)
func (u *User) Sanitise() {
	u.StrID = customutils.StringSanitiser(u.StrID)
	u.Email = customutils.StringSanitiser(u.Email)
	u.Forename = customutils.StringSanitiser(u.Forename)
	u.Surname = customutils.StringSanitiser(u.Surname)

	for scaleIdx, _ := range u.Scales {
		u.Scales[scaleIdx].Sanitise()
	}
}
