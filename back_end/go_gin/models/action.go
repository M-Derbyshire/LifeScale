package models

import (
	"errors"

	customutils "github.com/M-Derbyshire/LifeScale/tree/main/back_end/go_gin/custom_utils"
	"gorm.io/gorm"
)

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

func (a *Action) Validate(authUser User, db gorm.DB, isCreating bool) error {

	if a.Name == "" {
		return errors.New("action name is required")
	}

	return nil
}

func (a *Action) ValidateAuthorisation(authUser User, db gorm.DB) error {

	// We need to determine the user id that's actually stored against this
	var actualUserId int64
	db.Model(&Action{}).Select("`scales`.`user_id`").Joins("JOIN `categories` ON `categories`.`id` = `actions`.`category_id`").Joins("JOIN `scales` ON `scales`.`id` = `categories`.`scale_id`").Where("actions.id = ?", a.ID).First(&actualUserId)

	if uint64(actualUserId) != authUser.ID {
		return errors.New("user is not authorised to change this action")
	}

	return nil
}

func (a *Action) ResolveID() error {

	err := customutils.IDResolver(&a.ID, &a.StrID)

	if err != nil {
		return err
	}

	return nil
}
