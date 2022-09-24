package services

import (
	"errors"

	"github.com/M-Derbyshire/LifeScale/tree/main/back_end/go_gin/models"
	"gorm.io/gorm"
)

type UserService struct {
	DB *gorm.DB
}

// Some of these methods aren't permitted, but we want to meet the IService interface

func (us *UserService) GetAll() (result []models.User, isUnauthorised bool, err error) {
	return []models.User{}, false, errors.New("requested operation (get all users) is not permitted")
}

func (us *UserService) Get(authUser models.User, id uint64) (result models.User, isUnauthorised bool, err error) {

	user := models.User{}

	if authUser.ID != id {
		return user, true, errors.New("user not authorised to access this user account")
	}

	dbErr := us.DB.Preload("Scales.Categories.Actions.Timespans").First(&user, id).Error
	if dbErr != nil {
		return user, false, errors.New("error while getting user: " + dbErr.Error())
	}

	//Now resolve all entity IDs
	var lastResolveErr error
	user.ResolveID()
	for scaleIdx, _ := range user.Scales {
		scalePtr := &user.Scales[scaleIdx]
		lastResolveErr = scalePtr.ResolveID()

		for catIdx, _ := range scalePtr.Categories {
			categoryPtr := &scalePtr.Categories[catIdx]
			lastResolveErr = categoryPtr.ResolveID()

			for actIdx, _ := range categoryPtr.Actions {
				actionPtr := &categoryPtr.Actions[actIdx]
				lastResolveErr = actionPtr.ResolveID()

				for tsIdx, _ := range actionPtr.Timespans {
					lastResolveErr = actionPtr.Timespans[tsIdx].ResolveID()
				}
			}
		}
	}

	if lastResolveErr != nil {
		return user, false, lastResolveErr
	}

	return user, false, nil
}

func (us *UserService) Create(authUser, user models.User) (result models.User, isUnauthorised bool, err error) {

	user.Scales = []models.Scale{} //Don't want inner entities being saved through this method

	createResult := us.DB.Create(&user)
	if createResult.Error != nil {
		return user, false, errors.New("error while creating user: " + createResult.Error.Error())
	}

	user.ResolveID()
	return user, false, nil
}
