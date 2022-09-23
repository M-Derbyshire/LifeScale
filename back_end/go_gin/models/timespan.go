package models

import (
	"errors"
	"time"

	customutils "github.com/M-Derbyshire/LifeScale/tree/main/back_end/go_gin/custom_utils"
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

func (t *Timespan) Validate(authUser User, db gorm.DB, isCreating bool) error {

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

func (t *Timespan) ValidateAuthorisation(authUser User, db gorm.DB) error {

	// We need to determine the user id that's actually stored against this
	var actualUserId int64
	db.Model(&Timespan{}).Select("`scales`.`user_id`").Joins("JOIN `actions` ON `actions`.`id` = `timespans`.`action_id`").Joins("JOIN `categories` ON `categories`.`id` = `actions`.`category_id`").Joins("JOIN `scales` ON `scales`.`id` = `categories`.`scale_id`").Where("timespans.id = ?", t.ID).First(&actualUserId)

	if uint64(actualUserId) != authUser.ID {
		return errors.New("user is not authorised to change this action")
	}

	return nil

}

func (t *Timespan) ResolveID() error {

	err := customutils.IDResolver(&t.ID, &t.StrID)

	if err != nil {
		return err
	}

	return nil
}

func (t *Timespan) Sanitise() {
	t.StrID = customutils.StringSanitiser(t.StrID)
}
