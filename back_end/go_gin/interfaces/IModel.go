package interfaces

import (
	"github.com/M-Derbyshire/LifeScale/tree/main/back_end/go_gin/models"
	"gorm.io/gorm"
)

type IModel interface {
	Validate(authUser models.User, db gorm.DB, isCreating bool) error
	ValidateAuthorisation(authUser models.User, db gorm.DB) error
	ResolveID() error
	Sanitise()
}
