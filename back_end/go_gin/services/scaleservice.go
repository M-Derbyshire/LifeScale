package services

import (
	"errors"
	"strconv"
	"time"

	"github.com/M-Derbyshire/LifeScale/tree/main/back_end/go_gin/models"
	"gorm.io/gorm"
)

// Used to perform CRUD operations on scale entities
type ScaleService struct {
	DB *gorm.DB // The gorm DB instance to use
}

func (s *ScaleService) Get(id string, limitTimespansToDisplayDayCount bool) (models.Scale, error) {

	scale := models.Scale{}

	idNum, idNumErr := strconv.Atoi(id)

	if idNumErr != nil || idNum == 0 {
		return scale, errors.New("an invalid ID was provided")
	}

	preloadString := "Categories.Actions.Timespans"
	dbCallStart := s.DB

	//Should we limit the amount of timespans to just the scale's DisplayDayCount?
	if limitTimespansToDisplayDayCount {
		justScaleErr := s.DB.First(&scale, idNum).Error
		if justScaleErr != nil {
			return scale, errors.New("error while getting scale: " + justScaleErr.Error())
		}

		firstValidDay := time.Now().AddDate(0, 0, -int(scale.DisplayDayCount))
		dbCallStart = dbCallStart.Preload(preloadString, "timespans.Date >= ?", firstValidDay)
	} else {
		dbCallStart = dbCallStart.Preload(preloadString)
	}

	dbErr := dbCallStart.First(&scale, idNum).Error
	if dbErr != nil {
		return scale, errors.New("error while getting scale: " + dbErr.Error())
	}

	//Now resolve all entity IDs
	resolveErr := scale.ResolveID()

	if resolveErr != nil {
		return scale, resolveErr
	}

	return scale, nil
}

func (s *ScaleService) Create(scale models.Scale) (models.Scale, error) {

	scale.Categories = []models.Category{} //We don't want categories being saved through this method

	createErr := s.DB.Create(&scale).Error
	if createErr != nil {
		return scale, errors.New("error while creating scale: " + createErr.Error())
	}

	scale.ResolveID()

	return scale, nil
}

func (s *ScaleService) Update(newScaleData models.Scale) (models.Scale, error) {

	// We have to use a map, as booleans (UsesTimespans) can't be updated to false with a struct
	// https://stackoverflow.com/questions/56653423/gorm-doesnt-update-boolean-field-to-false
	dataForUpdate := map[string]interface{}{
		"Name":            newScaleData.Name,
		"UsesTimespans":   newScaleData.UsesTimespans,
		"DisplayDayCount": newScaleData.DisplayDayCount,
	}

	updateResult := s.DB.Model(&newScaleData).Updates(dataForUpdate)
	if updateResult.Error != nil {
		return newScaleData, errors.New("error while updating scale: " + updateResult.Error.Error())
	}

	resolveIdErr := newScaleData.ResolveID()
	if resolveIdErr != nil {
		return newScaleData, errors.New("error while processing scale after update has completed: " + updateResult.Error.Error())
	}

	return newScaleData, nil
}

func (s *ScaleService) Delete(scaleID uint64) error {
	delErr := s.DB.Delete(&models.Scale{}, scaleID).Error
	if delErr != nil {
		return errors.New("error while deleting scale: " + delErr.Error())
	}

	return nil
}
