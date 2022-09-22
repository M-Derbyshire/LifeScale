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

	return nil
}

func (u *User) ValidateAuthorisation(authUser User, db gorm.DB) error {

	if authUser.ID != u.ID {
		return errors.New("user is not authorised to make changes to this account")
	}

	return nil

}

func (u *User) ResolveID() error {

	err := customutils.IDResolver(&u.ID, &u.StrID)

	if err != nil {
		return err
	}

	return nil
}
