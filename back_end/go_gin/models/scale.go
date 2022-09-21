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

func (s *Scale) Validate() error {

	if s.Name == "" {
		return errors.New("scale name is required")
	}

	return nil
}
