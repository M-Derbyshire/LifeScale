package models

import (
	"errors"
	"fmt"

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

// Will return an error if any of the data in this entity is not valid (also does inner-entities)
func (s *Scale) Validate(authUser User, db gorm.DB, isCreating bool) error {

	if s.Name == "" {
		return errors.New("scale name is required")
	}

	for categoryIdx, _ := range s.Categories {
		catErr := s.Categories[categoryIdx].Validate(authUser, db, isCreating)
		if catErr != nil {
			return fmt.Errorf("invalid category at index %d: %s", categoryIdx, catErr.Error())
		}
	}

	return nil
}

// Will return an error if the authorised user is not the owner of this entity (doesn't do inner-entities)
func (s *Scale) ValidateAuthorisation(authUser User, db gorm.DB) error {

	// We need to determine the user id that's actually stored against this
	var actualUserId int64
	db.Model(&Scale{}).Select("user_id").Where("id = ?", s.ID).First(&actualUserId)

	if s.UserID > 0 && s.UserID != uint64(actualUserId) {
		return errors.New("this scale does not belong to the user that it has stated it belongs to")
	}

	if uint64(actualUserId) != authUser.ID {
		return errors.New("user is not authorised to change this scale")
	}

	return nil
}

// The front-end used string IDs (so a NoSQL DB could be used). This will populate either the numeric or string ID, with the value from the other (also does inner-entities)
func (s *Scale) ResolveID() error {

	err := customutils.IDResolver(&s.ID, &s.StrID)

	if err != nil {
		return err
	}

	for categoryIdx, _ := range s.Categories {
		catErr := s.Categories[categoryIdx].ResolveID()
		if catErr != nil {
			return fmt.Errorf("error while resolving ID of scale at index %d: %s", categoryIdx, catErr.Error())
		}
	}

	return nil
}

// Sanitises the string values in this entity (also does inner-entities)
func (s *Scale) Sanitise() {
	s.StrID = customutils.StringSanitiser(s.StrID)
	s.Name = customutils.StringSanitiser(s.Name)

	for categoryIdx, _ := range s.Categories {
		s.Categories[categoryIdx].Sanitise()
	}
}
