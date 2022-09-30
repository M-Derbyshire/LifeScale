package services

import (
	"errors"

	"github.com/M-Derbyshire/LifeScale/tree/main/back_end/go_gin/models"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

// Used to perform CRUD operations on User entities
type UserService struct {
	DB *gorm.DB // The gorm DB instance to user
}

// Gets a user with the given ID (and all of its child entities). If no ID is provided (0 value), email will be used instead
func (us *UserService) Get(id uint64, email string, getInnerEntites bool) (result models.User, err error) {

	user := models.User{}

	if id == 0 && email == "" {
		return user, errors.New("no ID or email provided")
	}

	var dbCallStart *gorm.DB //Needs to be set to either preload or not, depending on getInnerEntites
	if getInnerEntites {
		dbCallStart = us.DB.Preload("Scales.Categories.Actions.Timespans")
	} else {
		dbCallStart = us.DB
	}

	var dbErr error
	if id > 0 {
		dbErr = dbCallStart.First(&user, id).Error
	} else {
		dbErr = dbCallStart.Where("email = ?", email).First(&user).Error
	}

	if dbErr != nil {
		return user, errors.New("error while getting user: " + dbErr.Error())
	}

	//Now resolve all entity IDs
	resolveErr := user.ResolveID()

	if resolveErr != nil {
		return user, resolveErr
	}

	return user, nil
}

// Inserts a User (not including its child entities) into the database
func (us *UserService) Create(user models.User) (result models.User, err error) {

	user.Scales = []models.Scale{} //Don't want inner entities being saved through this method

	passwordHashBytes, hashErr := bcrypt.GenerateFromPassword([]byte(user.Password), 14)
	if hashErr != nil {
		return models.User{}, errors.New("unable to process given password")
	}

	user.Password = string(passwordHashBytes)

	createResult := us.DB.Create(&user)
	user.Password = ""
	if createResult.Error != nil {
		return user, errors.New("error while creating user: " + createResult.Error.Error())
	}

	user.ResolveID()
	return user, nil
}
