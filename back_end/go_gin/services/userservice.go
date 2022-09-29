package services

import (
	"errors"
	"hash"

	"github.com/M-Derbyshire/LifeScale/tree/main/back_end/go_gin/models"
	"gorm.io/gorm"
)

// Used to perform CRUD operations on User entities
type UserService struct {
	DB     *gorm.DB // The gorm DB instance to user
	Hasher hash.Hash
}

// Gets a user with the given ID (and all of its child entities)
func (us *UserService) Get(id uint64) (result models.User, err error) {

	user := models.User{}
	dbErr := us.DB.Preload("Scales.Categories.Actions.Timespans").First(&user, id).Error
	if dbErr != nil {
		return user, errors.New("error while getting user: " + dbErr.Error())
	}

	//Now resolve all entity IDs
	resolveErr := user.ResolveID()

	if resolveErr != nil {
		return user, resolveErr
	}

	user.Password = ""

	return user, nil
}

// Inserts a User (not including its child entities) into the database
func (us *UserService) Create(user models.User) (result models.User, err error) {

	user.Scales = []models.Scale{} //Don't want inner entities being saved through this method

	user.Password = string(us.Hasher.Sum([]byte(user.Password)))

	createResult := us.DB.Create(&user)
	if createResult.Error != nil {
		return user, errors.New("error while creating user: " + createResult.Error.Error())
	}

	user.ResolveID()
	user.Password = ""
	return user, nil
}
