package models

import (
	"errors"

	"gorm.io/gorm"
)

type Scale struct {
	gorm.Model
	StrID           string `gorm:"-" json:"id"` //The front end uses strings for the ID (incase this needs to use a NoSQL DB in the future)
	ID              uint64 `gorm:"id" json:"-"`
	Name            string `gorm:"name" json:"name"`
	UsesTimespans   bool   `gorm:"usesTimespans" json:"usesTimespans"`
	DisplayDayCount uint   `gorm:"displayDayCount" json:"displayDayCount"` //This should remain unsigned, as values less than 0 are invalid
	UserID          uint64
	User            User
	Categories      []Category `json:"categories"`
}

func (s *Scale) Validate(authUser User, db gorm.DB, isCreating bool) error {

	if s.Name == "" {
		return errors.New("scale name is required")
	}

	return nil
}

func (s *Scale) ValidateAuthorisation(authUser User, db gorm.DB) error {

	// We need to determine the user id that's actually stored against this
	var actualUserId int64
	db.Model(&Scale{}).Select("user_id").Where("id = ?", s.ID).First(&actualUserId)

	if uint64(actualUserId) != authUser.ID {
		return errors.New("user is not authorised to change this scale")
	}

	return nil
}
