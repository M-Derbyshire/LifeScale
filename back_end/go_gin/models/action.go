package models

type Action struct {
	StrID      string `gorm:"-" json:"id"` //The front end uses strings for the ID (incase this needs to use a NoSQL DB in the future)
	ID         uint64 `gorm:"id" json:"-"`
	Name       string `gorm:"name" json:"name"`
	Weight     uint   `gorm:"weight" json:"weight"`
	CategoryID uint64
	Category   Category
}
