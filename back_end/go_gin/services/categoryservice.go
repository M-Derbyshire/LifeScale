package services

import (
	"errors"
	"strconv"

	"github.com/M-Derbyshire/LifeScale/tree/main/back_end/go_gin/models"
	"gorm.io/gorm"
)

// Used to perform CRUD operations on category entities
type CategoryService struct {
	DB *gorm.DB // The gorm DB instance to use
}

func (s *CategoryService) Get(id string) (models.Category, error) {

	category := models.Category{}

	idNum, idNumErr := strconv.ParseInt(id, 10, 64)

	if idNumErr != nil || idNum == 0 {
		return category, errors.New("an invalid ID was provided")
	}

	dbErr := s.DB.First(&category, idNum).Error
	if dbErr != nil {
		return category, errors.New("error while getting category: " + dbErr.Error())
	}

	//Now resolve entity IDs
	resolveErr := category.ResolveID()

	if resolveErr != nil {
		return category, resolveErr
	}

	return category, nil
}

func (s *CategoryService) Create(category models.Category) (models.Category, error) {

	category.Actions = []models.Action{} //We don't want actions being saved through this method

	createErr := s.DB.Create(&category).Error
	if createErr != nil {
		return category, errors.New("error while creating category: " + createErr.Error())
	}

	category.ResolveID()

	return category, nil
}

func (s *CategoryService) Update(newCategoryData models.Category) (models.Category, error) {

	resolveErr := newCategoryData.ResolveID()
	if resolveErr != nil {
		return newCategoryData, resolveErr
	}

	dataForUpdate := map[string]interface{}{
		"Name":          newCategoryData.Name,
		"Color":         newCategoryData.Color,
		"DesiredWeight": newCategoryData.DesiredWeight,
	}

	updateResult := s.DB.Model(&newCategoryData).Updates(dataForUpdate)
	if updateResult.Error != nil {
		return newCategoryData, errors.New("error while updating category: " + updateResult.Error.Error())
	}

	resolveIdErr := newCategoryData.ResolveID()
	if resolveIdErr != nil {
		return newCategoryData, errors.New("error while processing category after update has completed: " + updateResult.Error.Error())
	}

	return newCategoryData, nil
}

func (s *CategoryService) Delete(categoryID uint64) error {
	delErr := s.DB.Delete(&models.Category{}, categoryID).Error
	if delErr != nil {
		return errors.New("error while deleting category: " + delErr.Error())
	}

	return nil
}
