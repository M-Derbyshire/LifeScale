package models

import (
	"errors"

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

func (a *Action) Validate() error {

	if a.Name == "" {
		return errors.New("action name is required")
	}

	return nil
}
