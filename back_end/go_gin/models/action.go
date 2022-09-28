package models

import (
	"errors"
	"fmt"

	customutils "github.com/M-Derbyshire/LifeScale/tree/main/back_end/go_gin/custom_utils"
	"gorm.io/gorm"
)

// Represents an "action" entity in the database. Also provides specific utility methods (see interfaces/IModel)
type Action struct {
	gorm.Model
	StrID      string `gorm:"-" json:"id"` //The front end uses strings for the ID (incase this needs to use a NoSQL DB in the future)
	ID         uint64 `gorm:"id" json:"-"`
	Name       string `gorm:"name" json:"name"`
	Weight     uint   `gorm:"weight" json:"weight"` //Keep as unsigned, as negative values are invalid
	CategoryID uint64
	Category   Category
	Timespans  []Timespan `json:"timespans"`
}

// Will return an error if any of the data in this entity is not valid (doesn't check inner-entities)
func (a *Action) Validate(authUser User, db gorm.DB, isCreating bool) error {

	if a.Name == "" {
		return errors.New("action name is required")
	}

	for timespanIdx, _ := range a.Timespans {
		tsErr := a.Timespans[timespanIdx].Validate(authUser, db, isCreating)
		if tsErr != nil {
			return fmt.Errorf("error while validating timespan at index %d: %s", timespanIdx, tsErr.Error())
		}
	}

	return nil
}

// Will return an error if the authorised user is not the owner of this entity (doesn't do inner-entities)
func (a *Action) ValidateAuthorisation(authUser User, db gorm.DB) error {

	// We need to determine the user id that's actually stored against this
	var actualUserId int64
	db.Model(&Action{}).Select("`scales`.`user_id`").Joins("JOIN `categories` ON `categories`.`id` = `actions`.`category_id`").Joins("JOIN `scales` ON `scales`.`id` = `categories`.`scale_id`").Where("actions.id = ?", a.ID).First(&actualUserId)

	if uint64(actualUserId) != authUser.ID {
		return errors.New("user is not authorised to change this action")
	}

	return nil
}

// The front-end used string IDs (so a NoSQL DB could be used). This will populate either the numeric or string ID, with the value from the other (doesn't do inner-entities)
func (a *Action) ResolveID() error {

	err := customutils.IDResolver(&a.ID, &a.StrID)

	if err != nil {
		return err
	}

	for timespanIdx, _ := range a.Timespans {
		tsErr := a.Timespans[timespanIdx].ResolveID()
		if tsErr != nil {
			return fmt.Errorf("error while resolving ID of action at index %d: %s", timespanIdx, tsErr.Error())
		}
	}

	return nil
}

// Sanitises the string values in this entity (doesn't do inner-entities)
func (a *Action) Sanitise() {
	a.StrID = customutils.StringSanitiser(a.StrID)
	a.Name = customutils.StringSanitiser(a.Name)

	for timespanIdx, _ := range a.Timespans {
		a.Timespans[timespanIdx].Sanitise()
	}
}
