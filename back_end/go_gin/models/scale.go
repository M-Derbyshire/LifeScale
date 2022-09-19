package models

type Scale struct {
	StrID           string `gorm:"-" json:"id"` //The front end uses strings for the ID (incase this needs to use a NoSQL DB in the future)
	ID              uint64 `gorm:"id" json:"-"`
	Name            string `gorm:"name" json:"name"`
	UsesTimespans   bool   `gorm:"usesTimespans" json:"usesTimespans"`
	DisplayDayCount uint   `gorm:"displayDayCount" json:"displayDayCount"`
	UserID          uint64
	User            User
}
