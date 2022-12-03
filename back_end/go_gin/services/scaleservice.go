package services

import (
	"errors"
	"time"

	"github.com/M-Derbyshire/LifeScale/tree/main/back_end/go_gin/models"
	"gorm.io/gorm"
)

// Used to perform CRUD operations on scale entities
type ScaleService struct {
	DB *gorm.DB // The gorm DB instance to use
}

func (s *ScaleService) Get(id uint64, limitTimespansToDisplayDayCount bool) (models.Scale, error) {

	scale := models.Scale{}

	if id == 0 {
		return scale, errors.New("an invalid ID was provided")
	}

	preloadString := "Categories.Actions.Timespans"
	dbCallStart := s.DB

	//Should we limit the amount of timespans to just the scale's DisplayDayCount?
	if limitTimespansToDisplayDayCount {
		justScaleErr := s.DB.First(&scale, id).Error
		if justScaleErr != nil {
			return scale, errors.New("error while getting scale: " + justScaleErr.Error())
		}

		firstValidDay := time.Now().AddDate(0, 0, -int(scale.DisplayDayCount))
		dbCallStart = dbCallStart.Preload(preloadString, "timespans.Date >= ?", firstValidDay)
	} else {
		dbCallStart = dbCallStart.Preload(preloadString)
	}

	dbErr := dbCallStart.First(&scale, id).Error
	if dbErr != nil {
		return scale, errors.New("error while getting scale: " + dbErr.Error())
	}

	if scale.ID == 0 {
		return scale, errors.New("requested scale does not exist")
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
	return models.Scale{}, nil
}

func (s *ScaleService) Delete(scaleID uint64) error {
	return nil
}
