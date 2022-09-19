package models

import "time"

type Timespan struct {
	StrID       string    `gorm:"-" json:"id"` //The front end uses strings for the ID (incase this needs to use a NoSQL DB in the future)
	ID          uint64    `gorm:"id" json:"-"`
	Date        time.Time `gorm:"date" json:"date"`
	MinuteCount float32   `gorm:"minuteCount" sql:"type:decimal(6, 2)" json:"minuteCount"`
	ActionID    uint64
	Action      Action
}
