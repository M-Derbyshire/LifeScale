package models

type Category struct {
	StrID         string `gorm:"-" json:"id"` //The front end uses strings for the ID (incase this needs to use a NoSQL DB in the future)
	ID            uint64 `gorm:"id" json:"-"`
	Name          string `gorm:"name" json:"name"`
	Color         string `gorm:"color" json:"color"`
	DesiredWeight uint   `gorm:"desiredWeight" json:"desiredWeight"`
	ScaleID       uint64
	Scale         Scale
}
