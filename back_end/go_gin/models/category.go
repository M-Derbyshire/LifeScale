package models

import (
	"errors"
	"fmt"
	"log"
	"regexp"

	"gorm.io/gorm"
)

type Category struct {
	gorm.Model
	StrID         string `gorm:"-" json:"id"` //The front end uses strings for the ID (incase this needs to use a NoSQL DB in the future)
	ID            uint64 `gorm:"id" json:"-"`
	Name          string `gorm:"name" json:"name"`
	Color         string `gorm:"color" json:"color"`                 //Color should be a color name, not an actual color value
	DesiredWeight uint   `gorm:"desiredWeight" json:"desiredWeight"` //Keep as unsigned, as negative values are invalid
	ScaleID       uint64
	Scale         Scale
	Actions       []Action `json:"actions"`
}

func (c *Category) Validate(authUser User, db gorm.DB, isCreating bool) error {

	if c.Name == "" {
		return errors.New("category name is required")
	}

	if c.Color == "" {
		return errors.New("category color is required")
	}

	//Color should be a color name, not an actual color value
	colorRegex := "^[a-zA-Z]+$"

	colorIsValid, regexErr := regexp.MatchString(colorRegex, c.Color)
	if regexErr != nil {
		err := fmt.Errorf("error while validating category color (%s): %s", c.Color, regexErr.Error())
		log.Println(err)
		return errors.New("unable to validate category color") //Not returning error message, for security reasons
	}

	if !colorIsValid {
		return errors.New("provided category color is not a valid color name")
	}

	return nil
}

func (c *Category) ValidateAuthorisation(authUser User, db gorm.DB) error {

	// We need to determine the user id that's actually stored against this
	var actualUserId int64
	db.Model(&Category{}).Select("`scales`.`user_id`").Joins("JOIN `scales` ON `scales`.`id` = `categories`.`scale_id`").Where("categories.id = ?", c.ID).First(&actualUserId)

	if uint64(actualUserId) != authUser.ID {
		return errors.New("user is not authorised to change this category")
	}

	return nil
}
