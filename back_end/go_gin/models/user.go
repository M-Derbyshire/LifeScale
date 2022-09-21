package models

type User struct {
	StrID   string  `gorm:"-" json:"id"` //The front end uses strings for the ID (incase this needs to use a NoSQL DB in the future)
	ID      uint64  `gorm:"id" json:"-"`
	Email   string  `gorm:"email;unique" json:"email"`
	Forname string  `gorm:"forename" json:"forename"`
	Surname string  `gorm:"surname" json:"surname"`
	Scales  []Scale `json:"scales"`
}
