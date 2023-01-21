package services

import (
	"errors"
	"strconv"

	"github.com/M-Derbyshire/LifeScale/tree/main/back_end/go_gin/models"
	"gorm.io/gorm"
)

// Used to perform CRUD operations on timespan entities
type TimespanService struct {
	DB *gorm.DB // The gorm DB instance to use
}

func (s *TimespanService) Get(id string) (models.Timespan, error) {

	timespan := models.Timespan{}

	idNum, idNumErr := strconv.ParseInt(id, 10, 64)

	if idNumErr != nil || idNum == 0 {
		return timespan, errors.New("an invalid ID was provided")
	}

	dbErr := s.DB.First(&timespan, idNum).Error
	if dbErr != nil {
		return timespan, errors.New("error while getting timespan: " + dbErr.Error())
	}

	//Now resolve entity IDs
	resolveErr := timespan.ResolveID()

	if resolveErr != nil {
		return timespan, resolveErr
	}

	return timespan, nil
}

func (s *TimespanService) Create(timepsan models.Timespan) (models.Timespan, error) {

	createErr := s.DB.Create(&timepsan).Error
	if createErr != nil {
		return timepsan, errors.New("error while creating timepsan: " + createErr.Error())
	}

	timepsan.ResolveID()

	return timepsan, nil
}

func (s *TimespanService) Delete(timespanID uint64) error {
	delErr := s.DB.Delete(&models.Timespan{}, timespanID).Error
	if delErr != nil {
		return errors.New("error while deleting timespan: " + delErr.Error())
	}

	return nil
}
