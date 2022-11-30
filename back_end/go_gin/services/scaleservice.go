package services

import (
	"errors"

	"github.com/M-Derbyshire/LifeScale/tree/main/back_end/go_gin/models"
	"gorm.io/gorm"
)

// Used to perform CRUD operations on scale entities
type ScaleService struct {
	DB *gorm.DB // The gorm DB instance to use
}

func (s *ScaleService) Get(id uint64) (models.Scale, error) {

	scale := models.Scale{}

	if id == 0 {
		return scale, errors.New("an invalid ID was provided")
	}

	dbErr := s.DB.Preload("Categories.Actions.Timespans").First(&scale, id).Error
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
	return scale, nil
}

func (s *ScaleService) Update(newScaleData models.Scale) (models.Scale, error) {
	return newScaleData, nil
}
