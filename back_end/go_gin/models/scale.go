package models

import (
	"errors"

	customutils "github.com/M-Derbyshire/LifeScale/tree/main/back_end/go_gin/custom_utils"
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

// Will return an error if any of the data in this entity is not valid (doesn't check inner-entities)
func (s *Scale) Validate(authUser User, db gorm.DB, isCreating bool) error {

	if s.Name == "" {
		return errors.New("scale name is required")
	}

	return nil
}

// Will return an error if the authorised user is not the owner of this entity (doesn't do inner-entities)
func (s *Scale) ValidateAuthorisation(authUser User, db gorm.DB) error {

	// We need to determine the user id that's actually stored against this
	var actualUserId int64
	db.Model(&Scale{}).Select("user_id").Where("id = ?", s.ID).First(&actualUserId)

	if uint64(actualUserId) != authUser.ID {
		return errors.New("user is not authorised to change this scale")
	}

	return nil
}

// The front-end used string IDs (so a NoSQL DB could be used). This will populate either the numeric or string ID, with the value from the other (doesn't do inner-entities)
func (s *Scale) ResolveID() error {

	err := customutils.IDResolver(&s.ID, &s.StrID)

	if err != nil {
		return err
	}

	return nil
}

// Sanitises the string values in this entity (doesn't do inner-entities)
func (s *Scale) Sanitise() {
	s.StrID = customutils.StringSanitiser(s.StrID)
	s.Name = customutils.StringSanitiser(s.Name)
}
