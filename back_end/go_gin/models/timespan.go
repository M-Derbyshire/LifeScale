package models

import (
	"errors"
	"time"

	"gorm.io/gorm"
)

type Timespan struct {
	gorm.Model
	StrID       string    `gorm:"-" json:"id"` //The front end uses strings for the ID (incase this needs to use a NoSQL DB in the future)
	ID          uint64    `gorm:"id" json:"-"`
	Date        time.Time `gorm:"date" json:"date"`
	MinuteCount float32   `gorm:"minuteCount" sql:"type:decimal(6, 2)" json:"minuteCount"`
	ActionID    uint64
	Action      Action
}

func (t *Timespan) Validate() error {

	if t.MinuteCount < 0 {
		return errors.New("timespan minute count should not be negative")
	}

	if t.MinuteCount > 9999.99 {
		return errors.New("timespan minute count should not have more than 4 digits before the decimal point")
	}

	//Make sure we only have the correct amount of decimal places
	decimalCalculationMultiplier := float32(100) //The amount of zeros here represents how many decimal places a number should have
	countWithCorrectDecimalPlaces := float32(int(t.MinuteCount*decimalCalculationMultiplier)) / decimalCalculationMultiplier
	if t.MinuteCount != countWithCorrectDecimalPlaces {
		return errors.New("timespan minute count should not have more than 2 digits after the decimal point")
	}

	return nil
}
