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

type ScaleRetrievalTimespanOption int

const (
	NoTimespans ScaleRetrievalTimespanOption = iota
	AllTimespans
	DisplayDayCountTimespans
)

func (s *ScaleService) Get(id string, timespanOption ScaleRetrievalTimespanOption) (models.Scale, error) {

	scale := models.Scale{}

	idNum, idNumErr := strconv.ParseInt(id, 10, 64)

	if idNumErr != nil || idNum == 0 {
		return scale, errors.New("an invalid ID was provided")
	}

	preloadString := "Categories.Actions.Timespans"
	dbCallStart := s.DB

	//Should we limit the amount of timespans to just the scale's DisplayDayCount?
	if timespanOption == DisplayDayCountTimespans {
		justScaleErr := s.DB.First(&scale, idNum).Error
		if justScaleErr != nil {
			return scale, errors.New("error while getting scale: " + justScaleErr.Error())
		}

		firstValidDay := time.Now().AddDate(0, 0, -int(scale.DisplayDayCount))
		dbCallStart = dbCallStart.Preload(preloadString, "timespans.Date >= ?", firstValidDay)
	} else if timespanOption == AllTimespans {
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

// If updating the DisplayDayCount value, all timespans that fall inside the new date limit will also get returned with their categories/actions
func (s *ScaleService) Update(newScaleData models.Scale) (models.Scale, error) {

	resolveErr := newScaleData.ResolveID()
	if resolveErr != nil {
		return newScaleData, resolveErr
	}

	//We need to get the scale's initial DisplayDayCount, as we want to return timespans if that's changed
	var displayDayCounts []uint
	getResult := s.DB.Model(&models.Scale{ID: newScaleData.ID}).Pluck("DisplayDayCount", &displayDayCounts)
	if getResult.Error != nil {
		return newScaleData, errors.New("error while retrieving scale: " + getResult.Error.Error())
	}

	if len(displayDayCounts) == 0 {
		return newScaleData, errors.New("the requested scale does not exist")
	}

	displayDayCountHasChanged := (displayDayCounts[0] != newScaleData.DisplayDayCount)

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

	//If this has changed, we need to get the scale again, with all included timespans
	if displayDayCountHasChanged {
		updatedScaleWithTimespans, getErr := s.Get(newScaleData.StrID, DisplayDayCountTimespans)
		if getErr != nil {
			return newScaleData, errors.New("error occurred after update of scale: " + getErr.Error())
		}

		return updatedScaleWithTimespans, nil
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
