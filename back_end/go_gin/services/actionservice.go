package services

import (
	"errors"
	"strconv"

	"github.com/M-Derbyshire/LifeScale/tree/main/back_end/go_gin/models"
	"gorm.io/gorm"
)

// Used to perform CRUD operations on action entities
type ActionService struct {
	DB *gorm.DB // The gorm DB instance to use
}

func (s *ActionService) Get(id string) (models.Action, error) {

	action := models.Action{}

	idNum, idNumErr := strconv.ParseInt(id, 10, 64)

	if idNumErr != nil || idNum == 0 {
		return action, errors.New("an invalid ID was provided")
	}

	dbErr := s.DB.First(&action, idNum).Error
	if dbErr != nil {
		return action, errors.New("error while getting action: " + dbErr.Error())
	}

	//Now resolve entity IDs
	resolveErr := action.ResolveID()

	if resolveErr != nil {
		return action, resolveErr
	}

	return action, nil
}

func (s *ActionService) Create(action models.Action) (models.Action, error) {

	action.Timespans = []models.Timespan{} //We don't want timepsans being saved through this method

	createErr := s.DB.Create(&action).Error
	if createErr != nil {
		return action, errors.New("error while creating action: " + createErr.Error())
	}

	action.ResolveID()

	return action, nil
}

func (s *ActionService) Update(newActionData models.Action) (models.Action, error) {

	resolveErr := newActionData.ResolveID()
	if resolveErr != nil {
		return newActionData, resolveErr
	}

	dataForUpdate := map[string]interface{}{
		"Name":   newActionData.Name,
		"Weight": newActionData.Weight,
	}

	updateResult := s.DB.Model(&newActionData).Updates(dataForUpdate)
	if updateResult.Error != nil {
		return newActionData, errors.New("error while updating action: " + updateResult.Error.Error())
	}

	resolveIdErr := newActionData.ResolveID()
	if resolveIdErr != nil {
		return newActionData, errors.New("error while processing action after update has completed: " + updateResult.Error.Error())
	}

	return newActionData, nil
}

func (s *ActionService) Delete(actionID uint64) error {
	delErr := s.DB.Delete(&models.Action{}, actionID).Error
	if delErr != nil {
		return errors.New("error while deleting action: " + delErr.Error())
	}

	return nil
}
