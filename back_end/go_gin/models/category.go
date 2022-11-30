package models

import (
	"errors"
	"fmt"
	"log"
	"regexp"

	customutils "github.com/M-Derbyshire/LifeScale/tree/main/back_end/go_gin/custom_utils"
	"gorm.io/gorm"
)

type Category struct {
	gorm.Model
	// For security reasons, the ID/StrID setup also ensures the ID cannot be set explicitly through the request JSON
	StrID         string `gorm:"-" json:"id"` //The front end uses strings for the ID (incase this needs to use a NoSQL DB in the future)
	ID            uint64 `gorm:"id" json:"-"`
	Name          string `gorm:"name" json:"name"`
	Color         string `gorm:"color" json:"color"`                 //Color should be a color name, not an actual color value
	DesiredWeight uint   `gorm:"desiredWeight" json:"desiredWeight"` //Keep as unsigned, as negative values are invalid
	ScaleID       uint64
	Scale         Scale
	Actions       []Action `json:"actions"`
}

// Will return an error if any of the data in this entity is not valid (doesn't check inner-entities)
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

	for actionIdx, _ := range c.Actions {
		actErr := c.Actions[actionIdx].Validate(authUser, db, isCreating)
		if actErr != nil {
			return fmt.Errorf("error while validating action at index %d: %s", actionIdx, actErr.Error())
		}
	}

	return nil
}

// Will return an error if the authorised user is not the owner of this entity (doesn't do inner-entities)
func (c *Category) ValidateAuthorisation(authUser User, db gorm.DB) error {

	// We need to determine the user id that's actually stored against this
	var actualUserId int64
	db.Model(&Category{}).Select("`scales`.`user_id`").Joins("JOIN `scales` ON `scales`.`id` = `categories`.`scale_id`").Where("categories.id = ?", c.ID).First(&actualUserId)

	if uint64(actualUserId) != authUser.ID {
		return errors.New("user is not authorised to change this category")
	}

	return nil
}

// The front-end used string IDs (so a NoSQL DB could be used). This will populate either the numeric or string ID, with the value from the other (doesn't do inner-entities)
func (c *Category) ResolveID() error {

	err := customutils.IDResolver(&c.ID, &c.StrID)

	if err != nil {
		return err
	}

	for actionIdx, _ := range c.Actions {
		actErr := c.Actions[actionIdx].ResolveID()
		if actErr != nil {
			return fmt.Errorf("error while resolving ID of action at index %d: %s", actionIdx, actErr.Error())
		}
	}

	return nil
}

// Sanitises the string values in this entity (doesn't do inner-entities)
func (c *Category) Sanitise() {
	c.StrID = customutils.StringSanitiser(c.StrID)
	c.Name = customutils.StringSanitiser(c.Name)
	c.Color = customutils.StringSanitiser(c.Color)

	for actionIdx, _ := range c.Actions {
		c.Actions[actionIdx].Sanitise()
	}
}
